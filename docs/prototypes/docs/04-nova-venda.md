# Tela 04 — Nova venda

**HU:** HU04, HU05, HU06, HU07 · **RF:** RF04, RF05, RF06, RF16 · **RD:** RD01–RD23, RD51–RD54

## Objetivo
Registrar uma venda, calcular total e status automaticamente, baixar estoque e (para carne) calcular médias por cabeça.

## Campos exibidos
| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| Tipo / produto | Porco/Carne, Milho, Ração, Outros | ✅ | RD02 |
| Quantidade | número | ✅ | > 0 (RD03) |
| Unidade | Kg, Saca, Unidade, Cabeça | ✅ | Carne→Kg; Milho/Ração→Saca |
| Animais utilizados | número | ✅ **só Porco/Carne** | > 0 e ≤ estoque de porcos (RD08, RD09) |
| Cliente | busca cadastrado **ou** nome livre | ❌ opcional | RD20, RD21 |
| Preço unitário | número | ✅ | > 0 (RD04) |
| Valor total | calculado (readonly) | — | quantidade × preço (RD05, RD06) |
| Valor pago | número | opcional | 0 ≤ pago ≤ total (RD16) |
| Data | data | ✅ | RD80 |
| Observação | texto | opcional | RD83 |

## Cálculos automáticos
- **Valor total** = quantidade × preço unitário (não editável).
- **Valor restante** = total − pago.
- **Status:** pago = total → Pago · 0 < pago < total → Parcial · pago = 0 → Fiado.
- **Carne:** kg médio/cabeça = qtd kg ÷ animais; valor médio/cabeça = total ÷ animais.
- Receita classificada por tipo automaticamente.

## Baixa de estoque
- **Porco/Carne:** reduz porcos pela qtd de **animais** (RD51); não permitir animais > estoque (RD54).
- **Milho/Ração:** reduz pelo nº de **sacas** vendidas (RD52/RD53); não exceder estoque.
- **Outros:** sem baixa automática.

## Estados da tela
- **Carregando:** ao salvar (botão com spinner).
- **Vazio:** formulário inicial.
- **Erro:** por campo + geral ("Estoque insuficiente de porcos", "Informe a quantidade", "Valor pago maior que total"). Fiado/Parcial sem cliente → **aviso** não bloqueante (HU07).
- **Com dados:** status e restante atualizam ao digitar.

## Navegação
- Salvar → Vendas (03) ou Detalhes (05). ← cancela.

## Dados necessários do Supabase
- `insert` em `vendas`; `update` em `estoque`; opcional vínculo `cliente_id`.
- **Transação/RPC** que insere venda + baixa estoque atomicamente (RNF07).

## Notas de implementação (PWA / React)
- Campo "Animais utilizados" só quando Tipo = Porco/Carne; unidade troca conforme tipo.
- Bloquear Salvar enquanto inválido; validar estoque no app **e** no banco (constraint/trigger anti-negativo, RD44).
