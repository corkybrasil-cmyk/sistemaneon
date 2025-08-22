# ERP NeonEducacional 🎓

Um sistema completo de gestão escolar desenvolvido em React com arquitetura modular e extensível.

## 📋 Funcionalidades

### Módulos Principais
- **Dashboard** - Visão geral do sistema com métricas importantes
- **Gestão de Alunos** - Cadastro e gerenciamento de alunos
- **Responsáveis** - Cadastro e vinculação de responsáveis
- **Chamada** - Controle de presença e faltas
- **Financeiro** - Gestão de mensalidades e pagamentos
- **Turmas** - Criação e gerenciamento de turmas
- **Ocorrências** - Sistema de registro de ocorrências disciplinares
- **Contas a Pagar** - Controle financeiro da escola
- **WhatsApp** - Automações e notificações via WhatsApp
- **Configurações** - Gerenciamento de chaves API e configurações

### Tecnologias Utilizadas
- **Frontend**: React 19, Material-UI, React Router DOM
- **Backend**: Node.js/Express (separado)
- **Banco de Dados**: Appwrite
- **Integrações**: WhatsApp Business API, OpenAI
- **Build Tool**: Vite
- **Styling**: Material-UI com tema customizável

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.jsx      # Layout principal com menu lateral
│   └── Login.jsx       # Componente de login
├── contexts/           # Contextos globais
│   ├── AuthContext.jsx      # Autenticação
│   ├── ThemeContext.jsx     # Tema (claro/escuro)
│   └── ConfigContext.jsx    # Configurações API
├── modules/            # Módulos do ERP
│   ├── alunos/         # Gestão de alunos
│   ├── responsaveis/   # Gestão de responsáveis
│   ├── chamada/        # Controle de presença
│   ├── financeiro/     # Gestão financeira
│   ├── turmas/         # Gestão de turmas
│   ├── ocorrencias/    # Sistema de ocorrências
│   ├── contas-a-pagar/ # Contas da escola
│   ├── whatsapp/       # Automações WhatsApp
│   ├── configuracoes/  # Configurações do sistema
│   └── dashboard/      # Dashboard principal
├── services/           # Serviços de integração
│   ├── apiService.js   # Comunicação com backend
│   ├── appwriteService.js  # Integração Appwrite
│   └── whatsappService.js  # Integração WhatsApp
├── routes/             # Configuração de rotas
│   └── AppRoutes.jsx   # Definição das rotas
├── App.jsx             # Componente principal
└── main.jsx            # Ponto de entrada
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- NPM ou Yarn
- Conta Appwrite (opcional)
- WhatsApp Business API (opcional)

### Instalação
```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]

# Entre na pasta do projeto
cd sistemaneon

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
REACT_APP_APPWRITE_PROJECT_ID=seu-project-id
```

## 🔧 Configuração

### 1. Configuração do Appwrite
1. Acesse a página de Configurações no sistema
2. Na aba "Appwrite", configure:
   - Endpoint do servidor
   - Project ID
   - Database ID

### 2. Configuração do WhatsApp
1. Na aba "WhatsApp", configure:
   - Access Token do WhatsApp Business API
   - Phone Number ID

### 3. Configuração do OpenAI (opcional)
1. Na aba "OpenAI", configure:
   - API Key para funcionalidades de IA

## 📱 Funcionalidades WhatsApp

O sistema permite automações via WhatsApp Business API:

- **Alertas de Falta**: Notificação automática quando aluno falta
- **Lembretes de Pagamento**: Avisos sobre mensalidades próximas ao vencimento
- **Mensalidades em Atraso**: Alertas para pagamentos atrasados
- **Ocorrências**: Notificação de ocorrências disciplinares
- **Comunicados Gerais**: Envio de mensagens para múltiplos contatos

### Exemplo de Templates
```javascript
// Alerta de falta
const message = `🚨 Alerta de Ausência
O aluno ${studentName} não compareceu à aula hoje (${date}).
Em caso de dúvidas, entre em contato conosco.`;

// Lembrete de pagamento
const message = `💰 Lembrete de Pagamento
Mensalidade do aluno ${studentName}
Valor: R$ ${amount}
Vencimento: ${dueDate}`;
```

## 🔐 Segurança

### Autenticação
- Sistema de login com JWT
- Proteção de rotas privadas
- Contexto de autenticação global

### Chaves API
- Todas as chaves são armazenadas de forma criptografada no backend
- Frontend não expõe chaves sensíveis
- Comunicação segura via HTTPS

### Boas Práticas
- Validação de entrada em todos os formulários
- Sanitização de dados
- Controle de acesso por módulos
- Logs de auditoria

## 🎨 Customização

### Temas
O sistema suporta temas claro e escuro:
```javascript
// Alternar tema
const { toggleDarkMode } = useTheme();
```

### Cores Personalizadas
Edite `src/contexts/ThemeContext.jsx` para personalizar:
- Cores primárias e secundárias
- Tipografia
- Componentes específicos

### Novos Módulos
Para adicionar um novo módulo:

1. Crie a pasta em `src/modules/novo-modulo/`
2. Implemente o componente principal
3. Adicione a rota em `src/routes/AppRoutes.jsx`
4. Adicione o item no menu em `src/components/Layout.jsx`

## 📊 Backend (Separado)

### Estrutura Recomendada
```
backend/
├── routes/             # Rotas da API
├── controllers/        # Lógica de negócio
├── middleware/         # Middleware de autenticação
├── models/            # Modelos de dados
├── services/          # Serviços externos
├── utils/             # Utilitários
└── config/            # Configurações
```

### Endpoints Principais
```
POST /api/auth/login           # Login
GET  /api/students             # Listar alunos
POST /api/students             # Criar aluno
PUT  /api/students/:id         # Atualizar aluno
DELETE /api/students/:id       # Deletar aluno
GET  /api/dashboard            # Dados do dashboard
POST /api/whatsapp/send        # Enviar WhatsApp
GET  /api/config               # Configurações
PUT  /api/config               # Atualizar configurações
```

## 🚀 Deploy

### Frontend (Netlify/Vercel)
```bash
npm run build
# Upload da pasta dist/
```

### Backend (Railway/Heroku)
```bash
# Configure as variáveis de ambiente
# Faça deploy do backend separadamente
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Documentação**: Consulte este README
- **Issues**: Abra uma issue no GitHub
- **Email**: contato@neoneducacional.com

## 🔄 Próximas Versões

### v2.0 (Planejado)
- [ ] Relatórios avançados com gráficos
- [ ] Sistema de backup automático
- [ ] Integração com câmeras para reconhecimento facial
- [ ] App mobile complementar
- [ ] Sistema de notas e boletins
- [ ] Portal do aluno/responsável

### v1.1 (Em desenvolvimento)
- [ ] Implementação completa dos módulos placeholder
- [ ] Testes automatizados
- [ ] Documentação da API
- [ ] Docker containerization

---

**Desenvolvido com ❤️ para facilitar a gestão escolar**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
