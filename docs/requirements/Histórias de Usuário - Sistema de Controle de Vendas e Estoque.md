## Contexto geral

O sistema será um aplicativo/PWA mobile first, com foco no controle financeiro, vendas, compras, estoque, consumo e movimentações de uma pequena atividade de criação e venda de porcos, carne, milho e ração.

O sistema será utilizado inicialmente por um único usuário autenticado.
Esse usuário terá acesso total às funcionalidades e será criado manualmente no Supabase.

O backend será desenvolvido com Supabase, utilizando autenticação, banco PostgreSQL e persistência automática dos dados.

---

# HU01 - Realizar login

Como usuário, quero acessar o sistema com login/email e senha para visualizar e registrar as informações do negócio com segurança.

## Critérios de aceitação

- O usuário deve conseguir informar login/email e senha.
    
- O sistema deve validar os dados informados.
    
- Caso os dados estejam corretos, o usuário deve acessar o dashboard.
    
- Caso os dados estejam incorretos, o sistema deve exibir uma mensagem de erro clara.
    
- Usuários não autenticados não devem acessar telas internas do sistema.
    
- O sistema deve manter o usuário logado enquanto a sessão for válida.
    

---

# HU02 - Visualizar dashboard

Como usuário, quero visualizar um resumo geral do negócio para entender rapidamente a situação financeira e operacional.

## Critérios de aceitação

O dashboard deve exibir:

- Receita total
    
- Receita com porcos/carne
    
- Receita com milho
    
- Receita com ração
    
- Valor total comprado
    
- Valor comprado em porcos
    
- Valor comprado em milho
    
- Valor comprado em ração
    
- Despesas dos animais
    
- Gastos fixos/construção
    
- Valor em fiados
    
- Saldo atual
    
- Contas a receber
    
- Lucro bruto
    
- Lucro líquido
    
- Estoque atual de porcos
    
- Estoque atual de milho
    
- Estoque atual de ração
    

O sistema deve atualizar os indicadores com base nos registros cadastrados.

---

## HU03 - Cadastrar cliente opcionalmente

Como usuário, quero cadastrar clientes apenas quando for útil para facilitar o controle de vendas recorrentes ou cobranças futuras.

## Critérios de aceitação

O sistema deve permitir cadastrar cliente com:

- Nome
	
- Telefone
	
- Observação

Regras:

- O cadastro de cliente deve ser opcional.
	
- O sistema não deve obrigar cadastro de cliente para registrar uma venda.
	
- O usuário deve conseguir pesquisar clientes cadastrados.
	
- O usuário deve conseguir associar uma venda a um cliente já cadastrado, caso deseje.
	
- O sistema deve permitir vendas apenas com o nome do cliente informado manualmente.
	
- O sistema deve permitir vendas sem cliente informado.
---

## HU04 - Registrar venda

Como usuário, quero registrar uma venda de forma rápida para controlar entrada de dinheiro, estoque e histórico do negócio.

## Critérios de aceitação

O sistema deve permitir cadastrar uma venda com:

- Tipo da venda
	
- Produto
	
- Quantidade
	
- Unidade
	
- Cliente cadastrado, opcional
	
- Nome do cliente, opcional
	
- Preço unitário
	
- Valor total
	
- Valor pago
	
- Status do pagamento
	
- Data
	
- Observação

Tipos de venda:

- Porco/Carne
	
- Milho
	
- Ração
	
- Outros

Unidades disponíveis:

- Kg
	
- Saca
	
- Unidade
	
- Cabeça

Regras:

- O sistema deve calcular automaticamente o valor total.
	
- O valor total não deve ser editado manualmente.
	
- O sistema deve permitir registrar venda sem cadastrar cliente.
	
- O sistema deve permitir registrar venda sem cliente informado.
	
- O sistema deve permitir associar a venda a um cliente cadastrado, caso exista.
	
- O sistema deve permitir informar apenas um nome simples no campo de cliente.

