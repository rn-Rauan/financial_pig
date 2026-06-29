-- ============================================================================
-- Financial Pig MVP - tighten initial cash validation
--
-- Migration 014 introduced atualizar_capital_inicial. This migration keeps the
-- same RPC contract but validates the raw input before rounding so tiny negative
-- values (for example -0.004) are rejected instead of becoming 0.00.
-- ============================================================================

create or replace function atualizar_capital_inicial(p_capital_inicial numeric)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_valor numeric;
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado.';
  end if;
  if p_capital_inicial is null or p_capital_inicial < 0 then
    raise exception 'Capital inicial não pode ser negativo.';
  end if;

  v_valor := round(p_capital_inicial, 2);

  insert into configuracoes (user_id, capital_inicial)
  values (v_user_id, v_valor)
  on conflict (user_id) do update set capital_inicial = excluded.capital_inicial;

  return v_valor;
end;
$$;

revoke execute on function atualizar_capital_inicial(numeric) from public;
grant execute on function atualizar_capital_inicial(numeric) to authenticated;
