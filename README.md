# 👁 ARGOS — Plataforma de Monitoramento de Contratos Públicos

> Sistema de detecção de risco em contratos públicos com foco em transparência e combate à corrupção.

---

## 🏗 Arquitetura

```
argos/
├── backend/                     # NestJS + Prisma + SQLite
│   ├── prisma/
│   │   └── schema.prisma        # Modelos: Agency, Supplier, Contract, ContractAdditive
│   └── src/
│       ├── modules/
│       │   ├── prisma/          # PrismaService (singleton global)
│       │   ├── risk-engine/     # Motor de risco — regras e classificação
│       │   └── contracts/       # Controller REST + Service + DTOs
│       ├── seed.ts              # Dados fictícios realistas (7 contratos)
│       ├── app.module.ts
│       └── main.ts              # Bootstrap com CORS habilitado
│
└── frontend/                    # Next.js 14 + TailwindCSS
    └── src/
        ├── app/
        │   ├── globals.css      # Tema escuro + grid sutil
        │   ├── layout.tsx
        │   └── page.tsx         # Dashboard principal (Client Component)
        ├── components/
        │   ├── ContractCard.tsx # Card expansível com fatores de risco
        │   ├── FilterBar.tsx    # Busca textual + filtro por nível
        │   ├── RiskBadge.tsx    # Badge colorido com nível e score
        │   ├── RiskBar.tsx      # Barra de progresso do score
        │   ├── RiskFactorList.tsx # Lista de fatores detectados
        │   └── StatsBar.tsx     # Painel de estatísticas resumidas
        └── lib/
            ├── api.ts           # Cliente Axios
            ├── format.ts        # Utilitários: moeda, data, CNPJ
            └── types.ts         # Tipos TypeScript + RISK_CONFIG
```

---

## ⚙️ Setup

### Pré-requisitos
- Node.js 18+
- npm 9+

### 1. Backend

```bash
cd argos/backend

# Instala dependências
npm install

# Gera o Prisma Client
npx prisma generate

# Cria o banco SQLite e aplica o schema
npx prisma migrate dev --name init

# Popula com dados fictícios
npx ts-node src/seed.ts

# Inicia o servidor (porta 3001)
npm run start:dev
```

O backend estará disponível em: `http://localhost:3001`
Endpoint: `GET http://localhost:3001/api/contracts`

### 2. Frontend

```bash
cd argos/frontend

# Instala dependências
npm install

# Inicia o servidor de desenvolvimento (porta 3000)
npm run dev
```

O dashboard estará disponível em: `http://localhost:3000`

---

## 🧠 Motor de Risco

O `RiskEngineService` aplica 4 regras independentes e acumula pontos:

| Regra | Condição | Pontos |
|-------|----------|--------|
| `EMPRESA_NOVA` | Fornecedor fundado < 2 anos antes do contrato | +15 |
| `VALOR_ALTO` | Valor do contrato > R$ 500.000 | +10 |
| `POUCOS_CONCORRENTES` | Menos de 3 licitantes | +20 |
| `MUITOS_ADITIVOS` | 3 ou mais aditivos contratuais | +15 |

**Classificação por score acumulado:**

| Score | Nível | Cor |
|-------|-------|-----|
| 0–20 | LOW (Baixo) | 🟢 Verde |
| 21–35 | MEDIUM (Médio) | 🟡 Amarelo |
| 36–50 | HIGH (Alto) | 🟠 Laranja |
| 51+ | CRITICAL (Crítico) | 🔴 Vermelho |

**Score máximo teórico:** 60 pontos (todas as regras ativas)

---

## 🗄 API REST

### `GET /api/contracts`

Retorna todos os contratos com risco calculado, ordenados do mais crítico ao menos crítico.

**Exemplo de resposta:**
```json
[
  {
    "id": "uuid",
    "number": "CT-RJ-2024-005",
    "object": "Consultoria em tecnologia da informação...",
    "value": 7800000,
    "startDate": "2024-05-01T00:00:00.000Z",
    "endDate": "2026-04-30T00:00:00.000Z",
    "competitorCount": 1,
    "additiveCount": 5,
    "riskScore": 60,
    "riskLevel": "CRITICAL",
    "riskFactors": [
      {
        "rule": "EMPRESA_NOVA",
        "description": "Fornecedor fundado há apenas 0.3 ano(s) na data do contrato",
        "score": 15
      },
      {
        "rule": "VALOR_ALTO",
        "description": "Valor contratual de R$ 7.800.000 excede o limiar de R$ 500.000",
        "score": 10
      },
      {
        "rule": "POUCOS_CONCORRENTES",
        "description": "Apenas 1 concorrente(s) na licitação — possível direcionamento",
        "score": 20
      },
      {
        "rule": "MUITOS_ADITIVOS",
        "description": "5 aditivo(s) contratuais — padrão associado a superfaturamento",
        "score": 15
      }
    ],
    "agency": { "id": "...", "name": "...", "cnpj": "...", "state": "RJ" },
    "supplier": { "id": "...", "name": "...", "cnpj": "...", "foundedAt": "..." },
    "createdAt": "..."
  }
]
```

---

## 🎯 Contratos do Seed e Riscos Esperados

| # | Número | Score | Nível | Fatores |
|---|--------|-------|-------|---------|
| 1 | CT-RJ-2024-005 | 60 | CRITICAL | Todos os 4 |
| 2 | CT-SP-2024-001 | 45 | HIGH | Nova+Alto+1 concorrente |
| 3 | CT-DF-2024-002 | 50 | HIGH/CRITICAL | Nova+Alto+2 concorrentes+4 aditivos |
| 4 | CT-AM-2024-003 | 30 | MEDIUM | Alto+2 concorrentes+2 aditivos |
| 5 | CT-AM-2025-007 | 45 | HIGH | Nova+Alto+1 concorrente |
| 6 | CT-DF-2024-004 | 0 | LOW | Nenhum fator |
| 7 | CT-SP-2024-006 | 0 | LOW | Nenhum fator |

---

## 🔧 Variáveis de Ambiente (Opcional)

**Backend** — crie `backend/.env`:
```env
PORT=3001
DATABASE_URL="file:./prisma/argos.db"
```

**Frontend** — crie `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```
