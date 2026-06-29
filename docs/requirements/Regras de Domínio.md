## Grupo: Vendas

### RD01 - Produto obrigatório

Toda venda deve possuir pelo menos um produto informado.

---

### RD02 - Tipo da venda obrigatório

Toda venda deve possuir um tipo.

Tipos permitidos:

- Porco/Carne
    
- Milho
    
- Ração
    
- Outros
    

---

### RD03 - Quantidade maior que zero

Toda venda deve possuir quantidade maior que zero.

---

### RD04 - Preço unitário maior que zero

Toda venda deve possuir preço unitário maior que zero.

---

### RD05 - Cálculo automático do valor total

O valor total da venda deve ser calculado automaticamente.

```text
valorTotal = quantidade × precoUnitario
```

---

### RD06 - Valor total não pode ser editado manualmente

Não é permitido editar manualmente o valor total da venda.

O valor total deve sempre ser resultado da quantidade multiplicada pelo preço unitário.

---

### RD07 - Separação das receitas por tipo

Toda venda deve ser classificada automaticamente conforme o tipo informado.

Separações:

- Receita com Porco/Carne
    
- Receita com Milho
    
- Receita com Ração
    
- Receita com Outros
    

---

### RD08 - Venda de carne exige quantidade de animais

Toda venda do tipo Porco/Carne deve possuir a quantidade de animais utilizados.

Exemplo:

```text
Venda: 25 kg de carne
Animais utilizados: 2
```

---

### RD09 - Quantidade de animais deve ser maior que zero

Quando a venda for do tipo Porco/Carne, a quantidade de animais utilizados deve ser maior que zero.

---

### RD10 - Cálculo automático de kg médio por cabeça

Em vendas do tipo Porco/Carne, o sistema deve calcular automaticamente a média de kg por cabeça.

```text
kgMedioPorCabeca = quantidadeVendidaKg ÷ quantidadeAnimaisUtilizados
```

Exemplo:

```text
25 kg ÷ 2 animais = 12,5 kg por cabeça
```

---

### RD11 - Cálculo automático de valor médio por cabeça

Em vendas do tipo Porco/Carne, o sistema deve calcular automaticamente o valor médio por cabeça.

```text
valorMedioPorCabeca = valorTotal ÷ quantidadeAnimaisUtilizados
```

Exemplo:

```text
R$ 500,00 ÷ 2 animais = R$ 250,00 por cabeça
```

---

## Grupo: Pagamentos e Fiados

### RD12 - Status de pagamento automático

O status da venda deve ser calculado automaticamente com base no valor pago.

Status possíveis:

- Pago
    
- Parcial
    
- Fiado
    

---

### RD13 - Venda paga

Se o valor pago for igual ao valor total, o status da venda deve ser Pago.

```text
valorPago = valorTotal
status = Pago
```

---

### RD14 - Venda parcial

Se o valor pago for maior que zero e menor que o valor total, o status da venda deve ser Parcial.

```text
0 < valorPago < valorTotal
status = Parcial
```

---

### RD15 - Venda fiada

Se o valor pago for igual a zero, o status da venda deve ser Fiado.

```text
valorPago = 0
status = Fiado
```

---

### RD16 - Valor pago não pode ser maior que valor total

Não é permitido registrar uma venda com valor pago maior que o valor total.

---

### RD17 - Pagamento posterior não pode exceder valor restante

Não é permitido registrar um pagamento posterior maior que o valor restante da venda.

Exemplo:

```text
Valor restante: R$ 700,00
Pagamento informado: R$ 800,00

Resultado: operação inválida
```

---

### RD18 - Cálculo automático do valor restante

O valor restante deve ser calculado automaticamente.

```text
valorRestante = valorTotal - valorTotalPago
```

---

### RD19 - Quitação automática da venda

Quando o valor restante chegar a zero, o status da venda deve mudar automaticamente para Pago.

---

### RD20 - Cliente não é obrigatório na venda

