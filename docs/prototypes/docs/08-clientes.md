# Tela 08 — Clientes (lista)

**HU:** HU03 · **RF:** RF03 · **RD:** RD20, RD21

## Objetivo
Listar clientes cadastrados (opcional) para facilitar vendas recorrentes e cobrança de fiados.

## Campos exibidos (por item)
- Nome
- Telefone (ou "sem telefone")
- Situação resumida (ex.: "deve R$ 460" / "em dia")

## Botões e ações
- Busca por nome.
- **FAB +** → Novo cliente (09).
- Tocar item → ficha do cliente (dados + vendas/fiados vinculados).

## Regras de validação
- Cadastro **opcional**: vendas podem existir sem cliente ou com nome livre (RD20).

## Estados da tela
- **Carregando:** lista skeleton.
- **Vazio:** "Nenhum cliente cadastrado" + dica "Cadastrar é opcional".
- **Erro:** banner + Tentar novamente.
- **Com dados:** lista de clientes.

## Navegação
- → Novo cliente (09). Acessível a partir de Vendas (03) e Nova venda (04).

## Dados necessários do Supabase
- `select` em `clientes` where `ativo=true`.
- "deve R$" = soma de `valor_restante` das vendas vinculadas ao cliente.

## Notas de implementação (PWA / React)
- Busca com debounce; usada também no seletor de cliente da Nova venda.
