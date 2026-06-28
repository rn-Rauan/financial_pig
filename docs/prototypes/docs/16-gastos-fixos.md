# Tela 16 — Gastos fixos / construção

**HU:** HU12 · **RF:** RF12 · **RD:** RD39–RD43

## Objetivo
Registrar gastos estruturais/fixos (investimento na estrutura), separados dos custos diretos dos animais.

## Campos exibidos
| Campo | Tipo | Obrigatório |
|---|---|---|
| Categoria | select | ✅ |
| Valor | número | ✅ |
| Descrição | texto | ❌ |
| Data | data | ✅ |
| Observação | texto | ❌ |

**Categorias (RD39):** Construção · Reforma · Equipamentos · Ferramentas · Latas · Baldes · Canos · Arames · Madeiras · Telhas · Materiais diversos · Outros.

Lista de gastos recentes abaixo do formulário.

## Botões e ações
- **Salvar gasto**.

## Regras de validação
- Categoria, valor (> 0, RD40) e data obrigatórios.
- Reduz o saldo (RD41).
- Aparece **separado** no dashboard/relatórios; não misturar com compras nem despesas dos animais (RD42).
- Permitir analisar lucro **com e sem** construção (RD43, lucro operacional).

## Estados da tela
- **Carregando:** ao salvar / carregar recentes.
- **Vazio:** "Nenhum gasto registrado".
- **Erro:** validação por campo.
- **Com dados:** lista recente.

## Navegação
- Acessível pelo Dashboard e Histórico. ← volta.

## Dados necessários do Supabase
- `insert`/`select` em `gastos_fixos`.

## Notas de implementação (PWA / React)
- Mesmo componente de formulário das Despesas dos animais (categorias diferentes), tabela separada.