O cliente não será obrigatório para registrar uma venda.

Regras:

- A venda pode ter um cliente cadastrado vinculado.
- A venda pode ter apenas um nome de cliente em texto livre.
- A venda pode ser registrada sem cliente.
- Em vendas fiadas ou parciais, o sistema deve permitir o registro mesmo sem cliente cadastrado.

---
### RD21 - Fiado sem cliente cadastrado deve permitir identificação simples

Em vendas fiadas ou parciais, o sistema deve permitir informar apenas o nome do cliente ou uma observação.

Exemplo:

```
Cliente: João da moto
Status: Fiado
Valor restante: R$ 120,00
```

O sistema não deve obrigar o cadastro completo do cliente para registrar a dívida.

--- 
### RD22 - Fiados compõem contas a receber

Toda venda com status Fiado ou Parcial deve compor o total de contas a receber.

```text
contasAReceber = soma dos valores restantes das vendas fiadas e parciais
```

---

### RD23 - Saldo aumenta apenas com valor recebido

Venda somente aumenta o saldo conforme o valor efetivamente pago.

O valor fiado não deve entrar no saldo atual.

Exemplo:

```text
Valor total da venda: R$ 1.000,00
Valor pago: R$ 300,00
Valor restante: R$ 700,00

Saldo aumenta: R$ 300,00
Contas a receber: R$ 700,00
```

Regra importante:

- O sistema não deve considerar o valor total da venda como dinheiro disponível.
    
- Apenas o valor pago entra no saldo.
    
- O valor restante fica registrado como "A receber".
    

---

## Grupo: Compras

### RD24 - Compra deve possuir tipo

Toda compra deve possuir um tipo informado.

Tipos permitidos:

- Compra de porcos/leitões
    
- Compra de milho
    
- Compra de ração
    
- Outros
    

---

### RD25 - Compra deve possuir quantidade maior que zero

Toda compra deve possuir quantidade maior que zero.

---

### RD26 - Compra deve possuir valor total maior que zero

Toda compra deve possuir valor total maior que zero.

---

### RD27 - Valor médio unitário da compra é automático

O valor médio unitário da compra deve ser calculado automaticamente a partir do
valor total informado.

```text
valorMedioUnitarioCompra = valorTotalCompra ÷ quantidade
```

---

### RD28 - Valor total da compra é informado manualmente

O valor total da compra deve ser informado manualmente, pois compras em lote
podem ter animais ou itens com valores individuais diferentes.

---

### RD29 - Compra de porcos aumenta estoque de porcos

Ao registrar uma compra de porcos/leitões, o estoque de porcos deve ser aumentado automaticamente.

Exemplo:

```text
Estoque atual: 20 cabeças
Compra: 10 cabeças
Novo estoque: 30 cabeças
```

---

### RD30 - Compra de milho aumenta estoque de milho

Ao registrar uma compra de milho, o estoque de milho deve ser aumentado automaticamente.

---

### RD31 - Compra de ração aumenta estoque de ração

Ao registrar uma compra de ração, o estoque de ração deve ser aumentado automaticamente.

---

### RD32 - Compras reduzem o saldo

Toda compra deve reduzir o saldo conforme o valor total pago.

```text
saldo = saldo - valorTotalCompra
```

---

### RD33 - Compras devem ser separadas por tipo

O sistema deve separar automaticamente os valores comprados em:

- Porcos/leitões
    
- Milho
    
- Ração
    
- Outros
    

---

## Grupo: Despesas dos Animais

### RD34 - Despesa dos animais deve possuir categoria

Toda despesa relacionada aos animais deve possuir uma categoria.

Categorias permitidas:

- Ração
    
- Milho para consumo dos animais
    
- Remédio
    
- Veterinário
    
- Transporte relacionado aos animais
    
- Funcionário/mão de obra
    
- Manutenção relacionada aos animais
    
- Outros
    

---

### RD35 - Despesa deve possuir valor maior que zero