Fórmula:

```
Valor total = quantidade × preço unitário
```

---

# HU05 - Registrar venda de porco/carne

Como usuário, quero registrar venda de carne informando o peso vendido e a quantidade de animais utilizados para controlar o estoque de porcos e analisar a média por cabeça.

## Critérios de aceitação

- Ao selecionar o tipo Porco/Carne, o sistema deve permitir informar a quantidade de animais utilizados.
    
- A venda deve registrar o peso vendido em kg.
    
- O sistema deve calcular o valor total com base no preço por kg.
    
- O sistema deve reduzir automaticamente o estoque de porcos com base na quantidade de animais utilizados.
    
- O sistema não deve permitir utilizar mais animais do que existem no estoque.
    
- O sistema deve calcular automaticamente a média de kg por cabeça.
    
- O sistema deve calcular automaticamente o valor médio por cabeça.
    

Fórmulas:

```text
Kg médio por cabeça = quantidade vendida em kg ÷ quantidade de animais utilizados
```

```text
Valor médio por cabeça = valor total da venda ÷ quantidade de animais utilizados
```

Exemplo:

```text
Venda: 25 kg de carne
Animais utilizados: 2
Preço por kg: R$ 20,00

Valor total: R$ 500,00
Kg médio por cabeça: 12,5 kg
Valor médio por cabeça: R$ 250,00
```

---

# HU06 - Registrar venda de milho ou ração

Como usuário, quero registrar vendas de milho ou ração para controlar a saída desses produtos do estoque.

## Critérios de aceitação

- Ao selecionar Milho ou Ração, o sistema deve permitir informar a quantidade vendida.
    
- A unidade poderá ser saca, kg ou unidade, conforme o item.
    
- O sistema deve calcular o valor total com base no preço unitário.
    
- O sistema deve reduzir automaticamente o estoque do item vendido.
    
- O sistema não deve permitir vender mais do que existe no estoque.
    
- A venda deve ser classificada separadamente como receita de milho ou receita de ração.
    

---

## HU07 - Controlar pagamento da venda

Como usuário, quero registrar se uma venda foi paga totalmente, parcialmente ou ficou fiada para controlar os valores recebidos e os valores a receber.

## Critérios de aceitação

O sistema deve definir o status da venda automaticamente:

- Se o valor pago for igual ao valor total, o status será Pago.
	
- Se o valor pago for maior que zero e menor que o valor total, o status será Parcial.
	
- Se o valor pago for igual a zero, o status será Fiado.

O sistema deve calcular automaticamente:

```
Valor restante = valor total - valor pago
```

Regras:

- O valor pago não pode ser maior que o valor total.
	
- Apenas o valor efetivamente pago deve entrar no saldo atual.
	
- O valor restante deve entrar em contas a receber.
	
- Vendas fiadas ou parciais podem ser registradas sem cliente cadastrado.
	
- Em vendas fiadas ou parciais, o sistema deve permitir informar apenas um nome simples ou uma observação.
	
- Caso nenhum nome ou observação seja informado em venda fiada/parcial, o sistema pode exibir um aviso, mas não deve bloquear o registro.
---

## HU08 - Atualizar pagamento de venda fiada ou parcial

Como usuário, quero atualizar pagamentos pendentes para controlar quando clientes pagarem valores em aberto.

## Critérios de aceitação

- O sistema deve listar vendas com status Fiado ou Parcial.
	
- O usuário deve conseguir adicionar um novo pagamento.
	
- O sistema deve somar o novo pagamento ao valor já pago.
	
- O sistema deve recalcular o valor restante.
	
- Se o valor pago atingir o valor total, o status deve mudar para Pago.
	
- O sistema não deve permitir pagamento maior que o valor restante.
	
- O saldo deve aumentar apenas com o valor do novo pagamento recebido.
	
- O sistema deve permitir atualizar pagamento mesmo quando a venda não possuir cliente cadastrado.

