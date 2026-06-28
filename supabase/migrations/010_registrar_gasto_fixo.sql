-- ============================================================================
-- Financial Pig MVP - registrar_gasto_fixo (real implementation)
-- Source of truth: specs/001-mvp-financial-pig/schema.md (gastos_fixos,
--   history_type 'gasto_fixo_registrado')
--
-- Covers task:
--   T075 (backing RPC) Atomic fixed/construction cost registration + history.
--
-- Fixed/construction costs reduce cash and are kept SEPARATE from animal
-- expenses: dashboard_mensal (migration 003) sums gastos_fixos.valor into the
-- cash outflows and into gastos_fixos_total, and excludes them from
-- lucro_operacional (so the operational result is not distorted by construction).
-- This RPC keeps the record + history insert atomic and user-scoped.
--
-- Precision: money normalized to 2 decimals before persisting.
--
-- SECURITY DEFINER CONTRACT (see 002_business_rpcs.sql): bypasses RLS, so the
-- inserts are scoped to v_user_id.
-- ============================================================================

create or replace function registrar_gasto_fixo(
  p_categoria fixed_cost_category,
  p_valor numeric,
  p_descricao text,
  p_data_gasto date,
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
  if p_data_gasto is null then
    raise exception 'Data do gasto é obrigatória.';
  end if;

  insert into gastos_fixos (
    user_id, categoria, valor, descricao, data_gasto, observacao
  ) values (
    v_user_id, p_categoria, v_valor, p_descricao, p_data_gasto, p_observacao
  )
  returning id into v_id;

  insert into historico (
    user_id, tipo, entidade, entidade_id, descricao, valor
  ) values (
    v_user_id, 'gasto_fixo_registrado', 'gastos_fixos', v_id,
    'Gasto fixo registrado: ' || p_descricao, v_valor
  );

  return v_id;
end;
$$;

revoke execute on function registrar_gasto_fixo(
  fixed_cost_category, numeric, text, date, text
) from public;

grant execute on function registrar_gasto_fixo(
  fixed_cost_category, numeric, text, date, text
) to authenticated;
