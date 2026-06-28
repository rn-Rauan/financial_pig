# Tela 05 — Detalhes da venda

**HU:** HU04, HU21 · **RF:** RF04, RF16 · **RD:** RD10, RD11, RD55, RD77

## Objetivo
Exibir todos os dados de uma venda, médias por cabeça (carne) e as ações disponíveis.

## Campos exibidos
- Tipo, produto, quantidade, unidade
- Cliente (ou "Cliente não informado")
- Animais utilizados (se carne)
- **Kg médio por cabeça** e **Valor médio por cabeça** (carne)
- Preço unitário · Valor total · Valor pago · Valor restante
- Status (badge) · Data · Observação

## Botões e ações
- **+ Atualizar pagamento** → (07) — visível se Parcial/Fiado.
- **Editar** → Nova venda (04) em modo edição.
- **Cancelar/Inativar** → confirmação; marca `ativo = false` e **reverte estoque e financeiro** (RD55, HU21). Não apaga fisicamente (RD77).

## Regras de validação
- Cancelar/inativar exige confirmação (modal).

## Estados da tela
- **Carregando:** skeleton do card.
- **Vazio:** N/A (sempre vem de um item).
- **Erro:** "Venda não encontrada".
- **Com dados:** card preenchido.

## Navegação
- → Atualizar pagamento (07), Editar (04). ← Vendas/Fiados.

## Dados necessários do Supabase
- `select` único em `vendas` por id.
- `update ativo=false` + RPC que estorna movimentações de estoque e pagamentos.

## Notas de implementação (PWA / React)
- Botão Atualizar pagamento oculto quando status = Pago.
- Estorno deve ser transacional para não deixar estoque/saldo inconsistentes.
