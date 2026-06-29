-- ============================================================================
-- Financial Pig MVP - atualizar_capital_inicial (US9: configure initial cash)
-- Source of truth: specs/001-mvp-financial-pig/tasks.md (Phase 12 / US9)
--
-- Covers task:
--   T104 (backing RPC) Set the user's initial cash/capital ("Começou com quanto?").
--
-- The dashboard cash balance (dashboard_mensal, migration 003) starts from
-- configuracoes.capital_inicial, so updating it here shifts the balance by
-- exactly the difference. Idempotent and upsert-safe: it creates the settings
-- row if missing (e.g. user who never ran inicializar_dados) and updates it
-- otherwise.
--
-- SECURITY DEFINER CONTRACT (see 002_business_rpcs.sql): bypasses RLS; all
-- access is scoped to v_user_id.
-- ============================================================================

create or replace function atualizar_capital_inicial(p_capital_inicial numeric)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_valor numeric := round(coalesce(p_capital_inicial, 0), 2);
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado.';
  end if;
  if p_capital_inicial is null or v_valor < 0 then
    raise exception 'Capital inicial não pode ser negativo.';
  end if;

  insert into configuracoes (user_id, capital_inicial)
  values (v_user_id, v_valor)
  on conflict (user_id) do update set capital_inicial = excluded.capital_inicial;

  return v_valor;
end;
$$;

revoke execute on function atualizar_capital_inicial(numeric) from public;
grant execute on function atualizar_capital_inicial(numeric) to authenticated;