Toda despesa deve possuir valor maior que zero.

---

### RD36 - Despesa dos animais reduz o saldo

Toda despesa relacionada aos animais deve reduzir o saldo.

```text
saldo = saldo - valorDespesa
```

---

### RD37 - Despesas dos animais não devem ser misturadas com construção

Despesas dos animais devem ficar separadas de gastos fixos e construção.

Exemplo:

- Remédio de porco: despesa dos animais
    
- Compra de lata, cano ou arame: gasto fixo/construção
    

---

### RD38 - Despesas dos animais entram no cálculo do lucro

As despesas dos animais devem ser consideradas no cálculo do lucro bruto ou lucro líquido, conforme sua classificação.

---

## Grupo: Gastos Fixos e Construção

### RD39 - Gasto fixo/construção deve possuir categoria

Todo gasto fixo ou estrutural deve possuir categoria.

Categorias permitidas:

- Construção
    
- Reforma
    
- Equipamentos
    
- Ferramentas
    
- Latas
    
- Baldes
    
- Canos
    
- Arames
    
- Madeiras
    
- Telhas
    
- Materiais diversos
    
- Outros
    

---

### RD40 - Gasto fixo/construção deve possuir valor maior que zero

Todo gasto fixo ou de construção deve possuir valor maior que zero.

---

### RD41 - Gasto fixo/construção reduz o saldo

Todo gasto fixo ou estrutural deve reduzir o saldo.

```text
saldo = saldo - valorGasto
```

---

### RD42 - Gastos fixos/construção devem ficar separados

Gastos fixos e construção não devem ser misturados com:

- Compras de porcos
    
- Compras de milho
    
- Compras de ração
    
- Despesas mensais dos animais
    
- Vendas
    

---

### RD43 - Construção pode ser analisada separadamente do lucro mensal

O sistema deve permitir visualizar o resultado financeiro com e sem os gastos de construção.

Motivo:

- Construção é investimento estrutural.
    
- Se misturar tudo no lucro mensal, o resultado pode parecer pior do que realmente é na operação dos animais.
    

---

## Grupo: Estoque

### RD44 - Estoque não pode ficar negativo

Nenhum item pode possuir estoque negativo.

---

### RD45 - Toda movimentação deve atualizar estoque

Toda movimentação registrada deve atualizar automaticamente o estoque correspondente.

---

### RD46 - Entrada aumenta estoque

Movimentações do tipo Entrada aumentam o estoque.

```text
estoque = estoque + quantidade
```

---

### RD47 - Saída reduz estoque

Movimentações do tipo Saída reduzem o estoque.

```text
estoque = estoque - quantidade
```

---

### RD48 - Perda reduz estoque

Movimentações do tipo Perda reduzem o estoque.

```text
estoque = estoque - quantidade
```

---

### RD49 - Consumo reduz estoque

Movimentações do tipo Consumo reduzem o estoque.

```text
estoque = estoque - quantidade
```

---

### RD50 - Ajuste pode aumentar ou reduzir estoque

Movimentações do tipo Ajuste podem aumentar ou reduzir o estoque, conforme a necessidade de correção manual.

---

### RD51 - Venda de carne reduz estoque de porcos

Ao registrar uma venda do tipo Porco/Carne, o estoque de porcos deve ser reduzido conforme a quantidade de animais utilizados.

Exemplo:

```text
Estoque atual: 50 cabeças
Venda de carne usando: 2 animais
Novo estoque: 48 cabeças
```

---

### RD52 - Venda de milho reduz estoque de milho

Ao registrar uma venda de milho, o estoque de milho deve ser reduzido conforme a quantidade vendida.

---

### RD53 - Venda de ração reduz estoque de ração

Ao registrar uma venda de ração, o estoque de ração deve ser reduzido conforme a quantidade vendida.

---

### RD54 - Venda não pode exceder estoque disponível

Não é permitido registrar venda de item com quantidade maior que o estoque disponível.

Exemplos:

