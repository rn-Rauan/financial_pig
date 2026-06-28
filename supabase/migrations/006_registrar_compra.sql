-- ============================================================================
-- Financial Pig MVP - registrar_compra (real implementation)
-- Source of truth: specs/001-mvp-financial-pig/schema.md ("registrar_compra")
--
-- Covers task:
--   T063 (backing RPC) Atomic purchase registration with stock + history.
--
-- Replaces the stub from 002_business_rpcs.sql. Other stub RPCs are unchanged.
--
-- Behavior (atomic, single transaction):
--   1. Authenticate (auth.uid()) and validate inputs.
--   2. Compute valor_total and insert the purchase.
--   3. Increase stock for pigs/corn/feed purchase types by quantidade:
--        porcos_leitoes -> pig stock
--        milho          -> corn stock
--        racao          -> feed stock
--        outros         -> no stock effect
--   4. Insert an 'entrada' stock movement (when applicable) and update the item.
--   5. Write a history entry (compra_registrada).
--
-- Precision: quantity normalized to 3 decimals, money to 2 decimals before
-- calculating/persisting (matches the persisted column scales).
--
-- SECURITY DEFINER CONTRACT (see 002_business_rpcs.sql): bypasses RLS, so every
-- read/write is scoped to v_user_id.
-- ============================================================================

create or replace function registrar_compra(
  p_tipo_compra purchase_type,
  p_produto text,
  p_quantidade numeric,
  p_unidade stock_unit,
  p_valor_unitario numeric,
  p_data_compra date,
  p_fornecedor text default null,
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
  v_valor_unitario numeric := round(coalesce(p_valor_unitario, 0), 2);
  v_valor_total numeric;
  v_compra_id uuid;
  v_item_id uuid;
  v_motivo text;
  v_afeta_estoque boolean := true;
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
  if p_valor_unitario is null or v_valor_unitario <= 0 then
    raise exception 'Valor unitário deve ser maior que zero.';
  end if;
  if p_data_compra is null then
    raise exception 'Data da compra é obrigatória.';
  end if;

  v_valor_total := round(v_quantidade * v_valor_unitario, 2);

  -- ---- Insert the purchase --------------------------------------------
  insert into compras (
    user_id, tipo_compra, produto, quantidade, unidade, valor_unitario,
    valor_total, fornecedor, data_compra, observacao
  ) values (
    v_user_id, p_tipo_compra, p_produto, v_quantidade, p_unidade, v_valor_unitario,
    v_valor_total, p_fornecedor, p_data_compra, p_observacao
  )
  returning id into v_compra_id;

  -- ---- Resolve affected stock item ------------------------------------
  if p_tipo_compra = 'porcos_leitoes' then
    v_motivo := 'Compra de porcos/leitões';
    select id into v_item_id
    from estoque_itens
    where user_id = v_user_id and ativo = true and nome ilike '%porco%'
    order by created_at
    limit 1
    for update;
  elsif p_tipo_compra = 'milho' then
    v_motivo := 'Compra de milho';
    select id into v_item_id
    from estoque_itens
    where user_id = v_user_id and ativo = true and nome ilike '%milho%'
    order by created_at
    limit 1
    for update;
  elsif p_tipo_compra = 'racao' then
    v_motivo := 'Compra de ração';
    select id into v_item_id
    from estoque_itens
    where user_id = v_user_id and ativo = true
      and (nome ilike '%ração%' or nome ilike '%racao%')
    order by created_at
    limit 1
    for update;
  else
    v_afeta_estoque := false; -- 'outros': no stock effect
  end if;

  -- ---- Apply stock effect ---------------------------------------------
  if v_afeta_estoque then
    if v_item_id is null then
      raise exception 'Item de estoque não encontrado para o tipo de compra.';
    end if;

    update estoque_itens
    set quantidade_atual = quantidade_atual + v_quantidade
    where id = v_item_id and user_id = v_user_id;

    insert into estoque_movimentacoes (
      user_id, estoque_item_id, compra_id, tipo_movimentacao, quantidade,
      motivo, data_movimentacao
    ) values (
      v_user_id, v_item_id, v_compra_id, 'entrada', v_quantidade,
      v_motivo, p_data_compra
    );
  end if;

  -- ---- History entry ---------------------------------------------------
  insert into historico (
    user_id, tipo, entidade, entidade_id, descricao, valor, quantidade
  ) values (
    v_user_id, 'compra_registrada', 'compras', v_compra_id,
    'Compra registrada: ' || p_produto, v_valor_total, v_quantidade
  );

  return v_compra_id;
end;
$$;

revoke execute on function registrar_compra(
  purchase_type, text, numeric, stock_unit, numeric, date, text, text
) from public;

grant execute on function registrar_compra(
  purchase_type, text, numeric, stock_unit, numeric, date, text, text
) to authenticated;
