# Tela 07 — Atualizar pagamento

**HU:** HU08 · **RF:** RF08, RF09 · **RD:** RD17, RD18, RD19, RD23

## Objetivo
Registrar um novo pagamento de uma venda Fiada/Parcial, somando ao já pago e recalculando restante/status.

## Campos exibidos
- Resumo: Valor total, Já pago, Restante.
- **Novo pagamento** (input).

## Botões e ações
- **Confirmar pagamento** → soma ao valor pago, recalcula restante e status.

## Regras de validação
- Novo pagamento > 0.
- Novo pagamento ≤ valor restante (RD17). Não pode exceder o devido.
- `valor_pago += novo`; `restante = total − valor_pago`.
- Se `restante == 0` → status **Pago** (RD19).
- **Só o novo valor recebido aumenta o saldo** (RD23).

## Estados da tela
- **Carregando:** ao confirmar.
- **Vazio:** input em branco.
- **Erro:** "Valor maior que o restante" / "Informe um valor".
- **Com dados:** preview do novo restante/status em tempo real.

## Navegação
- Confirmar → Detalhes (05) ou Fiados (06).

## Dados necessários do Supabase
- `insert` em `pagamentos` (venda_id, valor, data) — histórico por parcela.
- `update` em `vendas` (valor_pago, valor_restante, status).

## Notas de implementação (PWA / React)
- Atualizar restante/status enquanto digita.
- Registrar cada pagamento em `pagamentos` para auditoria e histórico (HU13/HU22).
- Permitir mesmo sem cliente cadastrado.
