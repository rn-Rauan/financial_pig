# Tela 13 — Nova movimentação de estoque

**HU:** HU15 · **RF:** RF14, RF15 · **RD:** RD44–RD50

## Objetivo
Registrar entradas, saídas, perdas, consumos e ajustes para manter o estoque atualizado.

## Campos exibidos
| Campo | Tipo | Obrigatório |
|---|---|---|
| Item | select (Porcos, Milho, Ração, Outros) | ✅ |
| Tipo | Entrada / Saída / Perda / Consumo / Ajuste | ✅ |
| Quantidade | número | ✅ |
| Motivo | texto | opcional |
| Data | data | ✅ |
| Observação | texto | opcional |

## Botões e ações
- **Salvar movimentação** → aplica o efeito no estoque.

## Regras de validação
- Quantidade > 0 (exceto Ajuste, que pode corrigir para mais ou menos).
- **Entrada** (+) aumenta (RD46). **Saída / Perda / Consumo** (−) reduzem (RD47–RD49).
- **Ajuste** (±) corrige manualmente (RD50).
- Saída/Perda/Consumo não podem deixar estoque negativo (RD44) → bloquear com erro "Estoque insuficiente".

## Estados da tela
- **Carregando:** ao salvar.
- **Vazio:** formulário inicial; mostra estoque atual do item escolhido.
- **Erro:** "Estoque insuficiente para esta saída".
- **Com dados:** estoque atual do item visível.

## Navegação
- Salvar → Estoque (12).

## Dados necessários do Supabase
- `insert` em `movimentacoes_estoque`; `update` em `estoque` (transação/trigger).

## Notas de implementação (PWA / React)
- Validar saldo no app e no banco (constraint/trigger anti-negativo).
- Mostrar quantidade atual ao selecionar o item.
