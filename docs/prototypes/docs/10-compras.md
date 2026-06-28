# Tela 10 — Compras (lista)

**HU:** HU10 · **RF:** RF10, RF22, RF23 · **RD:** RD24, RD33

## Objetivo
Listar compras (entradas de estoque + saída de dinheiro) e o total comprado no período.

## Campos exibidos
- **Total comprado** (mês) no topo.
- Por item: Tipo + quantidade/unidade, Fornecedor, Data, Valor total (−).

## Botões e ações
- Filtros (chips): Todas · Porcos · Milho · Ração · Outros.
- **FAB +** → Nova compra (11).
- Tocar item → detalhe da compra (editar/inativar).

## Regras de validação
- Lista apenas registros ativos. Separar valores por tipo (RD33).

## Estados da tela
- **Carregando:** skeleton.
- **Vazio:** "Nenhuma compra registrada" + botão Nova compra.
- **Erro:** banner + Tentar novamente.
- **Com dados:** total + lista.

## Navegação
- → Nova compra (11). Acessível pelo Dashboard (atalho + Compra) e Estoque.

## Dados necessários do Supabase
- `select` em `compras` where `ativo=true` (+ filtro por tipo, data).

## Notas de implementação (PWA / React)
- Valores exibidos como saída (−), pois reduzem o saldo (RD32).
