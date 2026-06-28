-- ============================================================================
-- Financial Pig MVP - inativar_registro (real implementation)
-- Source of truth: specs/001-mvp-financial-pig/schema.md ("inativar_registro")
--
-- Covers task:
--   T085 (backing RPC) Atomic soft delete (ativo = false) with compensating
--   stock/financial effects so dashboard and stock totals stay correct.
--
-- Replaces the stub from 002_business_rpcs.sql. All other RPCs are now real.
--
-- Supported entities and compensation (atomic, single transaction):
--   'vendas'           -> restore stock removed by the sale's 'saida' movements,
--                         inactivate those movements and any later payments, then
--                         inactivate the sale; history 'venda_cancelada'.
--   'compras'          -> reverse the stock added by the purchase's 'entrada'
--                         movements; REJECT if that stock was already used (would
--                         go negative); inactivate movements + purchase;
--                         history 'registro_inativado'.
--   'despesas_animais' -> inactivate; cash recomputed by dashboard_mensal.
--   'gastos_fixos'     -> inactivate; cash recomputed by dashboard_mensal.
--   'clientes'         -> inactivate; existing sales keep their stored name.
--
-- Cash/receivables need no manual bookkeeping: dashboard_mensal (003) derives
-- them from active rows only, so setting ativo = false removes the record's
-- contribution automatically.
--
-- SECURITY DEFINER CONTRACT (see 002_business_rpcs.sql): bypasses RLS; every
-- read/write is scoped to v_user_id and ownership is verified before changes.
-- ============================================================================

create or replace function inativar_registro(
  p_entidade text,
  p_registro_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_found boolean;
  v_qtd numeric;
  rec record;
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado.';
  end if;
  if p_registro_id is null then
    raise exception 'Registro inválido.';
  end if;

  if p_entidade = 'vendas' then
    select true into v_found from vendas
    where id = p_registro_id and user_id = v_user_id and ativo = true;
    if not found then raise exception 'Venda não encontrada.'; end if;

    -- Restore stock removed by the sale and inactivate those movements.
    for rec in
      select id, estoque_item_id, quantidade
      from estoque_movimentacoes
      where venda_id = p_registro_id and user_id = v_user_id and ativo = true
    loop
      update estoque_itens
      set quantidade_atual = quantidade_atual + rec.quantidade
      where id = rec.estoque_item_id and user_id = v_user_id;
      update estoque_movimentacoes set ativo = false where id = rec.id;
    end loop;

    -- Inactivate later payments tied to this sale.
    update pagamentos_venda set ativo = false
    where venda_id = p_registro_id and user_id = v_user_id and ativo = true;

    update vendas set ativo = false
    where id = p_registro_id and user_id = v_user_id;

    insert into historico (user_id, tipo, entidade, entidade_id, descricao)
    values (v_user_id, 'venda_cancelada', 'vendas', p_registro_id,
            'Venda inativada');

  elsif p_entidade = 'compras' then
    select true into v_found from compras
    where id = p_registro_id and user_id = v_user_id and ativo = true;
    if not found then raise exception 'Compra não encontrada.'; end if;

    -- Reverse stock added by the purchase; reject if already consumed/sold.
    for rec in
      select id, estoque_item_id, quantidade
      from estoque_movimentacoes
      where compra_id = p_registro_id and user_id = v_user_id and ativo = true
    loop
      select quantidade_atual into v_qtd
      from estoque_itens
      where id = rec.estoque_item_id and user_id = v_user_id
      for update;

      if v_qtd - rec.quantidade < 0 then
        raise exception 'Não é possível inativar: o estoque desta compra já foi utilizado.';
      end if;

      update estoque_itens
      set quantidade_atual = quantidade_atual - rec.quantidade
      where id = rec.estoque_item_id and user_id = v_user_id;
      update estoque_movimentacoes set ativo = false where id = rec.id;
    end loop;

    update compras set ativo = false
    where id = p_registro_id and user_id = v_user_id;

    insert into historico (user_id, tipo, entidade, entidade_id, descricao)
    values (v_user_id, 'registro_inativado', 'compras', p_registro_id,
            'Compra inativada');

  elsif p_entidade = 'despesas_animais' then
    update despesas_animais set ativo = false
    where id = p_registro_id and user_id = v_user_id and ativo = true;
    if not found then raise exception 'Despesa não encontrada.'; end if;

    insert into historico (user_id, tipo, entidade, entidade_id, descricao)
    values (v_user_id, 'registro_inativado', 'despesas_animais', p_registro_id,
            'Despesa inativada');

  elsif p_entidade = 'gastos_fixos' then
    update gastos_fixos set ativo = false
    where id = p_registro_id and user_id = v_user_id and ativo = true;
    if not found then raise exception 'Gasto fixo não encontrado.'; end if;

    insert into historico (user_id, tipo, entidade, entidade_id, descricao)
    values (v_user_id, 'registro_inativado', 'gastos_fixos', p_registro_id,
            'Gasto fixo inativado');

  elsif p_entidade = 'clientes' then
    update clientes set ativo = false
    where id = p_registro_id and user_id = v_user_id and ativo = true;
    if not found then raise exception 'Cliente não encontrado.'; end if;

    insert into historico (user_id, tipo, entidade, entidade_id, descricao)
    values (v_user_id, 'registro_inativado', 'clientes', p_registro_id,
            'Cliente inativado');

  else
    raise exception 'Entidade não suportada para inativação.';
  end if;
end;
$$;

revoke execute on function inativar_registro(text, uuid) from public;
grant execute on function inativar_registro(text, uuid) to authenticated;
