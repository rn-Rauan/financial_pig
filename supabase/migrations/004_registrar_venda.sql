-- ============================================================================
-- Financial Pig MVP - registrar_venda (real implementation)
-- Source of truth: specs/001-mvp-financial-pig/schema.md ("registrar_venda")
--
-- Covers task:
--   T045 (backing RPC) Atomic sale registration with financial + stock effects.
--
-- Replaces the stub from 002_business_rpcs.sql. Other write RPCs remain stubs.
--
-- Behavior (atomic, single transaction):
--   1. Authenticate (auth.uid()) and validate inputs.
--   2. Compute valor_total, valor_restante, status_pagamento.
--   3. Reject overpayment, missing animals for pork/meat, invalid qty/price.
--   4. Determine and lock the affected stock item:
--        porco_carne -> pig stock, decremented by animais_utilizados (heads)
--        milho       -> corn stock, decremented by quantidade
--        racao       -> feed stock, decremented by quantidade
--        outros      -> no stock effect
--   5. Reject insufficient stock (DB check `quantidade_atual >= 0` is a backstop).
--   6. Insert the sale, the stock movement (when applicable), update the stock
--      item, and write a history entry.
--
-- SECURITY DEFINER CONTRACT (see 002_business_rpcs.sql): bypasses RLS, so every
-- read/write is scoped to v_user_id and passed-in foreign ids are ownership-checked.
-- ============================================================================

create or replace function registrar_venda(
  p_tipo_venda sale_type,
  p_produto text,
  p_quantidade numeric,
  p_unidade stock_unit,
  p_preco_unitario numeric,
  p_valor_pago numeric,
  p_data_venda date,
  p_cliente_id uuid default null,
  p_nome_cliente text default null,
  p_animais_utilizados integer default null,
  p_observacao text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_quantidade numeric := round(coalesce(p_quantidade, 0), 3);
  v_preco_unitario numeric := round(coalesce(p_preco_unitario, 0), 2);
  v_valor_pago numeric := round(coalesce(p_valor_pago, 0), 2);
  v_valor_total numeric;
  v_valor_restante numeric;
  v_status sale_status;
  v_venda_id uuid;
  v_item_id uuid;
  v_item_qtd numeric;
  v_baixa numeric;        -- amount removed from stock (null = no stock effect)
  v_motivo text;
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado.';
  end if;

  -- ---- Basic input validation -----------------------------------------
  if p_produto is null or length(trim(p_produto)) = 0 then
    raise exception 'Produto é obrigatório.';
  end if;
  if p_quantidade is null or v_quantidade <= 0 then
    raise exception 'Quantidade deve ser maior que zero.';
  end if;
  if p_preco_unitario is null or v_preco_unitario <= 0 then
    raise exception 'Preço unitário deve ser maior que zero.';
  end if;
  if p_data_venda is null then
    raise exception 'Data da venda é obrigatória.';
  end if;
  if v_valor_pago < 0 then
    raise exception 'Valor pago não pode ser negativo.';
  end if;

  -- ---- Totals and status ----------------------------------------------
  -- Normalize values to the same precision as the persisted columns before
  -- calculating totals, remaining amount, and stock effects.
  v_valor_total := round(v_quantidade * v_preco_unitario, 2);

  if v_valor_pago > v_valor_total then
    raise exception 'Valor pago não pode exceder o total da venda.';
  end if;

  v_valor_restante := v_valor_total - v_valor_pago;

  if v_valor_pago <= 0 then
    v_status := 'fiado';
  elsif v_valor_pago >= v_valor_total then
    v_status := 'pago';
  else
    v_status := 'parcial';
  end if;

  -- ---- Pork/meat requires animals -------------------------------------
  if p_tipo_venda = 'porco_carne'
     and (p_animais_utilizados is null or p_animais_utilizados <= 0) then
    raise exception 'Informe os animais utilizados para venda de porco/carne.';
  end if;

  -- ---- Validate customer ownership when provided -----------------------
  if p_cliente_id is not null then
    perform 1 from clientes
    where id = p_cliente_id and user_id = v_user_id and ativo = true;
    if not found then
      raise exception 'Cliente inválido.';
    end if;
  end if;

  -- ---- Resolve and lock the affected stock item -----------------------
  if p_tipo_venda = 'porco_carne' then
    v_baixa := p_animais_utilizados;
    v_motivo := 'Venda de porco/carne';
    select id, quantidade_atual into v_item_id, v_item_qtd
    from estoque_itens
    where user_id = v_user_id and ativo = true and nome ilike '%porco%'
    order by created_at
    limit 1
    for update;
  elsif p_tipo_venda = 'milho' then
    v_baixa := v_quantidade;
    v_motivo := 'Venda de milho';
    select id, quantidade_atual into v_item_id, v_item_qtd
    from estoque_itens
    where user_id = v_user_id and ativo = true and nome ilike '%milho%'
    order by created_at
    limit 1
    for update;
  elsif p_tipo_venda = 'racao' then
    v_baixa := v_quantidade;
    v_motivo := 'Venda de ração';
    select id, quantidade_atual into v_item_id, v_item_qtd
    from estoque_itens
    where user_id = v_user_id and ativo = true
      and (nome ilike '%ração%' or nome ilike '%racao%')
    order by created_at
    limit 1
    for update;
  else
    v_baixa := null; -- 'outros': no stock effect
  end if;

  if v_baixa is not null then
    if v_item_id is null then
      raise exception 'Item de estoque não encontrado para o tipo de venda.';
    end if;
    if v_item_qtd < v_baixa then
      raise exception 'Estoque insuficiente para esta venda.';
    end if;
  end if;

  -- ---- Insert the sale -------------------------------------------------
  insert into vendas (
    user_id, cliente_id, nome_cliente, tipo_venda, produto, quantidade,
    unidade, animais_utilizados, preco_unitario, valor_total, valor_pago,
    valor_restante, status_pagamento, data_venda, observacao
  ) values (
    v_user_id, p_cliente_id, p_nome_cliente, p_tipo_venda, p_produto, v_quantidade,
    p_unidade, p_animais_utilizados, v_preco_unitario, v_valor_total, v_valor_pago,
    v_valor_restante, v_status, p_data_venda, p_observacao
  )
  returning id into v_venda_id;

  -- ---- Apply stock effect ---------------------------------------------
  if v_baixa is not null then
    update estoque_itens
    set quantidade_atual = quantidade_atual - v_baixa
    where id = v_item_id and user_id = v_user_id;

    insert into estoque_movimentacoes (
      user_id, estoque_item_id, venda_id, tipo_movimentacao, quantidade,
      motivo, data_movimentacao
    ) values (
      v_user_id, v_item_id, v_venda_id, 'saida', v_baixa,
      v_motivo, p_data_venda
    );
  end if;

  -- ---- History entry ---------------------------------------------------
  insert into historico (
    user_id, tipo, entidade, entidade_id, descricao, valor, quantidade
  ) values (
    v_user_id, 'venda_registrada', 'vendas', v_venda_id,
    'Venda registrada: ' || p_produto, v_valor_total, v_quantidade
  );

  return v_venda_id;
end;
$$;

revoke execute on function registrar_venda(
  sale_type, text, numeric, stock_unit, numeric, numeric, date, uuid, text,
  integer, text
) from public;

grant execute on function registrar_venda(
  sale_type, text, numeric, stock_unit, numeric, numeric, date, uuid, text,
  integer, text
) to authenticated;
