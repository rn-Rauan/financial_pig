# Financial Pig — Wireframes lo-fi

**PWA mobile-first** para controle financeiro e operacional de suinocultura (porcos/carne, milho, ração). Backend **Supabase** (Auth + PostgreSQL). **Usuário único** autenticado, acesso total, cadastro feito no Supabase.

## Como ver os wireframes
Abra **`Wireframes.dc.html`** — as 20 telas em um único canvas rolável, agrupadas por fluxo.

## Telas e specs
| # | Tela | Spec |
|---|---|---|
| 01 | Login | [docs/01-login.md](docs/01-login.md) |
| 02 | Dashboard | [docs/02-dashboard.md](docs/02-dashboard.md) |
| 03 | Vendas (lista) | [docs/03-vendas.md](docs/03-vendas.md) |
| 04 | Nova venda | [docs/04-nova-venda.md](docs/04-nova-venda.md) |
| 05 | Detalhes da venda | [docs/05-detalhes-venda.md](docs/05-detalhes-venda.md) |
| 06 | Fiados / Contas a receber | [docs/06-fiados.md](docs/06-fiados.md) |
| 07 | Atualizar pagamento | [docs/07-atualizar-pagamento.md](docs/07-atualizar-pagamento.md) |
| 08 | Clientes (lista) | [docs/08-clientes.md](docs/08-clientes.md) |
| 09 | Novo cliente | [docs/09-novo-cliente.md](docs/09-novo-cliente.md) |
| 10 | Compras (lista) | [docs/10-compras.md](docs/10-compras.md) |
| 11 | Nova compra | [docs/11-nova-compra.md](docs/11-nova-compra.md) |
| 12 | Estoque | [docs/12-estoque.md](docs/12-estoque.md) |
| 13 | Nova movimentação | [docs/13-nova-movimentacao.md](docs/13-nova-movimentacao.md) |
| 14 | Consumo ração/milho | [docs/14-consumo.md](docs/14-consumo.md) |
| 15 | Despesas dos animais | [docs/15-despesas-animais.md](docs/15-despesas-animais.md) |
| 16 | Gastos fixos / construção | [docs/16-gastos-fixos.md](docs/16-gastos-fixos.md) |
| 17 | Resumo mensal | [docs/17-resumo-mensal.md](docs/17-resumo-mensal.md) |
| 18 | Análise de porcos | [docs/18-analise-porcos.md](docs/18-analise-porcos.md) |
| 19 | Histórico | [docs/19-historico.md](docs/19-historico.md) |
| 20 | Perfil / configurações | [docs/20-perfil.md](docs/20-perfil.md) |

Regras de negócio e checklist de publicação: [docs/00-regras-e-publicacao.md](docs/00-regras-e-publicacao.md).

## Navegação (mapa)
```
Login ──► Dashboard ──┬─► Vendas ──┬─► Nova venda
                      │            ├─► Detalhes ──► Atualizar pagamento
                      │            ├─► Fiados ────► Atualizar pagamento
                      │            └─► Clientes ──► Novo cliente
                      ├─► Estoque ─┬─► Nova movimentação
                      │            ├─► Consumo
                      │            └─► Compras ───► Nova compra
                      ├─► Relatórios ─┬─► Resumo mensal
                      │               ├─► Análise de porcos
                      │               └─► Histórico
                      └─► Perfil ──► (Capital inicial · Instalar PWA · Sair)
   Atalhos no Dashboard: + Venda · + Compra · + Despesa
```
Tab bar (5): **Início · Vendas · Estoque · Relatórios · Perfil**.
Despesas dos animais e Gastos fixos: acessíveis pelo Dashboard e Histórico.

## Principais mudanças desta versão
- **PWA** (instalável) em vez de React Native; **usuário único**.
- Novos módulos: **Compras**, **Clientes** (opcional), **Resumo mensal**, **Análise de porcos**.
- Despesas divididas em **Despesas dos animais** × **Gastos fixos/construção** (antes "Investimentos").
- **Saldo** só com valores pagos × **Contas a receber** separado.
- Vendas de carne com **kg/cabeça** e **R$/cabeça**; movimentação com **Ajuste**; soft-delete (`ativo=false`) com estorno.

## Convenções dos wireframes
- Traço **pontilhado** = campo de input · borda **sólida** = valor calculado/destaque.
- `*` = obrigatório · vermelho = erro/alerta · listras = imagem/avatar placeholder.
