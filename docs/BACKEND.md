# Backend do ERP NeonEducacional

Este documento descreve a estrutura recomendada para o backend do sistema ERP escolar.

## Tecnologias Recomendadas

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Banco de Dados**: MongoDB (via Appwrite) ou PostgreSQL
- **Autenticação**: JWT + bcrypt
- **Validação**: Joi ou Yup
- **Documentação**: Swagger/OpenAPI

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── appwrite.js
│   │   └── environment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentsController.js
│   │   ├── attendanceController.js
│   │   ├── financialController.js
│   │   └── whatsappController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Student.js
│   │   ├── Responsible.js
│   │   ├── Class.js
│   │   └── Financial.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── attendance.js
│   │   ├── financial.js
│   │   └── whatsapp.js
│   ├── services/
│   │   ├── appwriteService.js
│   │   ├── whatsappService.js
│   │   ├── encryptionService.js
│   │   └── emailService.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   └── app.js
├── tests/
├── docs/
├── .env.example
├── package.json
└── README.md
```

## Instalação Rápida

```bash
# Criar diretório do backend
mkdir erp-backend
cd erp-backend

# Inicializar projeto
npm init -y

# Instalar dependências principais
npm install express cors helmet morgan compression dotenv
npm install jsonwebtoken bcryptjs joi
npm install appwrite axios crypto

# Instalar dependências de desenvolvimento
npm install -D nodemon eslint prettier
```

## Configuração Básica

### package.json
```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest"
  }
}
```

### .env.example
```env
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro
JWT_EXPIRE=7d

# Appwrite
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=seu_project_id
APPWRITE_API_KEY=sua_api_key

# Criptografia
ENCRYPTION_KEY=sua_chave_de_32_caracteres

# WhatsApp
WHATSAPP_TOKEN=seu_token_whatsapp
WHATSAPP_PHONE_ID=seu_phone_id

# CORS
FRONTEND_URL=http://localhost:5173
```

## Endpoints Principais

### Autenticação
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### Alunos
```
GET    /api/students
POST   /api/students
GET    /api/students/:id
PUT    /api/students/:id
DELETE /api/students/:id
```

### Responsáveis
```
GET    /api/responsibles
POST   /api/responsibles
PUT    /api/responsibles/:id
DELETE /api/responsibles/:id
```

### Chamada
```
GET    /api/attendance
POST   /api/attendance
PUT    /api/attendance/:id
GET    /api/attendance/reports
```

### Financeiro
```
GET    /api/financial
POST   /api/financial
PUT    /api/financial/:id
GET    /api/financial/reports
```

### WhatsApp
```
POST   /api/whatsapp/send
POST   /api/whatsapp/send-bulk
GET    /api/whatsapp/templates
POST   /api/whatsapp/webhook
```

### Configurações
```
GET    /api/config
PUT    /api/config
```

## Middleware de Segurança

### Autenticação JWT
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
```

### Criptografia de Dados Sensíveis
```javascript
const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY;

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, secretKey, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: cipher.getAuthTag().toString('hex')
  };
};
```

## Integração com Appwrite

```javascript
const { Client, Databases } = require('appwrite');

class AppwriteService {
  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
      
    this.databases = new Databases(this.client);
  }

  async createStudent(data) {
    return await this.databases.createDocument(
      'database_id',
      'students_collection',
      'unique()',
      data
    );
  }
}
```

## Deploy

### Heroku
```bash
heroku create erp-backend
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=seu_secret
git push heroku main
```

### Railway
```bash
railway login
railway new
railway add
railway deploy
```

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

## Testes

```javascript
// tests/students.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Students API', () => {
  test('GET /api/students', async () => {
    const response = await request(app)
      .get('/api/students')
      .set('Authorization', 'Bearer ' + validToken);
      
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});
```

## Monitoramento

### Logs
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Check
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

---

Para implementação completa, consulte a documentação específica de cada módulo.
