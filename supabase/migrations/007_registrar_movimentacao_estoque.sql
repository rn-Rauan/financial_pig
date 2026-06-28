-- ============================================================================
-- Financial Pig MVP - registrar_movimentacao_estoque (real implementation)
-- Source of truth: specs/001-mvp-financial-pig/schema.md
--   ("registrar_movimentacao_estoque")
--
-- Covers task:
--   T066 (backing RPC) Atomic manual stock movement with non-negative protection.
--
-- Replaces the stub from 002_business_rpcs.sql. Other stub RPCs are unchanged.
--
-- Movement semantics (p_quantidade normalized to 3 decimals):
--   entrada       -> increase by p_quantidade (must be > 0)
--   saida / perda -> decrease by p_quantidade (must be > 0); rejects a resulting
--                    negative stock
--   ajuste        -> p_quantidade is the NEW absolute quantity (>= 0); records
--                    the magnitude of the change (abs(new - current)); rejects
--                    a no-op adjustment
--
--   consumo is intentionally rejected here. Use registrar_consumo, which
--   restricts consumption to corn/feed items.
--
-- The recorded estoque_movimentacoes.quantidade is always the positive magnitude
-- of change (the column enforces quantidade > 0). The estoque_itens check
-- `quantidade_atual >= 0` is a DB-level backstop for non-negative stock.
--
-- SECURITY DEFINER CONTRACT (see 002_business_rpcs.sql): bypasses RLS, so the
-- item is read/written scoped to v_user_id.
-- ============================================================================

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
declare
  v_user_id uuid := auth.uid();
  v_quantidade numeric := round(coalesce(p_quantidade, 0), 3);
  v_atual numeric;
  v_nova numeric;
  v_delta numeric;
  v_mov_id uuid;
begin
  if v_user_id is null then
    raise exception 'Usuário não autenticado.';
  end if;
  if p_motivo is null or length(trim(p_motivo)) = 0 then
    raise exception 'Motivo é obrigatório.';
  end if;
  if p_data_movimentacao is null then
    raise exception 'Data da movimentação é obrigatória.';
  end if;

  if p_tipo_movimentacao = 'consumo' then
    raise exception 'Use registrar_consumo para consumo de milho ou raÃ§Ã£o.';
  end if;

  -- ---- Lock the item (ownership + active scoped) ----------------------
  select quantidade_atual into v_atual
  from estoque_itens
  where id = p_estoque_item_id and user_id = v_user_id and ativo = true
  for update;

  if not found then
    raise exception 'Item de estoque não encontrado.';
  end if;

  -- ---- Resolve new quantity and recorded delta ------------------------
  if p_tipo_movimentacao = 'entrada' then
    if v_quantidade <= 0 then
      raise exception 'Quantidade deve ser maior que zero.';
    end if;
    v_nova := v_atual + v_quantidade;
    v_delta := v_quantidade;
  elsif p_tipo_movimentacao in ('saida', 'perda') then
    if v_quantidade <= 0 then
      raise exception 'Quantidade deve ser maior que zero.';
    end if;
    v_nova := v_atual - v_quantidade;
    if v_nova < 0 then
      raise exception 'Estoque insuficiente para esta movimentação.';
    end if;
    v_delta := v_quantidade;
  else -- ajuste: p_quantidade is the new absolute quantity
    if v_quantidade < 0 then
      raise exception 'A nova quantidade do ajuste não pode ser negativa.';
    end if;
    v_nova := v_quantidade;
    v_delta := abs(v_nova - v_atual);
    if v_delta = 0 then
      raise exception 'O ajuste não altera o estoque atual.';
    end if;
  end if;

  -- ---- Apply and record -----------------------------------------------
  update estoque_itens
  set quantidade_atual = v_nova
  where id = p_estoque_item_id and user_id = v_user_id;

  insert into estoque_movimentacoes (
    user_id, estoque_item_id, tipo_movimentacao, quantidade, motivo,
    data_movimentacao, observacao
  ) values (
    v_user_id, p_estoque_item_id, p_tipo_movimentacao, v_delta, p_motivo,
    p_data_movimentacao, p_observacao
  )
  returning id into v_mov_id;

  insert into historico (
    user_id, tipo, entidade, entidade_id, descricao, quantidade
  ) values (
    v_user_id, 'estoque_movimentado', 'estoque_itens', p_estoque_item_id,
    p_motivo, v_delta
  );

  return v_mov_id;
end;
$$;

revoke execute on function registrar_movimentacao_estoque(
  uuid, stock_movement_type, numeric, text, date, text
) from public;

grant execute on function registrar_movimentacao_estoque(
  uuid, stock_movement_type, numeric, text, date, text
) to authenticated;
