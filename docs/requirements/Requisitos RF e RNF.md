## RF01 - Autenticação

O sistema deve permitir que os usuários realizem login através de email/login e senha.

---

## RF02 - Usuário único do sistema

O sistema será utilizado inicialmente por um único usuário autenticado.

Regras:

- O sistema terá apenas um usuário principal.
- Não haverá cadastro de novos usuários dentro do sistema.
- Não haverá níveis de permissão.
- O usuário autenticado terá acesso total às funcionalidades do sistema.
- O cadastro inicial do usuário poderá ser feito diretamente no Supabase.
    

---

## RF03 - Cadastro opcional de clientes

O sistema deve permitir cadastrar clientes de forma opcional para facilitar o controle de vendas recorrentes ou fiadas.

Campos:

- Nome
- Telefone
- Observação

Regras:

- O cadastro de cliente não será obrigatório para registrar vendas.
- Uma venda poderá ser registrada apenas com o nome do cliente em texto livre.
- Uma venda também poderá ser registrada sem cliente informado.
- O usuário poderá associar uma venda a um cliente já cadastrado, caso deseje.
- Em vendas fiadas ou parciais, recomenda-se informar pelo menos o nome do cliente ou alguma observação para facilitar a cobrança futura.

---

## RF04 - Cadastro de vendas

O sistema deve permitir registrar vendas.

Tipos de venda:

- Porco/Carne
    
- Milho
    
- Ração
    
- Outros
    

Campos:

- Tipo da venda
    
- Produto
    
- Quantidade
    
- Unidade
    
- Quantidade de animais utilizados
    
- Nome do cliente
	 
- Cliente cadastrado vinculado, opcional
    
- Preço unitário
    
- Valor total
    
- Valor pago
    
- Status do pagamento
    
- Data
    
- Observação
    

Unidades:

- Quilograma (kg)
    
- Saca
    
- Unidade
    
- Cabeça
    

Regras:

- O campo "Quantidade de animais utilizados" será obrigatório apenas quando a venda for de Porco/Carne.
    
- O sistema deve separar automaticamente as receitas por tipo de venda:
    
    - Receita com porcos/carne
        
    - Receita com milho
        
    - Receita com ração
        
    - Receita com outros produtos
        

---

## RF05 - Cálculo automático de vendas

O sistema deve calcular automaticamente o valor total da venda.

Fórmula:

```text
Valor total = quantidade × preço unitário
```

Exemplo:

```text
Quantidade: 25 kg
Preço unitário: R$ 20,00
Valor total: R$ 500,00
```

---

## RF06 - Cálculo de média por cabeça

O sistema deve calcular automaticamente a média de peso por animal utilizado em vendas de Porco/Carne.

Fórmula:

```text
Kg médio por cabeça = quantidade vendida em kg ÷ quantidade de animais utilizados
```

Exemplo:

```text
Venda: 25 kg de carne
Animais utilizados: 2

Kg médio por cabeça = 25 ÷ 2
Kg médio por cabeça = 12,5 kg
```

---

## RF07 - Cálculo de valor médio por cabeça

O sistema deve calcular automaticamente o valor médio obtido por animal utilizado em vendas de Porco/Carne.

Fórmula:

```text
Valor médio por cabeça = valor total da venda ÷ quantidade de animais utilizados
```

Exemplo:

```text
Valor total da venda: R$ 500,00
Animais utilizados: 2

Valor médio por cabeça = 500 ÷ 2
Valor médio por cabeça = R$ 250,00
```

Objetivo:

- Permitir analisar quanto cada porco vendido gerou em média.
    
- Comparar o valor médio por cabeça com o custo de compra dos leitões.
    
- Acompanhar se a venda de porcos está compensando ao longo do mês.
    

---

## RF08 - Controle de pagamentos

O sistema deve permitir registrar pagamentos das vendas.

Tipos de pagamento:

- Total
    
- Parcial
    
- Fiado
    

Regras:

```text
Se valor pago = valor total:
Status = Pago

Se valor pago > 0 e menor que valor total:
Status = Parcial

Se valor pago = 0:
Status = Fiado
```

