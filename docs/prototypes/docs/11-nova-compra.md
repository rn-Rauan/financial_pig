# Tela 11 — Nova compra

**HU:** HU10 · **RF:** RF10 · **RD:** RD24–RD33

## Objetivo
Registrar uma compra: aumenta o estoque do item e reduz o saldo pelo valor total.

## Campos exibidos
| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| Tipo | Porcos/leitões, Milho, Ração, Outros | ✅ | RD24 |
| Quantidade | número | ✅ | > 0 (RD25) |
| Unidade | Cabeça, Saca, Kg, Unidade | ✅ | conforme tipo |
| Valor total | número | ✅ | > 0 (RD26, RD28) |
| Média unitária | calculado (readonly) | — | valor total ÷ quantidade (RD27) |
| Fornecedor | texto | ❌ | |
| Data | data | ✅ | RD80 |
| Observação | texto | ❌ | RD83 |

## Efeitos automáticos
- **+ estoque**: porcos → cabeças (RD29); milho → sacas (RD30); ração → sacas (RD31).
- **− saldo** pelo valor total da compra (RD32).
- Separa o valor comprado por tipo (RD33).

## Estados da tela
- **Carregando:** ao salvar.
- **Vazio:** formulário inicial.
- **Erro:** por campo ("Informe a quantidade", "Valor inválido").
- **Com dados:** média unitária calculada em tempo real.

## Navegação
- Salvar → Compras (10) ou Estoque (12).

## Dados necessários do Supabase
- `insert` em `compras`; `update` em `estoque` (+ linha em `movimentacoes_estoque` tipo Entrada).
- **Transação/RPC** compra + entrada de estoque atomicamente.

## Notas de implementação (PWA / React)
- Valor total editável; média unitária bloqueada (calculada).
- A entrada de leitões no rebanho vem **da compra** (não confundir com Gasto fixo).
