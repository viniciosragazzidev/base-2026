# Base Project 2026 - Better Auth Integration

Este é um projeto base que demonstra a integração completa entre **Better Auth**, **Fastify**, **Prisma** e **React** para autenticação de usuários.

## 🏗️ Arquitetura

- **Backend (API)**: Fastify + Better Auth + Prisma + SQLite
- **Frontend (Web)**: React + Vite + Better Auth Client
- **Database**: SQLite com Prisma ORM
- **Autenticação**: Better Auth com Email/Password

## 🚀 Configuração e Instalação

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn

### 1. Clone e Instale as Dependências

```bash
# Clone o repositório
git clone <your-repo-url>
cd base-2026

# Instale dependências do backend
cd api
npm install

# Instale dependências do frontend
cd ../web
npm install
```

### 2. Configuração Rápida com Script

Use o script automatizado para configurar tudo:

```bash
# Primeira vez - configura dependências e banco
./start.sh setup

# Iniciar backend e frontend juntos
./start.sh both
```

### 3. Configuração Manual (Alternativa)

Se preferir configurar manualmente:

#### Configure o arquivo .env

No diretório `api/`, crie ou edite o arquivo `.env`:

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here-at-least-32-characters-long-dev"
BETTER_AUTH_URL="http://localhost:3333"

# CORS
CLIENT_ORIGIN="http://localhost:5173"
```

#### Configure o Banco de Dados

```bash
cd api

# Gerar o cliente Prisma
npx prisma generate

# Aplicar o schema ao banco (criar tabelas)
npx prisma db push
```

#### Executar os Servidores

**Opção 1: Script Automatizado (Recomendado)**
```bash
./start.sh both    # Inicia backend e frontend
./start.sh api     # Apenas backend
./start.sh web     # Apenas frontend
./start.sh test    # Testa a API
```

**Opção 2: Manual (2 terminais)**
```bash
# Terminal 1 - Backend
cd api && npm run dev

# Terminal 2 - Frontend  
cd web && npm run dev
```

**URLs de Acesso:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3333
- Docs: http://localhost:3333/docs

## 📚 Endpoints da API

### Better Auth Endpoints

Todos os endpoints de autenticação estão disponíveis em:
- `http://localhost:3333/api/auth/*`

Principais endpoints:
- `POST /api/auth/sign-up/email` - Criar conta
- `POST /api/auth/sign-in/email` - Fazer login
- `POST /api/auth/sign-out` - Fazer logout
- `GET /api/auth/get-session` - Obter sessão atual

### Outros Endpoints

- `GET /health` - Health check
- `GET /docs` - Documentação Swagger

## 🔧 Estrutura do Projeto

```
base-2026/
├── api/                          # Backend
│   ├── src/
│   │   ├── lib/
│   │   │   └── auth.ts          # Configuração Better Auth
│   │   ├── generated/prisma/    # Cliente Prisma gerado
│   │   └── server.ts           # Servidor Fastify
│   ├── prisma/
│   │   ├── schema.prisma       # Schema do banco
│   │   └── dev.db             # Banco SQLite
│   ├── .env                   # Variáveis de ambiente
│   └── package.json
│
└── web/                        # Frontend
    ├── src/
    │   ├── lib/
    │   │   └── auth-client.ts  # Cliente Better Auth
    │   ├── App.tsx            # Componente principal
    │   └── App.css           # Estilos
    └── package.json
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Fastify** - Framework web rápido e eficiente
- **Better Auth** - Sistema de autenticação moderno
- **Prisma** - ORM type-safe para TypeScript
- **SQLite** - Banco de dados local
- **Zod** - Validação de esquemas
- **TypeScript** - Tipagem estática

### Frontend
- **React** - Biblioteca para UI
- **Vite** - Build tool rápido
- **Better Auth React** - Cliente de autenticação
- **TypeScript** - Tipagem estática

## 🔐 Recursos de Autenticação

- ✅ Cadastro de usuários com email/senha
- ✅ Login com email/senha
- ✅ Logout
- ✅ Sessões seguras
- ✅ Validação de senha (mínimo 8 caracteres)
- ✅ CORS configurado
- ✅ Type-safe em todo o stack

## 🎯 Funcionalidades

### Backend
- Endpoints RESTful para autenticação
- Integração completa Fastify + Better Auth
- Banco de dados SQLite com Prisma
- CORS configurado para desenvolvimento
- Documentação automática com Swagger
- Logs de erros detalhados

### Frontend
- Interface responsiva para login/cadastro
- Gerenciamento de estado de sessão
- Feedback visual para operações
- Integração seamless com o backend
- Exibição de dados da sessão

## 🧪 Como Testar

1. Acesse http://localhost:5173
2. Teste o cadastro de um novo usuário
3. Faça login com as credenciais criadas
4. Verifique a sessão ativa
5. Teste o logout

## 🔧 Comandos Úteis

### Backend

```bash
# Desenvolvimento
npm run dev

# Reset do banco
npx prisma db push --force-reset

# Visualizar banco
npx prisma studio

# Gerar cliente
npx prisma generate
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🚀 Próximos Passos

Para expandir este projeto base, considere:

- [ ] Adicionar providers sociais (GitHub, Google)
- [ ] Implementar verificação de email
- [ ] Adicionar 2FA (Two-Factor Authentication)
- [ ] Implementar roles e permissões
- [ ] Adicionar testes automatizados
- [ ] Configurar deploy para produção
- [ ] Adicionar rate limiting
- [ ] Implementar refresh tokens

## 📝 Notas de Desenvolvimento

- O Better Auth gerencia automaticamente cookies e sessões
- CORS está configurado para desenvolvimento local
- O banco SQLite é criado automaticamente
- As variáveis de ambiente devem ser ajustadas para produção
- O schema Prisma pode ser expandido conforme necessário

## 🐛 Troubleshooting

### ✅ Problemas Resolvidos

**PrismaClient Initialization Error**
- ❌ Problema: `PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions`
- ✅ Solução: Downgrade do Prisma para versão estável (5.20.0) e remoção do `prisma.config.ts`

**Better Auth TypeScript Errors**
- ❌ Problema: Erros de tipagem com `useSession` hook
- ✅ Solução: Uso do cliente direto com `authClient.getSession()` e gerenciamento manual do estado

**CORS Issues**
- ❌ Problema: Requisições bloqueadas entre frontend e backend
- ✅ Solução: Configuração adequada do CORS no Fastify com origens específicas

### 🔧 Outros Problemas Comuns

### Erro de CORS
Verifique se `CLIENT_ORIGIN` está configurado corretamente no `.env`

### Erro de Banco
Execute `npx prisma db push` para recriar as tabelas

### Erro de Build
Certifique-se que todas as dependências estão instaladas

### Porta em Uso
Altere as portas nos arquivos de configuração se necessário

### Servidor Não Inicia
```bash
# Mate processos que podem estar usando as portas
pkill -f "npm run dev"
pkill -f "tsx"

# Reinicie com o script
./start.sh both
```

## 🎉 Status do Projeto

- ✅ Better Auth configurado e funcionando
- ✅ Fastify + Prisma + SQLite integrados
- ✅ Frontend React com autenticação
- ✅ CORS configurado adequadamente
- ✅ Endpoints de API testados
- ✅ Banco de dados funcional
- ✅ TypeScript sem erros
- ✅ Scripts de automação criados

---

**Desenvolvido com ❤️ usando as melhores práticas de 2026**

**Versões Testadas:**
- Node.js: v25.2.1
- Prisma: 5.20.0
- Better Auth: latest
- Fastify: 5.6.2
- React: 19.2.0