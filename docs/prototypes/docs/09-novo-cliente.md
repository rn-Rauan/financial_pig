# Tela 09 — Novo cliente

**HU:** HU03 · **RF:** RF03 · **RD:** RD20, RD83

## Objetivo
Cadastrar um cliente de forma simples (opcional).

## Campos exibidos
| Campo | Tipo | Obrigatório |
|---|---|---|
| Nome | texto | ✅ |
| Telefone | texto/telefone | ❌ |
| Observação | texto | ❌ |

## Botões e ações
- **Salvar cliente** → cria o registro e volta à lista (08).

## Regras de validação
- Apenas **Nome** é obrigatório.
- Telefone e observação livres (opcionais).

## Estados da tela
- **Carregando:** ao salvar.
- **Vazio:** formulário inicial.
- **Erro:** "Informe o nome do cliente".
- **Com dados:** em modo edição, campos preenchidos.

## Navegação
- Salvar → Clientes (08). Pode ser aberto como modal a partir da Nova venda (04).

## Dados necessários do Supabase
- `insert`/`update` em `clientes` (nome, telefone, observacao, ativo).

## Notas de implementação (PWA / React)
- Formulário curto, um campo por linha (mobile-first).
- Permitir criar cliente "on the fly" no fluxo de venda.
