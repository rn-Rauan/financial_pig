# Tela 14 — Consumo de ração / milho

**HU:** HU16 · **RF:** RF17 · **RD:** RD56–RD59

## Objetivo
Registrar o consumo (em sacas) de ração ou milho pelos animais, reduzindo o estoque. Não é venda.

## Campos exibidos
| Campo | Tipo | Obrigatório |
|---|---|---|
| Item | Ração / Milho (segmentado) | ✅ |
| Quantidade (sacas) | número | ✅ |
| Data | data | ✅ |
| Observação | texto | ❌ |

## Botões e ações
- **Salvar consumo** → reduz o estoque do item.

## Regras de validação
- **Apenas Ração e Milho** podem ter consumo (RD56).
- Quantidade > 0 e ≤ estoque disponível — não pode exceder (RD57) nem ficar negativo (RD44).
- Consumo **não** é registrado como venda (RD58).

## Estados da tela
- **Carregando:** ao salvar.
- **Vazio:** formulário inicial; mostra estoque atual do item.
- **Erro:** "Estoque insuficiente".
- **Com dados:** estoque atual visível.

## Navegação
- Salvar → Estoque (12).

## Dados necessários do Supabase
- `insert` em `movimentacoes_estoque` (tipo Consumo) ou tabela `consumos`; `update` em `estoque` (transação).

## Notas de implementação (PWA / React)
- Reaproveitar a lógica de baixa (Saída) da movimentação.
- Aparece nos relatórios/histórico como movimentação interna/custo (RF17).