---

## HU09 - Visualizar fiados e contas a receber

Como usuário, quero visualizar todas as vendas fiadas ou parcialmente pagas para saber quais valores ainda estão pendentes.

## Critérios de aceitação

A tela de fiados deve exibir:

- Cliente cadastrado, quando houver
	
- Nome do cliente informado manualmente, quando houver
	
- Produto vendido
	
- Tipo da venda
	
- Valor total
	
- Valor pago
	
- Valor restante
	
- Data da venda
	
- Status
	
- Observação

O usuário deve conseguir filtrar por:

- Nome do cliente
	
- Data
	
- Status
	
- Tipo da venda

O sistema deve exibir o total geral de contas a receber.

Regras:

- Vendas sem cliente cadastrado devem aparecer normalmente na tela de fiados.
    
- Caso a venda não tenha cliente informado, o sistema deve exibir algo como "Cliente não informado".
    
- O sistema não deve impedir fiados sem cadastro de cliente.
---

# HU10 - Registrar compra

Como usuário, quero registrar compras para controlar entrada de estoque e saída de dinheiro.

## Critérios de aceitação

O sistema deve permitir registrar compra com:

- Tipo da compra
    
- Produto/item
    
- Quantidade
    
- Unidade
    
- Valor total

- Média unitária calculada
    
- Fornecedor
    
- Data
    
- Observação
    

Tipos de compra:

- Compra de porcos/leitões
    
- Compra de milho
    
- Compra de ração
    
- Outros
    

Regras:

- O valor total deve ser calculado automaticamente.
    
- Compras de porcos devem aumentar o estoque de porcos.
    
- Compras de milho devem aumentar o estoque de milho.
    
- Compras de ração devem aumentar o estoque de ração.
    
- Toda compra deve reduzir o saldo.
    
- O sistema deve separar os valores comprados por tipo.
    

---

# HU11 - Registrar despesa dos animais

Como usuário, quero registrar despesas relacionadas aos animais para controlar os custos mensais da criação.

## Critérios de aceitação

O sistema deve permitir registrar despesa dos animais com:

- Categoria
    
- Valor
    
- Descrição
    
- Data
    
- Observação
    

Categorias:

- Ração
    
- Milho para consumo dos animais
    
- Remédio
    
- Veterinário
    
- Transporte relacionado aos animais
    
- Funcionário/mão de obra
    
- Manutenção relacionada aos animais
    
- Outros
    

Regras:

- A despesa deve reduzir o saldo.
    
- A despesa deve impactar o cálculo do lucro.
    
- A despesa dos animais não deve ser misturada com gastos fixos/construção.
    

---

# HU12 - Registrar gasto fixo ou construção

Como usuário, quero registrar gastos fixos e estruturais para separar investimentos na estrutura dos custos diretos dos animais.

## Critérios de aceitação

O sistema deve permitir registrar gasto fixo/construção com:

- Categoria
    
- Valor
    
- Descrição
    
- Data
    
- Observação
    

Categorias:

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
    

Regras:

- O gasto deve reduzir o saldo.
    
- O gasto deve aparecer separado no dashboard e nos relatórios.
    
- O gasto fixo/construção não deve ser misturado com compras de porcos, milho ou ração.
    
- O sistema deve permitir analisar o lucro com e sem os gastos de construção.
    

---

# HU13 - Visualizar histórico financeiro

Como usuário, quero visualizar o histórico financeiro para acompanhar as movimentações do negócio.

## Critérios de aceitação

O sistema deve permitir visualizar:

- Vendas
    
- Compras
    
- Despesas dos animais
    
- Gastos fixos/construção
    
- Pagamentos recebidos
    

O sistema deve permitir filtrar por:

- Data
    
- Tipo
    
- Categoria
    
- Produto
    
- Cliente
    
- Status
    

---

# HU14 - Cadastrar item no estoque

