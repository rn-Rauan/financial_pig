# Tela 06 — Fiados / Contas a receber

**HU:** HU09 · **RF:** RF09, RF22 · **RD:** RD22, RD62

## Objetivo
Mostrar todas as vendas Fiado/Parcial e o total a receber, para saber quem ainda deve.

## Campos exibidos
- **Total a receber** (somatório) no topo.
- Por item: Cliente (cadastrado, nome livre ou "Cliente não informado"), Produto/tipo, Valor total, Valor pago, Valor restante, Data, Status, Observação.

## Botões e ações
- Filtros: Cliente, Data, Status, Tipo da venda.
- Tocar item → Detalhes (05) ou Atualizar pagamento (07).

## Regras de validação
- Lista apenas vendas ativas com restante > 0 (Fiado/Parcial).
- Vendas **sem cliente** aparecem normalmente (RD20, RD21).

## Estados da tela
- **Carregando:** skeleton.
- **Vazio:** "Nenhum fiado em aberto 🎉".
- **Erro:** banner + Tentar novamente.
- **Com dados:** total + lista.

## Navegação
- → Detalhes (05) / Atualizar pagamento (07). Tab ativa: Vendas.

## Dados necessários do Supabase
- `select` em `vendas` where `ativo=true` and status in (Fiado, Parcial); soma de `valor_restante` = contas a receber.

## Notas de implementação (PWA / React)
- Opcional: agrupar por cliente para somar dívida por pessoa.
- Cores de status iguais às da lista de Vendas.