O sistema deve calcular automaticamente o valor restante.

Fórmula:

```text
Valor restante = valor total - valor pago
```

---

## RF09 - Controle de fiados

O sistema deve permitir controlar vendas pendentes de pagamento.

Funcionalidades:

- Visualizar clientes com dívidas
    
- Visualizar valor restante
    
- Atualizar pagamentos realizados posteriormente
    
- Atualizar automaticamente o status da venda
    

Regras:

- Quando o valor restante chegar a zero, o status deve mudar para Pago.
    
- Vendas fiadas ou parciais devem aparecer em uma área específica de pendências.
    

---

## RF10 - Registro de compras

O sistema deve permitir registrar compras separadas por tipo.

Tipos de compra:

- Compra de porcos/leitões
    
- Compra de milho
    
- Compra de ração
    
- Outros
    

Campos:

- Tipo da compra
    
- Produto/item
    
- Quantidade
    
- Unidade
    
- Valor unitário
    
- Valor total
    
- Fornecedor
    
- Data
    
- Observação
    

Regras:

- Compras de porcos devem atualizar o estoque de cabeças.
    
- Compras de milho devem atualizar o estoque de milho.
    
- Compras de ração devem atualizar o estoque de ração.
    
- O sistema deve separar automaticamente:
    
    - Valor comprado em porcos
        
    - Valor comprado em milho
        
    - Valor comprado em ração
        
    - Valor comprado em outros itens
        

---

## RF11 - Registro de despesas mensais dos animais

O sistema deve permitir registrar despesas relacionadas diretamente aos animais.

Categorias:

- Ração
    
- Milho para consumo dos animais
    
- Remédio
    
- Veterinário
    
- Transporte relacionado aos animais
    
- Funcionário/mão de obra
    
- Manutenção relacionada aos animais
    
- Outros
    

Campos:

- Categoria
    
- Valor
    
- Descrição
    
- Data
    
- Observação
    

Regras:

- Essas despesas devem entrar no cálculo mensal do negócio.
    
- Essas despesas devem ser separadas dos gastos fixos de construção.
    
- Essas despesas devem ser consideradas como custos/despesas da criação dos animais.
    

---

## RF12 - Registro de gastos fixos e construção

O sistema deve permitir registrar gastos fixos ou estruturais que não estão diretamente ligados à compra de porcos, milho ou ração.

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
    

Campos:

- Categoria
    
- Valor
    
- Descrição
    
- Data
    
- Observação
    

Regras:

- Esses gastos não devem ser misturados com despesas mensais dos animais.
    
- Esses gastos devem aparecer separados no dashboard e nos relatórios.
    
- Esses gastos podem ser usados para análise do investimento estrutural do negócio.
    

---

## RF13 - Controle de estoque

O sistema deve permitir gerenciar estoque.

Itens controlados:

- Porcos/leitões
    
- Milho
    
- Ração
    
- Outros
    

Campos:

- Nome do item
    
- Quantidade atual
    
- Unidade
    
- Observação
    

Unidades:

- Cabeças
    
- Sacas
    
- Quilogramas
    
- Unidade
    

---

## RF14 - Movimentação de estoque

O sistema deve registrar movimentações de estoque.

Tipos de movimentação:

- Entrada
    
- Saída
    
- Consumo
    
- Perda
    
- Ajuste
    

Campos:

- Item
    
- Tipo
    
- Quantidade
    
- Motivo
    
- Data
    
- Observação
    

---

## RF15 - Atualização automática do estoque

O sistema deve atualizar automaticamente o estoque conforme as movimentações realizadas.

Regras:

- Entradas aumentam o estoque.
    
- Saídas reduzem o estoque.
    
- Consumos reduzem o estoque.
    
- Perdas reduzem o estoque.
    
- Ajustes podem aumentar ou reduzir o estoque manualmente.
    

---

## RF16 - Redução automática de porcos em vendas de carne

Ao registrar uma venda de Porco/Carne, o sistema deve reduzir automaticamente o estoque de porcos com base na quantidade de animais utilizados.