- Não vender mais milho do que existe no estoque.
    
- Não vender mais ração do que existe no estoque.
    
- Não vender mais porcos do que existem no estoque.
    

---

### RD55 - Cancelamento de venda deve reverter estoque

Caso uma venda seja cancelada, o estoque movimentado por ela deve ser revertido.

Exemplo:

```text
Venda cancelada usou 2 porcos.
O sistema deve devolver 2 porcos ao estoque.
```

---

## Grupo: Consumo

### RD56 - Apenas milho e ração podem ter consumo

Somente os itens Milho e Ração podem possuir registros de consumo.

---

### RD57 - Consumo não pode exceder estoque disponível

O consumo registrado não pode ser maior que a quantidade disponível em estoque.

---

### RD58 - Consumo não é venda

Consumo interno não deve ser registrado como venda.

Exemplo:

```text
Milho usado para alimentar os porcos = consumo
Milho vendido para cliente = venda
```

---

### RD59 - Consumo reduz estoque

Todo consumo de milho ou ração deve reduzir o estoque correspondente.

---

## Grupo: Financeiro

### RD60 - Receita total considera valor vendido

A receita total pode considerar o valor total das vendas realizadas.

Porém, esse valor não representa necessariamente dinheiro disponível em caixa.

---

### RD61 - Saldo atual considera apenas valores pagos

O saldo atual deve considerar apenas movimentações financeiras efetivamente pagas ou recebidas.

Entram no saldo:

- Valores pagos de vendas
    
- Pagamentos posteriores recebidos
    
- Compras pagas
    
- Despesas pagas
    
- Gastos fixos/construção pagos
    

Não entram diretamente no saldo:

- Valores fiados ainda não pagos
    
- Valores restantes de vendas parciais
    

---

### RD62 - Contas a receber devem ser separadas do saldo

O total de contas a receber deve ser exibido separadamente do saldo atual.

```text
contasAReceber = soma dos valores ainda não pagos pelos clientes
```

---

### RD63 - Lucro bruto é calculado automaticamente

O lucro bruto deve ser calculado automaticamente.

```text
lucroBruto = receitaTotal - custosDiretos
```

Custos diretos podem incluir:

- Compra de porcos
    
- Compra de milho usado na criação
    
- Compra de ração
    
- Remédios
    
- Veterinário
    
- Outras despesas diretamente ligadas aos animais
    

---

### RD64 - Lucro líquido é calculado automaticamente

O lucro líquido deve ser calculado automaticamente.

```text
lucroLiquido = lucroBruto - despesasGerais - gastosFixosConstrucao
```

---

### RD65 - Lucro operacional pode ignorar construção

O sistema pode exibir um lucro operacional sem considerar gastos de construção.

```text
lucroOperacional = receitaTotal - compras - despesasDosAnimais
```

Objetivo:

- Mostrar se a operação com os animais está dando lucro.
    
- Separar o impacto de construção e estrutura.
    

---

### RD66 - Resultado mensal deve ser calculado por período

Os indicadores financeiros devem poder ser calculados por mês.

Exemplos:

- Receita do mês
    
- Compras do mês
    
- Despesas do mês
    
- Gastos fixos/construção do mês
    
- Lucro bruto mensal
    
- Lucro líquido mensal
    
- Contas a receber no mês
    

---

## Grupo: Indicadores de Porcos

### RD67 - Total de kg vendidos deve ser calculado

O sistema deve calcular o total de kg vendidos em vendas do tipo Porco/Carne.

---

### RD68 - Total de animais utilizados deve ser calculado

O sistema deve calcular o total de animais utilizados nas vendas do tipo Porco/Carne.

---

### RD69 - Média mensal de kg por cabeça deve ser calculada

O sistema deve calcular a média mensal de kg por cabeça.

```text
mediaMensalKgPorCabeca = totalKgVendidosNoMes ÷ totalAnimaisUtilizadosNoMes
```

---

### RD70 - Valor médio mensal por cabeça deve ser calculado

