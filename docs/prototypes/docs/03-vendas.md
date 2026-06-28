# Tela 03 — Vendas (lista)

**HU:** HU04, HU20 · **RF:** RF04, RF22, RF23 · **RD:** RD77, RD78

## Objetivo
Listar as vendas ativas, permitir busca/filtro e abrir o detalhe.

## Campos exibidos (por item)
- Produto + quantidade/unidade (carne mostra também nº de cabeças)
- Cliente (ou "Cliente não informado")
- Valor total
- Status (Pago / Parcial / Fiado)
- Data

## Botões e ações
- Busca por cliente/produto.
- Filtros (chips): Todos · Pago · Parcial · Fiado · Tipo.
- Link **Clientes →** (08).
- **FAB +** → Nova venda (04).
- Tocar item → Detalhes (05).

## Regras de validação
- Lista apenas registros `ativo = true` (RD78). Ordenar por data desc.

## Estados da tela
- **Carregando:** lista skeleton.
- **Vazio:** "Nenhuma venda registrada" + botão Nova venda.
- **Erro:** banner + Tentar novamente.
- **Com dados:** lista de cards.

## Navegação
- → Nova venda (04), Detalhes (05), Clientes (08). Tab ativa: Vendas.

## Dados necessários do Supabase
- `select` em `vendas` where `ativo = true` (+ filtros por status, tipo, cliente, data).
- Paginação para listas grandes.

## Notas de implementação (PWA / React)
- Lista virtualizada + paginação; debounce na busca.
- Badge de status com cor (verde/laranja/vermelho).
