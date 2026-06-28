-- ============================================================================
-- Financial Pig MVP - Initial Schema
-- Source of truth: specs/001-mvp-financial-pig/schema.md
--
-- Covers tasks:
--   T011 Initial schema (tables + global columns)
--   T012 Enums / check constraints
--   T013 updated_at trigger helper
--   T014 RLS policies for all business tables
--   T015 Stock non-negative database protection
--
-- Global rules (schema.md):
--   * Every business table has id, user_id, ativo, created_at, updated_at
--     (historico has no updated_at by design).
--   * user_id references auth.users(id) and defaults to auth.uid().
--   * Monetary values: numeric(12,2); quantities: numeric(12,3).
--   * Money/quantity non-negative unless an explicit adjustment allows otherwise.
--   * Stock quantity must never become negative.
--
-- Cross-reference integrity (cliente_id, venda_id, compra_id, estoque_item_id):
--   The plain foreign keys below guarantee the referenced row EXISTS, but do not
--   by themselves guarantee it belongs to the SAME user. RLS prevents reading
--   other users' rows, yet a caller that knows a foreign UUID could still
--   reference it. The MVP is single-user, so this is not exploitable today.
--   When multi-user is introduced, close this gap by either:
--     (a) composite FKs on (user_id, id) backed by composite unique keys, or
--     (b) enforcing same-user references inside the business RPCs (which run as
--         security definer and must always scope reads/writes to auth.uid()).
--   The RPCs in 002_business_rpcs.sql are the designated enforcement point.
-- ============================================================================

-- gen_random_uuid()
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- T012: Enums
-- ----------------------------------------------------------------------------
create type sale_type as enum ('porco_carne', 'milho', 'racao', 'outros');
create type sale_status as enum ('pago', 'parcial', 'fiado');
create type purchase_type as enum ('porcos_leitoes', 'milho', 'racao', 'outros');
create type stock_unit as enum ('cabeca', 'saca', 'kg', 'unidade');
create type stock_movement_type as enum ('entrada', 'saida', 'consumo', 'perda', 'ajuste');
create type animal_expense_category as enum (
  'racao', 'milho_consumo', 'remedio', 'veterinario', 'transporte',
  'funcionario', 'manutencao', 'outros'
);
create type fixed_cost_category as enum (
  'construcao', 'reforma', 'equipamentos', 'ferramentas', 'latas',
  'baldes', 'canos', 'arames', 'madeiras', 'telhas', 'materiais_diversos', 'outros'
);
create type history_type as enum (
  'venda_registrada', 'pagamento_recebido', 'compra_registrada',
  'estoque_movimentado', 'consumo_registrado', 'despesa_registrada',
  'gasto_fixo_registrado', 'venda_cancelada', 'registro_inativado'
);

-- ----------------------------------------------------------------------------
-- T013: updated_at trigger helper
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- Tables
-- ============================================================================

-- configuracoes -------------------------------------------------------------
create table configuracoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) default auth.uid(),
  capital_inicial numeric(12,2) not null default 0 check (capital_inicial >= 0),
  nome_sistema text not null default 'Financial Pig',
  moeda text not null default 'BRL',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- clientes ------------------------------------------------------------------
create table clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  nome text not null check (length(trim(nome)) > 0),
  telefone text,
  observacao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- vendas --------------------------------------------------------------------
create table vendas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  cliente_id uuid references clientes(id),
  nome_cliente text,
  tipo_venda sale_type not null,
  produto text not null,
  quantidade numeric(12,3) not null check (quantidade > 0),
  unidade stock_unit not null,
  animais_utilizados integer,
  preco_unitario numeric(12,2) not null check (preco_unitario > 0),
  valor_total numeric(12,2) not null check (valor_total >= 0),
  valor_pago numeric(12,2) not null default 0 check (valor_pago >= 0),
  valor_restante numeric(12,2) not null check (valor_restante >= 0),
  status_pagamento sale_status not null,
  data_venda date not null,
  observacao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- valor_total = round(quantidade * preco_unitario, 2)
  constraint vendas_total_correto
    check (valor_total = round(quantidade * preco_unitario, 2)),
  -- valor_restante = valor_total - valor_pago
  constraint vendas_restante_correto
    check (valor_restante = valor_total - valor_pago),
  -- valor_pago <= valor_total (no overpayment)
  constraint vendas_pago_nao_excede_total
    check (valor_pago <= valor_total),
  -- status matches paid/remaining values
  constraint vendas_status_coerente check (
    (status_pagamento = 'pago' and valor_restante = 0)
    or (status_pagamento = 'fiado' and valor_pago = 0 and valor_restante > 0)
    or (status_pagamento = 'parcial' and valor_pago > 0 and valor_restante > 0)
  ),
  -- pork/meat sales require a positive animal count
  constraint vendas_animais_para_porco check (
    tipo_venda <> 'porco_carne'
    or (animais_utilizados is not null and animais_utilizados > 0)
  )
);