Como usuário, quero cadastrar itens no estoque para controlar produtos e recursos do negócio.

## Critérios de aceitação

O sistema deve permitir cadastrar itens com:

- Nome
    
- Quantidade atual
    
- Unidade
    
- Observação
    

Itens principais:

- Porcos/leitões
    
- Milho
    
- Ração
    
- Outros
    

Unidades:

- Cabeças
    
- Sacas
    
- Kg
    
- Unidade
    

---

# HU15 - Registrar movimentação de estoque

Como usuário, quero registrar entradas, saídas, perdas, consumos e ajustes no estoque para manter as quantidades atualizadas.

## Critérios de aceitação

O sistema deve permitir registrar movimentações com:

- Item
    
- Tipo
    
- Quantidade
    
- Motivo
    
- Data
    
- Observação
    

Tipos de movimentação:

- Entrada
    
- Saída
    
- Perda
    
- Consumo
    
- Ajuste
    

Regras:

- Entrada aumenta o estoque.
    
- Saída reduz o estoque.
    
- Perda reduz o estoque.
    
- Consumo reduz o estoque.
    
- Ajuste pode aumentar ou reduzir o estoque.
    
- O sistema não deve permitir estoque negativo.
    

---

# HU16 - Registrar consumo de ração ou milho

Como usuário, quero registrar o consumo de ração e milho para acompanhar o uso dos alimentos dos animais.

## Critérios de aceitação

O sistema deve permitir registrar consumo com:

- Item
    
- Quantidade
    
- Unidade
    
- Data
    
- Observação
    

Itens permitidos:

- Ração
    
- Milho
    

Regras:

- O consumo deve reduzir automaticamente o estoque do item consumido.
    
- O consumo não deve ser registrado como venda.
    
- O consumo não pode exceder o estoque disponível.
    

---

# HU17 - Visualizar estoque atual

Como usuário, quero visualizar o estoque atual para saber a quantidade disponível de porcos, milho, ração e outros itens.

## Critérios de aceitação

A tela de estoque deve exibir:

- Nome do item
    
- Quantidade atual
    
- Unidade
    
- Última movimentação
    
- Observação
    

O sistema deve destacar itens com quantidade baixa, caso seja definido um limite mínimo futuramente.

---

## HU18 - Visualizar resumo mensal

Como usuário, quero visualizar um resumo mensal para entender o resultado do negócio em determinado mês.

## Critérios de aceitação

O resumo mensal deve exibir:

- Total vendido no mês
- Total vendido em porcos/carne
- Total vendido em milho
- Total vendido em ração
- Total comprado em porcos
- Total comprado em milho
- Total comprado em ração
- Total de despesas dos animais
- Total de gastos fixos/construção
- Total em fiados
- Contas a receber
- Lucro bruto mensal
- Lucro líquido mensal
- Saldo do período
- Total de kg vendidos em porcos/carne
- Total de animais utilizados no mês
- Média geral de kg por cabeça no mês
- Valor médio geral por cabeça no mês
- Valor médio geral por kg vendido no mês

O usuário deve conseguir selecionar o mês desejado.

---

## HU19 - Analisar desempenho das vendas de porcos

Como usuário, quero visualizar indicadores específicos das vendas de porcos para saber se a compra dos leitões está compensando.

## Critérios de aceitação

O sistema deve exibir:

- Total de kg vendidos
- Total de animais utilizados
- Média de kg por cabeça por venda
- Média geral de kg por cabeça no período
- Valor médio por cabeça por venda
- Valor médio geral por cabeça no período
- Valor médio geral por kg vendido
- Receita total com porcos/carne
- Valor gasto com compra de porcos/leitões
- Comparação entre valor comprado em porcos e valor vendido em carne

O sistema deve permitir visualizar esses dados por período.

Fórmulas:

```
Média geral de kg por cabeça = total de kg vendidos ÷ total de animais utilizados
```

