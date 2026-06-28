-- ============================================================================
-- Financial Pig MVP - registrar_pagamento_venda (real implementation)
-- Source of truth: specs/001-mvp-financial-pig/schema.md ("registrar_pagamento_venda")
--
-- Covers task:
--   T056 (backing RPC) Atomic later-payment registration for credit/partial sales.
--
-- Replaces the stub from 002_business_rpcs.sql. Other write RPCs remain stubs.
--
-- Behavior (atomic, single transaction):
--   1. Authenticate (auth.uid()) and validate inputs.
--   2. Lock the target sale (scoped to the user, ativo = true).
--   3. Reject payment when the sale is already settled or when the value
--      exceeds the remaining amount.
--   4. Insert the payment row in pagamentos_venda.
--   5. Update the sale: valor_pago, valor_restante, status_pagamento.
--   6. Write a history entry (pagamento_recebido).
--
-- Cash semantics: dashboard_mensal (migration 003) reads received money from
-- vendas.valor_pago only. By updating that aggregate field here, the later
-- payment is reflected in the cash balance without double-counting the
-- pagamentos_venda row.
--
-- SECURITY DEFINER CONTRACT (see 002_business_rpcs.sql): bypasses RLS, so every
-- read/write is scoped to v_user_id and the sale ownership is verified.
-- ============================================================================

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
declare
  v_user_id uuid := auth.uid();
  v_valor numeric := round(coalesce(p_valor, 0), 2);
  v_total numeric;
  v_pago numeric;
  v_restante numeric;
  v_novo_pago numeric;
  v_novo_restante numeric;
  v_status sale_status;
  v_pagamento_id uuid;
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado.';
  end if;
  if p_data_pagamento is null then
    raise exception 'Data do pagamento é obrigatória.';
  end if;
  if v_valor <= 0 then
    raise exception 'Valor do pagamento deve ser maior que zero.';
  end if;

  -- ---- Lock the sale (ownership + active scoped) ----------------------
  select valor_total, valor_pago, valor_restante
  into v_total, v_pago, v_restante
  from vendas
  where id = p_venda_id and user_id = v_user_id and ativo = true
  for update;

  if not found then
    raise exception 'Venda não encontrada.';
  end if;

  if v_restante <= 0 then
    raise exception 'Esta venda já está quitada.';
  end if;

  if v_valor > v_restante then
    raise exception 'Pagamento não pode exceder o valor restante.';
  end if;

  -- ---- Recalculate paid / remaining / status -------------------------
  v_novo_pago := round(v_pago + v_valor, 2);
  v_novo_restante := round(v_total - v_novo_pago, 2);

  if v_novo_restante <= 0 then
    v_status := 'pago';
    v_novo_restante := 0;
  else
    v_status := 'parcial';
  end if;

  -- ---- Insert the payment --------------------------------------------
  insert into pagamentos_venda (
    user_id, venda_id, valor, data_pagamento, observacao
  ) values (
    v_user_id, p_venda_id, v_valor, p_data_pagamento, p_observacao
  )
  returning id into v_pagamento_id;

  -- ---- Update the sale aggregates ------------------------------------
  update vendas
  set valor_pago = v_novo_pago,
      valor_restante = v_novo_restante,
      status_pagamento = v_status
  where id = p_venda_id and user_id = v_user_id;

  -- ---- History entry --------------------------------------------------
  insert into historico (
    user_id, tipo, entidade, entidade_id, descricao, valor
  ) values (
    v_user_id, 'pagamento_recebido', 'vendas', p_venda_id,
    'Pagamento recebido', v_valor
  );

  return v_pagamento_id;
end;
$$;

revoke execute on function registrar_pagamento_venda(uuid, numeric, date, text)
  from public;

grant execute on function registrar_pagamento_venda(uuid, numeric, date, text)
  to authenticated;
