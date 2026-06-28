-- ============================================================================
-- Financial Pig MVP - Dashboard read model
-- Source of truth: specs/001-mvp-financial-pig/schema.md ("dashboard_mensal")
--
-- Covers task:
--   T032 (backing read model) Dashboard data read model consumed by the client
--        dashboardService.
--
-- This is a READ-ONLY aggregation over the real business tables. It does not
-- write anything and is unrelated to the write RPCs in 002 (which remain stubs).
-- When there is no data it returns zeros/nulls, so the UI renders an empty/zero
-- state rather than fabricated numbers.
--
-- Scoping: runs as security definer (bypasses RLS), so every subquery is
-- explicitly filtered by user_id = auth.uid(); unauthenticated calls are
-- rejected. Only active records (ativo = true) are considered.
--
-- Period semantics:
--   * Monthly figures (receita_*, compras_*, despesas/gastos, pig indicators)
--     use the selected month [inicio, fim).
--   * Cumulative figures as of now (saldo_atual, contas_a_receber, estoque_*)
--     reflect the current state, independent of the selected month.
-- ============================================================================

create or replace function dashboard_mensal(p_ano integer, p_mes integer)
returns table (
  receita_total numeric,
  receita_porco_carne numeric,
  receita_milho numeric,
  receita_racao numeric,
  receita_outros numeric,
  compras_total numeric,
  compras_porcos numeric,
  compras_milho numeric,
  compras_racao numeric,
  despesas_animais_total numeric,
  gastos_fixos_total numeric,
  contas_a_receber numeric,
  saldo_atual numeric,
  lucro_bruto numeric,
  lucro_liquido numeric,
  lucro_operacional numeric,
  estoque_porcos numeric,
  estoque_milho numeric,
  estoque_racao numeric,
  total_kg_porco_carne numeric,
  total_animais_utilizados numeric,
  media_kg_por_cabeca numeric,
  valor_medio_por_cabeca numeric,
  valor_medio_por_kg numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_inicio date;
  v_fim date;
  -- monthly revenue
  v_receita_porco numeric;
  v_receita_milho numeric;
  v_receita_racao numeric;
  v_receita_outros numeric;
  v_receita_total numeric;
  -- monthly purchases
  v_compras_porcos numeric;
  v_compras_milho numeric;
  v_compras_racao numeric;
  v_compras_total numeric;
  -- monthly costs
  v_despesas numeric;
  v_gastos numeric;
  -- pig indicators (monthly)
  v_kg numeric;
  v_animais numeric;
  -- cumulative cash inputs
  v_capital numeric;
  v_recebido numeric;
  v_saidas numeric;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;

  v_inicio := make_date(p_ano, p_mes, 1);
  v_fim := (v_inicio + interval '1 month')::date; -- exclusive upper bound

  -- ---- Monthly revenue by sale type ------------------------------------
  select
    coalesce(sum(valor_total) filter (where tipo_venda = 'porco_carne'), 0),
    coalesce(sum(valor_total) filter (where tipo_venda = 'milho'), 0),
    coalesce(sum(valor_total) filter (where tipo_venda = 'racao'), 0),
    coalesce(sum(valor_total) filter (where tipo_venda = 'outros'), 0),
    coalesce(sum(quantidade) filter (where tipo_venda = 'porco_carne' and unidade = 'kg'), 0),
    coalesce(sum(animais_utilizados) filter (where tipo_venda = 'porco_carne'), 0)
  into v_receita_porco, v_receita_milho, v_receita_racao, v_receita_outros, v_kg, v_animais
  from vendas
  where user_id = v_user_id
    and ativo = true
    and data_venda >= v_inicio
    and data_venda < v_fim;

  v_receita_total := v_receita_porco + v_receita_milho + v_receita_racao + v_receita_outros;

  -- ---- Monthly purchases by type ---------------------------------------
  select
    coalesce(sum(valor_total) filter (where tipo_compra = 'porcos_leitoes'), 0),
    coalesce(sum(valor_total) filter (where tipo_compra = 'milho'), 0),
    coalesce(sum(valor_total) filter (where tipo_compra = 'racao'), 0),
    coalesce(sum(valor_total), 0)
  into v_compras_porcos, v_compras_milho, v_compras_racao, v_compras_total
  from compras
  where user_id = v_user_id
    and ativo = true
    and data_compra >= v_inicio
    and data_compra < v_fim;

  -- ---- Monthly costs ---------------------------------------------------
  select coalesce(sum(valor), 0) into v_despesas
  from despesas_animais
  where user_id = v_user_id and ativo = true
    and data_despesa >= v_inicio and data_despesa < v_fim;

  select coalesce(sum(valor), 0) into v_gastos
  from gastos_fixos
  where user_id = v_user_id and ativo = true
    and data_gasto >= v_inicio and data_gasto < v_fim;

  -- ---- Cumulative cash position ----------------------------------------
  -- Cash = capital + money actually received - money actually paid out.
  -- Received is read from vendas.valor_pago only. Payment RPCs update that
  -- aggregate field when later payments are recorded in pagamentos_venda, so
  -- summing both tables here would double-count later payments.
  select coalesce(capital_inicial, 0) into v_capital
  from configuracoes
  where user_id = v_user_id and ativo = true
  limit 1;
  v_capital := coalesce(v_capital, 0);

  v_recebido :=
    coalesce((select sum(valor_pago) from vendas
              where user_id = v_user_id and ativo = true), 0);

  v_saidas :=
    coalesce((select sum(valor_total) from compras
              where user_id = v_user_id and ativo = true), 0)
    + coalesce((select sum(valor) from despesas_animais
                where user_id = v_user_id and ativo = true), 0)
    + coalesce((select sum(valor) from gastos_fixos
                where user_id = v_user_id and ativo = true), 0);

  -- ---- Assemble result -------------------------------------------------
  return query
  select
    v_receita_total,
    v_receita_porco,
    v_receita_milho,
    v_receita_racao,
    v_receita_outros,
    v_compras_total,
    v_compras_porcos,
    v_compras_milho,
    v_compras_racao,
    v_despesas,
    v_gastos,
    -- contas_a_receber: current outstanding across active partial/credit sales
    coalesce((select sum(valor_restante) from vendas
              where user_id = v_user_id and ativo = true
                and status_pagamento in ('parcial', 'fiado')), 0),
    -- saldo_atual: cumulative cash
    round(v_capital + v_recebido - v_saidas, 2),
    -- lucro_bruto: monthly revenue - monthly purchases
    round(v_receita_total - v_compras_total, 2),
    -- lucro_liquido: gross - animal expenses - fixed/construction costs
    round(v_receita_total - v_compras_total - v_despesas - v_gastos, 2),
    -- lucro_operacional: excludes fixed/construction costs
    round(v_receita_total - v_compras_total - v_despesas, 2),
    -- current stock by seeded item name
    coalesce((select sum(quantidade_atual) from estoque_itens
              where user_id = v_user_id and ativo = true and nome ilike '%porco%'), 0),
    coalesce((select sum(quantidade_atual) from estoque_itens
              where user_id = v_user_id and ativo = true and nome ilike '%milho%'), 0),
    coalesce((select sum(quantidade_atual) from estoque_itens
              where user_id = v_user_id and ativo = true
                and (nome ilike '%ração%' or nome ilike '%racao%')), 0),
    v_kg,
    v_animais,
    -- averages avoid division by zero (null when no animals/kg)
    round(v_kg / nullif(v_animais, 0), 3),
    round(v_receita_porco / nullif(v_animais, 0), 2),
    round(v_receita_porco / nullif(v_kg, 0), 2);
end;
$$;

-- Allow only authenticated app users to call the read model.
revoke execute on function dashboard_mensal(integer, integer) from public;
grant execute on function dashboard_mensal(integer, integer) to authenticated;
