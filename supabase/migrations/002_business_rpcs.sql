-- ============================================================================
-- Financial Pig MVP - Business RPC stubs
-- Source of truth: specs/001-mvp-financial-pig/schema.md ("Required RPC Functions")
--
-- Covers task:
--   T016 RPC stubs for the coupled, transaction-safe business operations.
--
-- These are STUBS. Each function signature, return shape, and the documented
-- step list are defined here so the client service wrappers can be built against
-- a stable contract. Full atomic logic (validation, stock checks, history
-- inserts, compensating movements) is implemented in the corresponding user
-- story phases (US3 sales, US4 payments, US5 purchases/stock/consumption,
-- US7 inactivation).
--
-- All functions run with `security definer` and `set search_path = public` so
-- RLS-protected writes happen with consistent, user-scoped semantics. Each stub
-- raises `not yet implemented` so it can never silently corrupt data if called
-- before its phase is complete.
--
-- SECURITY DEFINER CONTRACT (mandatory for every real implementation):
--   * security definer functions run with the OWNER's privileges and therefore
--     BYPASS RLS. The function body must re-establish user scoping manually:
--       - resolve `v_user_id := auth.uid()` and reject when null
--         (raise exception on unauthenticated calls);
--       - set `user_id = v_user_id` on every INSERT;
--       - filter every SELECT/UPDATE with `where user_id = v_user_id`;
--       - verify that any passed-in foreign id (venda_id, estoque_item_id,
--         cliente_id, compra_id) belongs to v_user_id before using it
--         (this also closes the same-user FK gap noted in 001_initial_schema.sql).
--   * keep `set search_path = public` to prevent search_path hijacking.
--   * grant execute narrowly (e.g. to `authenticated`), not to `public`.
-- ============================================================================

-- registrar_venda -----------------------------------------------------------
-- Atomically: validate input; check stock when applicable; insert sale with
-- computed total/paid/remaining/status; insert stock movement; update stock
-- item; insert history. Rejects overpayment, missing animals for pork/meat,
-- invalid quantity/value, and insufficient stock.
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
begin
  raise exception 'registrar_venda not yet implemented (US3)';
end;
$$;

-- registrar_pagamento_venda -------------------------------------------------
-- Atomically: lock/read sale; validate payment > 0 and <= remaining; insert
-- payment row; update sale paid/remaining/status; insert history.
create or replace function registrar_pagamento_venda(
  p_venda_id uuid,
  p_valor numeric,
  p_data_pagamento date,
  p_observacao text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'registrar_pagamento_venda not yet implemented (US4)';
end;
$$;

-- registrar_compra ----------------------------------------------------------
-- Atomically: validate input; insert purchase with computed total; increase
-- stock for pigs/corn/feed; insert stock movement when applicable; insert
-- history.
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
begin
  raise exception 'registrar_compra not yet implemented (US5)';
end;
$$;

-- registrar_movimentacao_estoque --------------------------------------------
-- Atomically: validate input; compute stock effect; reject negative resulting
-- stock; insert movement; update stock item; insert history.
create or replace function registrar_movimentacao_estoque(
  p_estoque_item_id uuid,
  p_tipo_movimentacao stock_movement_type,
  p_quantidade numeric,
  p_motivo text,
  p_data_movimentacao date,
  p_observacao text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'registrar_movimentacao_estoque not yet implemented (US5)';
end;
$$;

-- registrar_consumo ---------------------------------------------------------
-- May delegate to registrar_movimentacao_estoque with type 'consumo', but must
-- restrict items to corn/feed and reject insufficient stock.
create or replace function registrar_consumo(
  p_estoque_item_id uuid,
  p_quantidade numeric,
  p_motivo text,
  p_data_movimentacao date,
  p_observacao text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'registrar_consumo not yet implemented (US5)';
end;
$$;

-- inativar_registro ---------------------------------------------------------
-- Atomically soft-deletes a supported record (ativo = false) and applies
-- compensating effects when needed (sales with stock/payment effects require
-- special handling to keep dashboard/stock totals correct).
create or replace function inativar_registro(
  p_entidade text,
  p_registro_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'inativar_registro not yet implemented (US7)';
end;
$$;
