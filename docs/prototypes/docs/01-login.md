# Tela 01 — Login

**HU:** HU01, HU25 · **RF:** RF01 · **RNF:** RNF03, RNF11 · **RD:** RD73, RD75, RD76

## Objetivo
Autenticar o usuário com e-mail/login e senha. Sem login, nenhuma tela interna é acessível.

## Campos exibidos
| Campo | Tipo | Obrigatório |
|---|---|---|
| E-mail / login | email | ✅ |
| Senha | password | ✅ |

## Botões e ações
- **Entrar** → valida e abre o Dashboard.
- Sem cadastro/registro no app (usuário criado direto no Supabase).

## Regras de validação
- E-mail e senha não vazios; formato de e-mail válido (RNF09).
- Credenciais conferidas no Supabase Auth. Erro → "E-mail ou senha inválidos" (RNF12).

## Estados da tela
- **Carregando:** botão Entrar com spinner; campos desabilitados.
- **Vazio:** campos em branco (inicial).
- **Erro:** faixa vermelha; mantém o e-mail digitado.
- **Com dados / sucesso:** redireciona ao Dashboard.

## Navegação
- Sucesso → **Dashboard (02)**. Sessão válida no boot → pula o login.

## Dados necessários do Supabase
- `supabase.auth.signInWithPassword({ email, password })`, `persistSession: true`.

## Notas de implementação (PWA / React)
- App é **PWA** (instalável, RNF02/RNF18): manifest + service worker.
- Guardar sessão (localStorage do supabase-js); `onAuthStateChange` para auto-login.
- Rotas internas protegidas por guard de sessão (RD75).
- Row Level Security no banco garantindo que só autenticados leem/escrevem.
