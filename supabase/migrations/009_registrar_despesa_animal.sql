-- ============================================================================
-- Financial Pig MVP - registrar_despesa_animal (real implementation)
-- Source of truth: specs/001-mvp-financial-pig/schema.md (despesas_animais,
--   history_type 'despesa_registrada')
--
-- Covers task:
--   T074 (backing RPC) Atomic animal expense registration + history.
--
-- Animal expenses reduce cash: dashboard_mensal (migration 003) already sums
-- despesas_animais.valor into the cash outflows and into despesas_animais_total,
-- so no balance bookkeeping is needed here. This RPC keeps the record + history
-- insert atomic and user-scoped, consistent with the other write flows.
--
-- Precision: money normalized to 2 decimals before persisting.
--
-- SECURITY DEFINER CONTRACT (see 002_business_rpcs.sql): bypasses RLS, so the
-- inserts are scoped to v_user_id.
-- ============================================================================

create or replace function registrar_despesa_animal(
  p_categoria animal_expense_category,
  p_valor numeric,
  p_descricao text,
  p_data_despesa date,
  p_observacao text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_valor numeric := round(coalesce(p_valor, 0), 2);
  v_id uuid;
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado.';
  end if;
  if p_descricao is null or length(trim(p_descricao)) = 0 then
    raise exception 'Descrição é obrigatória.';
  end if;
  if p_valor is null or v_valor <= 0 then
    raise exception 'Valor deve ser maior que zero.';
  end if;
  if p_data_despesa is null then
    raise exception 'Data da despesa é obrigatória.';
  end if;

  insert into despesas_animais (
    user_id, categoria, valor, descricao, data_despesa, observacao
  ) values (
    v_user_id, p_categoria, v_valor, p_descricao, p_data_despesa, p_observacao
  )
  returning id into v_id;

  insert into historico (
    user_id, tipo, entidade, entidade_id, descricao, valor
  ) values (
    v_user_id, 'despesa_registrada', 'despesas_animais', v_id,
    'Despesa registrada: ' || p_descricao, v_valor
  );

  return v_id;
end;
$$;

revoke execute on function registrar_despesa_animal(
  animal_expense_category, numeric, text, date, text
) from public;

grant execute on function registrar_despesa_animal(
  animal_expense_category, numeric, text, date, text
) to authenticated;
