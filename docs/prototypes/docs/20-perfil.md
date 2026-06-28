# Tela 20 — Perfil / Configurações

**HU:** HU01, HU25, HU26 · **RF:** RF02 · **RNF:** RNF02, RNF18, RNF19

## Objetivo
Mostrar o usuário logado, configurar o capital inicial, instalar o PWA e sair.

## Campos exibidos
- Usuário logado: nome, e-mail, acesso total.
- **Negócio → Capital inicial** ("comecei com quanto?"): valor único de partida, editável.
- Estoque mínimo (alertas) — configuração simples.
- Sobre: versão, Política de privacidade, **Instalar app (PWA)**, status de sincronização Supabase.

## Botões e ações
- **Editar capital inicial** → define/atualiza o valor de partida.
- **Instalar app** → dispara o prompt de instalação do PWA (RNF18, HU26).
- **Política de privacidade** → abre a página (exigida para coleta de dados).
- **Sair** → `signOut`, volta ao Login.

## Capital inicial (regra)
- Todo o dinheiro usado para começar o negócio (valor de partida).
- Configuração única — não é compra, despesa nem gasto fixo.
- É o ponto inicial do **Saldo**: `saldo = capital_inicial + recebido − compras − despesas − gastos fixos`.

## Regras de validação
- Capital inicial ≥ 0. Sair pede confirmação.

## Estados da tela
- **Carregando:** dados do usuário.
- **Erro:** "Não foi possível carregar o perfil".
- **Com dados:** informações preenchidas.

## Navegação
- Sair → Login (01). Tab ativa: Perfil.

## Dados necessários do Supabase
- `supabase.auth.getUser()`; tabela `config` (capital_inicial, estoque_minimo, atualizado_em).

## Notas de implementação (PWA / React)
- **PWA**: manifest (nome, ícone, splash, cores — RNF19), service worker, prompt de instalação.
- Usuário único; cadastro feito no Supabase, sem registro pelo app.
- Política de privacidade obrigatória para publicação.
