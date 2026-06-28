# Tela 15 — Despesas dos animais

**HU:** HU11 · **RF:** RF11 · **RD:** RD34–RD38

## Objetivo
Registrar despesas ligadas diretamente aos animais (custos da criação). Reduzem o saldo e entram no lucro.

## Campos exibidos
| Campo | Tipo | Obrigatório |
|---|---|---|
| Categoria | select | ✅ |
| Valor | número | ✅ |
| Descrição | texto | ❌ |
| Data | data | ✅ |
| Observação | texto | ❌ |

**Categorias (RD34):** Ração · Milho para consumo · Remédio · Veterinário · Transporte (animais) · Funcionário/mão de obra · Manutenção (animais) · Outros.

Lista de despesas recentes abaixo do formulário.

## Botões e ações
- **Salvar despesa**. Tocar recente → editar/inativar.

## Regras de validação
- Categoria, valor (> 0, RD35) e data obrigatórios.
- Reduz o saldo (RD36); entra no cálculo do lucro como custo direto (RD38).
- **Não misturar** com gastos fixos/construção (RD37).

## Estados da tela
- **Carregando:** ao salvar / carregar recentes.
- **Vazio:** "Nenhuma despesa registrada".
- **Erro:** validação por campo.
- **Com dados:** lista recente.

## Navegação
- Atalho no Dashboard (+ Despesa) e Histórico. ← volta.

## Dados necessários do Supabase
- `insert`/`select` em `despesas_animais`.

## Notas de implementação (PWA / React)
- Tabela **separada** de gastos fixos para os relatórios separarem custo direto × estrutura.