Exemplo:

```text
Venda:
Carne: 80 kg
Animais utilizados: 2

Estoque antes:
50 cabeças

Estoque depois:
48 cabeças
```

Regras:

- A redução deve ocorrer apenas quando a venda for confirmada.
    
- O sistema não deve permitir reduzir mais animais do que existem no estoque.
    
- Caso a venda seja cancelada, o estoque deve ser ajustado novamente.
    

---

## RF17 - Registro de consumo

O sistema deve permitir registrar o consumo de milho e ração pelos animais.

Campos:

- Item
    
- Quantidade
    
- Unidade
    
- Data
    
- Observação
    

Regras:

- O consumo deve reduzir o estoque do item consumido.
    
- O consumo não deve ser registrado como venda.
    
- O consumo deve aparecer nos relatórios como custo ou movimentação interna.
    

---

## RF18 - Dashboard

O sistema deve exibir indicadores gerais do negócio.

Indicadores principais:

- Receita total
    
- Receita com porcos/carne
    
- Receita com milho
    
- Receita com ração
    
- Valor total vendido
    
- Valor total comprado
    
- Valor comprado em porcos
    
- Valor comprado em milho
    
- Valor comprado em ração
    
- Despesas mensais dos animais
    
- Gastos fixos/construção
    
- Valor em fiados
    
- Lucro bruto
    
- Lucro líquido
    
- Saldo atual
    
- Estoque atual de porcos
    
- Estoque atual de milho
    
- Estoque atual de ração
    

Indicadores específicos de porcos:

- Total de kg vendidos
    
- Total de animais utilizados em vendas
    
- Média de kg por cabeça
    
- Valor médio por cabeça
    
- Receita total com porcos/carne
    
- Comparação entre valor comprado em porcos e valor vendido em carne
    

---

## RF19 - Resumo mensal

O sistema deve exibir um resumo mensal das movimentações.

O resumo mensal deve conter:

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
    
- Lucro bruto mensal
    
- Lucro líquido mensal
    
- Média de kg por cabeça no mês
    
- Valor médio por cabeça no mês
    

---

## RF20 - Cálculo de lucro bruto

O sistema deve calcular o lucro bruto.

Fórmula:

```text
Lucro bruto = receita total - custos diretos
```

Custos diretos podem incluir:

- Compra de porcos
    
- Compra de milho usado para os animais
    
- Compra de ração
    
- Remédios
    
- Outras despesas diretamente ligadas aos animais
    

---

## RF21 - Cálculo de lucro líquido

O sistema deve calcular o lucro líquido.

Fórmula:

```text
Lucro líquido = lucro bruto - despesas gerais - gastos fixos/construção
```

Regras:

- Gastos fixos e construção devem aparecer separados.
    
- O sistema deve permitir visualizar o resultado com e sem os gastos de construção, pois construção é investimento estrutural e pode distorcer o lucro mensal.
    

---

## RF22 - Pesquisa e filtros

O sistema deve permitir pesquisar e filtrar registros.

Filtros:

- Data
    
- Cliente
    
- Produto
    
- Tipo de venda
    
- Tipo de compra
    
- Categoria
    
- Status de pagamento
    
- Produto vendido
    
- Produto comprado
    

---

## RF23 - Histórico

O sistema deve permitir visualizar o histórico de:

- Vendas
    
- Compras
    
- Despesas dos animais
    
- Gastos fixos/construção
    
- Estoque
    
- Consumo
    
- Fiados
    
- Pagamentos recebidos
    

---
## RF24 - Cálculo de médias gerais das vendas de porcos

O sistema deve calcular médias gerais considerando todas as vendas de Porco/Carne registradas no período selecionado.

Indicadores:

- Total de kg vendidos
- Total de animais utilizados
- Média geral de kg por cabeça
- Valor médio geral por cabeça
- Valor médio geral por kg vendido

Fórmulas:

```
Média geral de kg por cabeça = total de kg vendidos ÷ total de animais utilizados
```

```
Valor médio geral por cabeça = valor total vendido em porcos/carne ÷ total de animais utilizados
```

