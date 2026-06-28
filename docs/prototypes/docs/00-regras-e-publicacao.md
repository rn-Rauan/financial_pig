# Regras de negócio & checklist de publicação

## Visão geral
PWA mobile-first de suinocultura (porcos/carne, milho, ração). Backend Supabase (Auth + PostgreSQL), **usuário único** autenticado, acesso total, sem cadastro de usuário pelo app.

## Regras de negócio (núcleo)

### Vendas
1. Tipos: **Porco/Carne, Milho, Ração, Outros**; produto, quantidade (> 0) e preço unitário (> 0) obrigatórios.
2. **Valor total = quantidade × preço unitário** (automático, não editável).
3. Receita classificada por tipo (porco/carne, milho, ração, outros).
4. **Porco/Carne** exige **animais utilizados** (> 0); calcula **kg médio/cabeça** = kg ÷ animais e **valor médio/cabeça** = total ÷ animais.
5. Cliente é **opcional**: cadastrado, nome livre, ou sem cliente. Fiado/Parcial sem cliente → aviso, não bloqueia.

### Pagamentos e fiados
6. **Status automático:** pago = total → **Pago** · 0 < pago < total → **Parcial** · pago = 0 → **Fiado**.
7. **Valor restante = total − valor pago**. Pagamentos posteriores somam ao pago e recalculam; ao chegar a 0 → Pago. Não pode pagar mais que o restante.
8. **Só o valor pago entra no saldo**; o restante vai para **Contas a receber** (separado do saldo).

### Compras
9. Tipos: **Porcos/leitões, Milho, Ração, Outros**; valor total = qtd × valor unitário (automático).
10. Compra **aumenta o estoque** do item e **reduz o saldo** pelo valor total; valores separados por tipo.

### Estoque & consumo
11. Movimentações: **Entrada (+) · Saída (−) · Perda (−) · Consumo (−) · Ajuste (±)**.
12. Venda de carne reduz porcos pelos **animais**; venda de milho/ração reduz **sacas**; consumo (só milho/ração) reduz estoque.
13. **Estoque nunca negativo** (validar no app e no banco). Venda/consumo não excedem o disponível.

### Despesas, gastos e financeiro
14. **Despesas dos animais** (ração, milho consumo, remédio, veterinário, transporte, funcionário, manutenção, outros) e **Gastos fixos/construção** (construção, reforma, equipamentos, ferramentas, latas, baldes, canos, arames, madeiras, telhas, materiais, outros) são registrados **separadamente** e reduzem o saldo.
15. **Lucro bruto** = receita total − custos diretos (compras + despesas dos animais).
16. **Lucro líquido** = lucro bruto − despesas gerais − gastos fixos/construção.
17. **Lucro operacional** = receita − compras − despesas dos animais (ignora construção). Permitir ver resultado com e sem construção.
18. **Capital inicial** ("comecei com quanto?") é o ponto de partida do saldo: `saldo = capital_inicial + recebido − compras − despesas − gastos fixos`.

### Dados e histórico
19. **Sem exclusão física:** inativar com `ativo = false`; inativos somem das listagens principais.
20. **Cancelar venda** reverte estoque e financeiro. Datas obrigatórias; valores e quantidades nunca negativos; observação opcional.

## Modelo de dados sugerido (Supabase / PostgreSQL)
- `config` (id, capital_inicial, estoque_minimo, atualizado_em) — 1 linha.
- `clientes` (id, nome, telefone, observacao, ativo).
- `vendas` (id, tipo, produto, quantidade, unidade, animais_utilizados, cliente_id?, cliente_nome?, preco_unitario, valor_total, valor_pago, valor_restante, status, data, observacao, ativo).
- `pagamentos` (id, venda_id, valor, data) — histórico de cada parcela.
- `compras` (id, tipo, produto, quantidade, unidade, valor_unitario, valor_total, fornecedor, data, observacao, ativo).
- `despesas_animais` (id, categoria, valor, descricao, data, observacao, ativo).
- `gastos_fixos` (id, categoria, valor, descricao, data, observacao, ativo).
- `estoque` (id, nome, quantidade_atual, unidade, quantidade_minima?, ultima_movimentacao).
- `movimentacoes_estoque` (id, item_id, tipo, quantidade, motivo, data, observacao) — tipos: Entrada/Saída/Perda/Consumo/Ajuste.

**Integridade:** transações/RPC para venda+baixa, compra+entrada, pagamento e estorno; triggers/constraints impedindo estoque negativo e valores negativos.

## Segurança (RNF03, RNF15, RD73–RD76)
- Autenticação Supabase Auth; **Row Level Security** liberando só o usuário autenticado.
- Telas internas inacessíveis sem sessão; cadastro de usuário feito no Supabase.

## Sincronização (HU24)
- Persistência automática; Realtime para refletir alterações entre dispositivos.

## Checklist de publicação (PWA — RNF02, RNF18, RNF19)
- [ ] Nome do app definido.
- [ ] Ícone(s) e splash no `manifest.json`.
- [ ] Cores principais (theme/background) no manifest.
- [ ] Service worker (offline básico + instalação).
- [ ] `display: standalone`, escopo e start_url corretos.
- [ ] Versão configurada.
- [ ] Política de privacidade publicada (coleta de e-mail/dados de auth).
- [ ] Testado em Android (instalação via navegador).
- [ ] Evitar permissões desnecessárias do dispositivo (RNF16).
- [ ] (Futuro) empacotar via TWA para a Google Play, se desejado.