O sistema deve calcular o valor médio mensal por cabeça.

```text
valorMedioMensalPorCabeca = valorTotalVendidoPorcoNoMes ÷ totalAnimaisUtilizadosNoMes
```

---

### RD71 - Comparação entre compra e venda de porcos

O sistema deve permitir comparar:

- Valor gasto comprando porcos/leitões
    
- Valor vendido em carne/porco
    
- Média de kg por cabeça
    
- Valor médio por cabeça
    

Objetivo:

- Saber se a compra dos leitões está compensando.
    
- Acompanhar se a venda por kg está gerando retorno adequado.
    

### RD72 - Média geral das vendas de porcos

O sistema deve calcular a média geral das vendas de Porco/Carne com base no período selecionado.

Fórmulas:

```
mediaGeralKgPorCabeca = totalKgVendidos ÷ totalAnimaisUtilizados
```

```
valorMedioGeralPorCabeca = totalVendidoPorcoCarne ÷ totalAnimaisUtilizados
```

```
valorMedioGeralPorKg = totalVendidoPorcoCarne ÷ totalKgVendidos
```

Regras:

- Considerar apenas vendas ativas.
- Considerar apenas vendas do tipo Porco/Carne.
- Ignorar vendas de milho, ração e outros.
- Ignorar vendas canceladas ou inativas.
- Se o total de animais utilizados for zero, o sistema não deve tentar dividir por zero.

---

## Grupo: Usuários e Acesso

### RD73 - Apenas usuário autenticado pode acessar o sistema

Somente o usuário autenticado poderá acessar as informações do sistema.

---

### RD74 - O sistema terá usuário único

O sistema será utilizado inicialmente por apenas um usuário principal.

---

### RD75 - Usuário não autenticado não pode acessar dados

Usuário não autenticado não pode visualizar, cadastrar, editar ou consultar informações do sistema.

---

### RD76 - Cadastro de usuário não será feito pelo aplicativo

O sistema não precisa permitir cadastro de usuário pela interface.
O usuário inicial poderá ser criado diretamente no Supabase.

----

## Grupo: Dados e Histórico

### RD77 - Nenhum registro pode ser excluído fisicamente

Nenhum registro deve ser apagado permanentemente do banco de dados.

Ao invés de excluir fisicamente, o sistema deve marcar o registro como inativo.

```text
ativo = false
```

---

### RD78 - Registros inativos não aparecem nas listagens principais

Registros com `ativo = false` não devem aparecer nas listagens principais do sistema.

Eles podem aparecer apenas em telas de histórico, auditoria ou relatórios específicos.

---

### RD79 - Alterações importantes devem manter histórico

O sistema deve manter histórico de movimentações importantes.

Exemplos:

- Venda registrada
    
- Pagamento recebido
    
- Compra registrada
    
- Estoque movimentado
    
- Consumo registrado
    
- Venda cancelada
    
- Registro inativado
    

---

### RD80 - Datas são obrigatórias em movimentações

Toda movimentação financeira ou de estoque deve possuir data.

Exemplos:

- Venda
    
- Compra
    
- Despesa
    
- Gasto fixo/construção
    
- Consumo
    
- Pagamento recebido
    
- Movimentação de estoque
    

---

### RD81 - Valores monetários não podem ser negativos

Nenhum valor monetário pode ser negativo.

Exemplos:

- Preço unitário
    
- Valor total
    
- Valor pago
    
- Valor de despesa
    
- Valor de compra
    
- Valor de gasto fixo/construção
    

---

### RD82 - Quantidades não podem ser negativas

Nenhuma quantidade pode ser negativa.

Exemplos:

- Quantidade vendida
    
- Quantidade comprada
    
- Quantidade consumida
    
- Quantidade perdida
    
- Quantidade de animais utilizados
    

---

### RD83 - Observação é opcional

Campos de observação devem ser opcionais.

Eles servem apenas para detalhar informações adicionais do registro.