```
Valor médio geral por cabeça = valor total vendido em porcos/carne ÷ total de animais utilizados
```

```
Valor médio geral por kg vendido = valor total vendido em porcos/carne ÷ total de kg vendidos
```

---

# HU20 - Pesquisar registros

Como usuário, quero pesquisar registros para encontrar vendas, compras, despesas, gastos e movimentações específicas.

## Critérios de aceitação

O sistema deve permitir pesquisa por:

- Cliente
    
- Produto
    
- Categoria
    
- Data
    
- Status
    
- Tipo de movimentação
    
- Tipo de venda
    
- Tipo de compra
    

---

# HU21 - Inativar registros

Como usuário, quero inativar registros incorretos para corrigir erros sem apagar informações permanentemente.

## Critérios de aceitação

- O sistema não deve excluir registros fisicamente do banco.
    
- Ao inativar um registro, o sistema deve marcar `ativo = false`.
    
- Registros inativos não devem aparecer nas listagens principais.
    
- Registros inativos podem aparecer em histórico ou relatórios específicos.
    
- Caso uma venda seja inativada ou cancelada, as movimentações de estoque e financeiro relacionadas devem ser revertidas ou ajustadas.
    

---

# HU22 - Visualizar histórico de alterações

Como usuário, quero visualizar movimentações importantes para acompanhar o que foi registrado no sistema.

## Critérios de aceitação

O sistema deve manter histórico de:

- Venda registrada
    
- Pagamento recebido
    
- Compra registrada
    
- Estoque movimentado
    
- Consumo registrado
    
- Despesa registrada
    
- Gasto fixo/construção registrado
    
- Venda cancelada
    
- Registro inativado
    

Cada histórico deve possuir:

- Tipo da movimentação
    
- Data
    
- Descrição
    
- Valor ou quantidade, quando aplicável
    

---

# HU23 - Usar o sistema no celular

Como usuário, quero utilizar o sistema pelo celular para registrar informações de forma prática no dia a dia.

## Critérios de aceitação

- O sistema deve ser desenvolvido com foco mobile first.
    
- As telas devem ser simples e objetivas.
    
- Os botões principais devem ser fáceis de tocar.
    
- Os formulários devem ter poucos campos por tela.
    
- O sistema deve funcionar bem em dispositivos Android.
    
- O sistema deve poder ser instalado no celular como PWA.
    

---

# HU24 - Sincronizar dados com Supabase

Como usuário, quero que os dados cadastrados fiquem salvos automaticamente para evitar perda de informações.

## Critérios de aceitação

- Os dados devem ser salvos no Supabase.
    
- As informações devem persistir mesmo após fechar o sistema.
    
- O usuário deve visualizar os mesmos dados ao acessar o sistema em diferentes dispositivos.
    
- Alterações feitas em um dispositivo devem aparecer nos demais após atualização dos dados.
    
- O sistema deve manter integridade dos dados cadastrados.
    

---

# HU25 - Proteger dados do sistema

Como usuário, quero que os dados do negócio sejam protegidos para impedir acesso indevido.

## Critérios de aceitação

- O sistema deve exigir autenticação.
    
- Usuários não autenticados não devem acessar telas internas.
    
- As regras de acesso devem ser configuradas no Supabase.
    
- Apenas o usuário autenticado deve acessar os dados do negócio.
    
- O usuário autenticado deve possuir acesso total inicialmente.
    

---

# HU26 - Instalar o sistema como PWA

Como usuário, quero instalar o sistema no celular para acessar de forma parecida com um aplicativo.

## Critérios de aceitação

- O sistema deve possuir nome.
    
- O sistema deve possuir ícone.
    
- O sistema deve possuir tela inicial/splash screen.
    
- O sistema deve possuir cores principais.
    
- O sistema deve permitir instalação pelo navegador em dispositivos compatíveis.
    
- O sistema deve ser compatível com navegadores modernos em dispositivos móveis.
