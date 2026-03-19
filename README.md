# ARGOS - Plataforma de Monitoramento de Contratos Publicos

Sistema inteligente de deteccao de risco em contratos publicos com foco em transparencia e combate a corrupcao.

## O que e o ARGOS?

O ARGOS conecta na API do Portal da Transparencia do Governo Federal e analisa automaticamente contratos publicos usando um motor de risco proprietario, identificando padroes suspeitos como empresas novas vencendo licitacoes milionarias, contratos com poucos concorrentes e aditivos excessivos.

## Motor de Risco

- Empresa Nova (fundada menos de 2 anos antes do contrato): +15pts
- Valor Alto (contrato acima de R 500.000): +10pts
- Poucos Concorrentes (menos de 3 licitantes): +20pts
- Muitos Aditivos (3 ou mais aditivos): +15pts

Classificacao: LOW (0-20) | MEDIUM (21-35) | HIGH (36-50) | CRITICAL (51+)

## Funcionalidades

- Autenticacao JWT com roles ADMIN e ANALYST
- Importacao automatica do Portal da Transparencia
- Motor de risco com score de 0 a 60pts
- Dashboard com graficos interativos
- Busca e filtros avancados
- Historico de alteracoes por contrato

## Stack

Backend: Node.js, NestJS, Prisma ORM, SQLite
Frontend: Next.js 14, React, TailwindCSS, Recharts

## Como rodar

### Backend
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npx ts-node src/seed.ts
npm run start:dev

### Frontend
cd frontend
npm install
npm run dev

Acesse: http://localhost:3000

## API

- POST /api/auth/login - Autenticacao
- GET /api/contracts - Lista contratos com risco
- POST /api/transparencia/importar/orgao - Importa por codigo SIAFI
- POST /api/transparencia/importar/fornecedor - Importa por CNPJ

## Licenca

MIT - desenvolvido por Gabriel Chagas
