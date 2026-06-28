# Tela 12 — Estoque

**HU:** HU14, HU17 · **RF:** RF13 · **RD:** RD44 · **RNF:** RNF01

## Objetivo
Visualizar o estoque atual de porcos, milho, ração e outros itens.

## Campos exibidos (por item)
- Nome do item
- Quantidade atual + unidade (cabeças, sacas, kg, unidade)
- Última movimentação (data/tipo)
- Observação

## Botões e ações
- **+ Movimentação** → Nova movimentação (13).
- **+ Consumo** → Consumo ração/milho (14).
- **FAB +** → cadastrar novo item (HU14).
- Tocar item → histórico de movimentações do item.

## Regras de validação
- Estoque **nunca negativo** (RD44).
- Destacar itens abaixo do mínimo (limite configurável em Perfil — futuro/HU17).

## Estados da tela
- **Carregando:** lista skeleton.
- **Vazio:** "Nenhum item cadastrado" + botão cadastrar.
- **Erro:** banner + Tentar novamente.
- **Com dados:** lista; item baixo em destaque vermelho.

## Navegação
- → Movimentação (13), Consumo (14), cadastro de item. Tab ativa: Estoque.

## Dados necessários do Supabase
- `select` em `estoque` (nome, quantidade_atual, unidade, quantidade_minima?, ultima_movimentacao).

## Notas de implementação (PWA / React)
- Realtime para refletir baixas feitas por vendas/consumo/compra.
- Campo opcional `quantidade_minima` para alerta de estoque baixo.