-- pagamentos_venda ----------------------------------------------------------
create table pagamentos_venda (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  venda_id uuid not null references vendas(id),
  valor numeric(12,2) not null check (valor > 0),
  data_pagamento date not null,
  observacao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- compras -------------------------------------------------------------------
create table compras (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  tipo_compra purchase_type not null,
  produto text not null,
  quantidade numeric(12,3) not null check (quantidade > 0),
  unidade stock_unit not null,
  valor_unitario numeric(12,2) not null check (valor_unitario > 0),
  valor_total numeric(12,2) not null check (valor_total >= 0),
  fornecedor text,
  data_compra date not null,
  observacao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint compras_total_correto
    check (valor_total = round(quantidade * valor_unitario, 2))
);

-- despesas_animais ----------------------------------------------------------
create table despesas_animais (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  categoria animal_expense_category not null,
  valor numeric(12,2) not null check (valor > 0),
  descricao text not null,
  data_despesa date not null,
  observacao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- gastos_fixos --------------------------------------------------------------
create table gastos_fixos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  categoria fixed_cost_category not null,
  valor numeric(12,2) not null check (valor > 0),
  descricao text not null,
  data_gasto date not null,
  observacao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- estoque_itens -------------------------------------------------------------
create table estoque_itens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  nome text not null,
  -- T015: stock must never become negative
  quantidade_atual numeric(12,3) not null default 0 check (quantidade_atual >= 0),
  unidade stock_unit not null,
  estoque_minimo numeric(12,3) check (estoque_minimo >= 0),
  observacao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- estoque_movimentacoes -----------------------------------------------------
create table estoque_movimentacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  estoque_item_id uuid not null references estoque_itens(id),
  venda_id uuid references vendas(id),
  compra_id uuid references compras(id),
  tipo_movimentacao stock_movement_type not null,
  quantidade numeric(12,3) not null check (quantidade > 0),
  motivo text not null,
  data_movimentacao date not null,
  observacao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- historico -----------------------------------------------------------------
-- Note: schema.md intentionally omits updated_at for historico.
create table historico (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) default auth.uid(),
  tipo history_type not null,
  entidade text not null,
  entidade_id uuid,
  descricao text not null,
  valor numeric(12,2),
  quantidade numeric(12,3),
  data_evento timestamptz not null default now(),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Helpful indexes for per-user, active-record listing
-- ----------------------------------------------------------------------------
create index idx_clientes_user_ativo on clientes (user_id, ativo);
create index idx_vendas_user_ativo on vendas (user_id, ativo, data_venda);
create index idx_pagamentos_venda_venda on pagamentos_venda (venda_id, ativo);
create index idx_compras_user_ativo on compras (user_id, ativo, data_compra);
create index idx_despesas_animais_user_ativo on despesas_animais (user_id, ativo, data_despesa);
create index idx_gastos_fixos_user_ativo on gastos_fixos (user_id, ativo, data_gasto);
create index idx_estoque_itens_user_ativo on estoque_itens (user_id, ativo);
create index idx_estoque_mov_item on estoque_movimentacoes (estoque_item_id, ativo);
create index idx_historico_user_ativo on historico (user_id, ativo, data_evento);

-- ----------------------------------------------------------------------------
-- T013: updated_at triggers for mutable tables (all except historico)
-- ----------------------------------------------------------------------------
create trigger trg_configuracoes_updated_at before update on configuracoes
  for each row execute function set_updated_at();
create trigger trg_clientes_updated_at before update on clientes
  for each row execute function set_updated_at();
create trigger trg_vendas_updated_at before update on vendas
  for each row execute function set_updated_at();
create trigger trg_pagamentos_venda_updated_at before update on pagamentos_venda
  for each row execute function set_updated_at();
create trigger trg_compras_updated_at before update on compras
  for each row execute function set_updated_at();
create trigger trg_despesas_animais_updated_at before update on despesas_animais
  for each row execute function set_updated_at();
create trigger trg_gastos_fixos_updated_at before update on gastos_fixos
  for each row execute function set_updated_at();
create trigger trg_estoque_itens_updated_at before update on estoque_itens
  for each row execute function set_updated_at();
create trigger trg_estoque_mov_updated_at before update on estoque_movimentacoes
  for each row execute function set_updated_at();

-- ============================================================================
-- T014: Row Level Security
-- Pattern from schema.md: each user only sees/writes their own rows.
-- No delete policy is created: physical deletes are not exposed to app users
-- (soft delete via ativo = false is used instead). This also satisfies T015 at
-- the policy level for stock tables.
-- ============================================================================
alter table configuracoes enable row level security;
alter table clientes enable row level security;
alter table vendas enable row level security;
alter table pagamentos_venda enable row level security;
alter table compras enable row level security;
alter table despesas_animais enable row level security;
alter table gastos_fixos enable row level security;
alter table estoque_itens enable row level security;
alter table estoque_movimentacoes enable row level security;
alter table historico enable row level security;

do $$
declare
  t text;
  business_tables text[] := array[
    'configuracoes', 'clientes', 'vendas', 'pagamentos_venda', 'compras',
    'despesas_animais', 'gastos_fixos', 'estoque_itens',
    'estoque_movimentacoes', 'historico'
  ];
begin
  foreach t in array business_tables loop
    execute format(
      'create policy "select own rows" on %I for select using (auth.uid() = user_id);', t
    );
    execute format(
      'create policy "insert own rows" on %I for insert with check (auth.uid() = user_id);', t
    );
    execute format(
      'create policy "update own rows" on %I for update using (auth.uid() = user_id) with check (auth.uid() = user_id);', t
    );
  end loop;
end;
$$;
