#!/bin/bash

# Base Project 2026 - Start Script
# Este script inicia tanto o backend quanto o frontend

echo "🚀 Iniciando Base Project 2026..."
echo "================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para mostrar help
show_help() {
    echo "Uso: ./start.sh [opção]"
    echo ""
    echo "Opções:"
    echo "  api     - Inicia apenas o backend"
    echo "  web     - Inicia apenas o frontend"
    echo "  both    - Inicia backend e frontend (padrão)"
    echo "  setup   - Configura o projeto pela primeira vez"
    echo "  test    - Testa os endpoints da API"
    echo "  help    - Mostra esta ajuda"
    echo ""
}

# Função para setup inicial
setup_project() {
    echo -e "${YELLOW}🔧 Configurando projeto pela primeira vez...${NC}"

    # Backend setup
    echo -e "${BLUE}📦 Instalando dependências do backend...${NC}"
    cd api
    npm install

    # Gerar cliente Prisma
    echo -e "${BLUE}🔨 Gerando cliente Prisma...${NC}"
    npx prisma generate

    # Aplicar schema
    echo -e "${BLUE}💾 Aplicando schema do banco...${NC}"
    npx prisma db push

    cd ..

    # Frontend setup
    echo -e "${BLUE}📦 Instalando dependências do frontend...${NC}"
    cd web
    npm install

    cd ..

    echo -e "${GREEN}✅ Setup concluído!${NC}"
    echo -e "${YELLOW}💡 Agora execute: ./start.sh both${NC}"
}

# Função para testar API
test_api() {
    echo -e "${YELLOW}🧪 Testando endpoints da API...${NC}"

    # Aguarda o servidor iniciar
    sleep 3

    # Health check
    echo -e "${BLUE}🏥 Testando health check...${NC}"
    curl -s http://localhost:3333/health | jq '.' || echo "❌ Health check falhou"

    # Teste de cadastro
    echo -e "${BLUE}📝 Testando cadastro de usuário...${NC}"
    curl -s -X POST http://localhost:3333/api/auth/sign-up/email \
        -H "Content-Type: application/json" \
        -d '{"email":"demo@example.com","password":"12345678","name":"Demo User"}' | \
        jq '.' || echo "❌ Cadastro falhou"

    # Teste de login
    echo -e "${BLUE}🔐 Testando login...${NC}"
    curl -s -X POST http://localhost:3333/api/auth/sign-in/email \
        -H "Content-Type: application/json" \
        -d '{"email":"demo@example.com","password":"12345678"}' | \
        jq '.' || echo "❌ Login falhou"

    echo -e "${GREEN}✅ Testes concluídos!${NC}"
}

# Função para iniciar backend
start_api() {
    echo -e "${BLUE}🌐 Iniciando Backend (API)...${NC}"
    echo -e "${YELLOW}📍 Disponível em: http://localhost:3333${NC}"
    echo -e "${YELLOW}📚 Docs disponíveis em: http://localhost:3333/docs${NC}"
    cd api
    npm run dev
}

# Função para iniciar frontend
start_web() {
    echo -e "${BLUE}⚡ Iniciando Frontend (Web)...${NC}"
    echo -e "${YELLOW}📍 Disponível em: http://localhost:5173${NC}"
    cd web
    npm run dev
}

# Função para iniciar ambos
start_both() {
    echo -e "${BLUE}🚀 Iniciando Backend e Frontend...${NC}"

    # Verifica se tmux está disponível
    if command -v tmux &> /dev/null; then
        echo -e "${GREEN}📱 Usando tmux para gerenciar sessões...${NC}"

        # Cria sessão tmux
        tmux new-session -d -s base2026

        # Backend
        tmux send-keys -t base2026 "cd api && npm run dev" Enter
        tmux split-window -h -t base2026

        # Frontend
        tmux send-keys -t base2026 "cd web && npm run dev" Enter

        echo -e "${GREEN}✅ Servidores iniciados!${NC}"
        echo -e "${YELLOW}📍 Backend: http://localhost:3333${NC}"
        echo -e "${YELLOW}📍 Frontend: http://localhost:5173${NC}"
        echo -e "${BLUE}💡 Para acessar a sessão: tmux attach -t base2026${NC}"
        echo -e "${BLUE}💡 Para sair da sessão: Ctrl+B, depois D${NC}"
        echo -e "${BLUE}💡 Para fechar tudo: tmux kill-session -t base2026${NC}"

        # Anexa à sessão
        tmux attach -t base2026

    else
        echo -e "${RED}❌ tmux não encontrado. Instalando...${NC}"

        # Tenta instalar tmux
        if command -v apt &> /dev/null; then
            sudo apt install tmux -y
        elif command -v yum &> /dev/null; then
            sudo yum install tmux -y
        elif command -v brew &> /dev/null; then
            brew install tmux
        else
            echo -e "${RED}❌ Não foi possível instalar tmux automaticamente.${NC}"
            echo -e "${YELLOW}💡 Instale tmux manualmente ou use: ./start.sh api (em um terminal) e ./start.sh web (em outro)${NC}"
            exit 1
        fi

        # Tenta novamente
        start_both
    fi
}

# Verifica se o script tem permissão de execução
if [[ ! -x "$0" ]]; then
    chmod +x "$0"
fi

# Parse de argumentos
case "$1" in
    "api")
        start_api
        ;;
    "web")
        start_web
        ;;
    "both"|"")
        start_both
        ;;
    "setup")
        setup_project
        ;;
    "test")
        test_api
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Opção inválida: $1${NC}"
        show_help
        exit 1
        ;;
esac