```
Valor médio geral por kg = valor total vendido em porcos/carne ÷ total de kg vendidos
```

Regras:

- O cálculo deve considerar apenas vendas do tipo Porco/Carne.
- O cálculo deve ignorar vendas inativas ou canceladas.
- Caso não existam vendas no período, o sistema deve exibir zero ou mensagem informando ausência de dados.

--- 
# Requisitos Não Funcionais (RNF)

## RNF01 - Interface mobile first

O sistema deve possuir interface responsiva, priorizando o uso em celulares.

---

## RNF02 - Aplicação como PWA

O sistema deve ser desenvolvido como PWA, permitindo acesso pelo navegador e instalação no celular.

---

## RNF03 - Autenticação segura

O sistema deve possuir autenticação segura para proteger os dados dos usuários.

---

## RNF04 - Banco de dados

Os dados devem ser armazenados em banco Supabase/PostgreSQL.

---

## RNF05 - Persistência automática

O sistema deve salvar automaticamente os dados cadastrados no banco de dados.

---

## RNF06 - Desempenho

O sistema deve apresentar tempo médio de resposta inferior a 3 segundos em operações comuns.

---

## RNF07 - Integridade dos dados

O sistema deve manter a integridade dos dados cadastrados.

Exemplos:

- Não permitir venda sem quantidade.
    
- Não permitir preço negativo.
    
- Não permitir baixa de estoque maior que a quantidade disponível.
    
- Não permitir venda fiada sem cliente informado.
    

---

## RNF08 - Validação de campos obrigatórios

O sistema deve impedir o envio de formulários com campos obrigatórios vazios.

---

## RNF09 - Validação de tipos de dados

O sistema deve validar os tipos de dados antes do armazenamento.

Exemplos:

- Quantidade deve ser número.
    
- Valor deve ser número.
    
- Data deve ser válida.
    
- Email deve possuir formato válido.
    

---

## RNF10 - Acesso individual

O sistema será utilizado por um único usuário autenticado.

Regras:
- O sistema não precisa controlar múltiplos usuários simultâneos nesta versão.
- Não haverá controle de permissões por perfil.
- O foco será simplificar o acesso e proteger os dados por autenticação.
---

## RNF11 - Interface simples

O sistema deve possuir interface simples e intuitiva, voltada para usuários com pouca experiência tecnológica.

---

## RNF12 - Mensagens claras

O sistema deve apresentar mensagens de erro claras e compreensíveis.

Exemplos:

- "Informe a quantidade vendida."
    
- "O valor pago não pode ser maior que o valor total."
    
- "Estoque insuficiente."
    
- "Informe o cliente para venda fiada."
    

---

## RNF13 - Estrutura modular

O sistema deve possuir estrutura modular para facilitar manutenção futura.

Módulos sugeridos:

- Autenticação
    
- Vendas
    
- Compras
    
- Despesas dos animais
    
- Gastos fixos/construção
    
- Estoque
    
- Consumo
    
- Dashboard
    
- Relatórios
    

---

## RNF14 - Backup

O sistema deve possuir backup automático através dos recursos do Supabase.

---

## RNF15 - Segurança dos dados

O sistema deve proteger os dados dos usuários e impedir acesso não autorizado.

---

## RNF16 - Permissões mínimas

O sistema deve evitar permissões desnecessárias do dispositivo.

---

## RNF17 - Compatibilidade

O sistema deve ser compatível com navegadores modernos em dispositivos móveis.

---

## RNF18 - Instalação no celular

O sistema deve permitir instalação no celular através dos recursos de PWA.

---

## RNF19 - Identidade visual

O sistema deve possuir:

- Nome
    
- Ícone
    
- Tela inicial/splash screen
    
- Cores principais
    
- Configuração básica de versão
    

---

## RNF20 - Manutenção futura

O sistema deve permitir futuras expansões, como:

- Relatórios em PDF
    
- Exportação para Excel
    
- Controle mais detalhado de animais
    
- Controle de fornecedores
    
- Controle financeiro mais avançado