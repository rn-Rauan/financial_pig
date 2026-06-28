-- ============================================================================
-- Financial Pig MVP - inicializar_dados (per-user setup / seed)
-- Source of truth: specs/001-mvp-financial-pig/schema.md ("Seed default stock
--   items after first login/configuration ... or via a setup RPC")
--
-- Idempotent setup for the authenticated user:
--   1. Ensure the single `configuracoes` row exists.
--   2. Seed the default stock items (Porcos/leitões, Milho, Ração) once, so that
--      pig/corn/feed purchases, sales and consumption can resolve their stock
--      item (otherwise the RPCs raise "Item de estoque não encontrado").
--
-- A plain SQL seed cannot be used here because every row needs the per-user
-- `user_id` (auth.uid()), which only exists in an authenticated request. This RPC
-- runs as the authenticated user and is safe to call on every login: it never
-- duplicates data (configuracoes has a unique user_id; stock is seeded only when
-- the user has no items yet).
--
-- SECURITY DEFINER CONTRACT (see 002_business_rpcs.sql): bypasses RLS; all writes
-- are scoped to v_user_id.
-- ============================================================================

create or replace function inicializar_dados()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado.';
  end if;

  -- One settings row per user (defaults: capital 0, BRL, "Financial Pig").
  insert into configuracoes (user_id)
  values (v_user_id)
  on conflict (user_id) do nothing;

  -- Seed default stock items only if the user has none yet.
  if not exists (select 1 from estoque_itens where user_id = v_user_id) then
    insert into estoque_itens (user_id, nome, quantidade_atual, unidade) values
      (v_user_id, 'Porcos/leitões', 0, 'cabeca'),
      (v_user_id, 'Milho', 0, 'saca'),
      (v_user_id, 'Ração', 0, 'saca');
  end if;
end;
$$;

revoke execute on function inicializar_dados() from public;
grant execute on function inicializar_dados() to authenticated;
