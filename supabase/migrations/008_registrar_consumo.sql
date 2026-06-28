-- ============================================================================
-- Financial Pig MVP - registrar_consumo (real implementation)
-- Source of truth: specs/001-mvp-financial-pig/schema.md ("registrar_consumo")
--
-- Covers task:
--   T068 (backing RPC) Atomic consumption that decreases corn/feed stock.
--
-- Replaces the stub from 002_business_rpcs.sql. Other stub RPCs are unchanged.
--
-- Consumption is a 'consumo' stock exit restricted to corn/feed items. It is not
-- a sale and has no financial effect. Rejects insufficient stock; the
-- estoque_itens check `quantidade_atual >= 0` is a DB-level backstop.
--
-- SECURITY DEFINER CONTRACT (see 002_business_rpcs.sql): bypasses RLS, so the
-- item is read/written scoped to v_user_id.
-- ============================================================================

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
declare
  v_user_id uuid := auth.uid();
  v_quantidade numeric := round(coalesce(p_quantidade, 0), 3);
  v_atual numeric;
  v_nome text;
  v_nova numeric;
  v_mov_id uuid;
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado.';
  end if;
  if p_quantidade is null or v_quantidade <= 0 then
    raise exception 'Quantidade deve ser maior que zero.';
  end if;
  if p_motivo is null or length(trim(p_motivo)) = 0 then
    raise exception 'Motivo é obrigatório.';
  end if;
  if p_data_movimentacao is null then
    raise exception 'Data do consumo é obrigatória.';
  end if;

  -- ---- Lock the item (ownership + active scoped) ----------------------
  select quantidade_atual, nome into v_atual, v_nome
  from estoque_itens
  where id = p_estoque_item_id and user_id = v_user_id and ativo = true
  for update;

  if not found then
    raise exception 'Item de estoque não encontrado.';
  end if;

  -- ---- Restrict consumption to corn/feed ------------------------------
  if not (v_nome ilike '%milho%' or v_nome ilike '%ração%' or v_nome ilike '%racao%') then
    raise exception 'Consumo permitido apenas para milho ou ração.';
  end if;

  -- ---- Check stock and apply ------------------------------------------
  v_nova := v_atual - v_quantidade;
  if v_nova < 0 then
    raise exception 'Estoque insuficiente para o consumo.';
  end if;

  update estoque_itens
  set quantidade_atual = v_nova
  where id = p_estoque_item_id and user_id = v_user_id;

  insert into estoque_movimentacoes (
    user_id, estoque_item_id, tipo_movimentacao, quantidade, motivo,
    data_movimentacao, observacao
  ) values (
    v_user_id, p_estoque_item_id, 'consumo', v_quantidade, p_motivo,
    p_data_movimentacao, p_observacao
  )
  returning id into v_mov_id;

  insert into historico (
    user_id, tipo, entidade, entidade_id, descricao, quantidade
  ) values (
    v_user_id, 'consumo_registrado', 'estoque_itens', p_estoque_item_id,
    p_motivo, v_quantidade
  );

  return v_mov_id;
end;
$$;

revoke execute on function registrar_consumo(uuid, numeric, text, date, text)
  from public;

grant execute on function registrar_consumo(uuid, numeric, text, date, text)
  to authenticated;
