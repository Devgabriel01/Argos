import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("[SEED] Iniciando seed v2...");

  await prisma.contractHistory.deleteMany();
  await prisma.contractAdditive.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash("Argos@2024", 10);
  await prisma.user.create({
    data: {
      name: "Gabriel Chagas",
      email: "gabrielchagas2306@gmail.com",
      password: adminHash,
      role: "ADMIN",
    },
  });

  console.log("[SEED] Admin criado!");

  const agencies = await Promise.all([
    prisma.agency.create({ data: { name: "Secretaria de Obras SP", cnpj: "62577929000135", state: "SP" } }),
    prisma.agency.create({ data: { name: "Ministerio da Saude", cnpj: "00394544001100", state: "DF" } }),
    prisma.agency.create({ data: { name: "Prefeitura de Manaus", cnpj: "04417030000194", state: "AM" } }),
    prisma.agency.create({ data: { name: "Governo do RJ SEDET", cnpj: "42498651000148", state: "RJ" } }),
  ]);

  const suppliers = await Promise.all([
    prisma.supplier.create({ data: { name: "Construtora Horizonte Rapido Ltda", cnpj: "38291047000122", foundedAt: new Date("2023-04-01") } }),
    prisma.supplier.create({ data: { name: "TechGov Solucoes Digitais ME", cnpj: "45102983000171", foundedAt: new Date("2023-10-01") } }),
    prisma.supplier.create({ data: { name: "Grupo Construcao Brasil SA", cnpj: "12345678000190", foundedAt: new Date("2005-03-15") } }),
    prisma.supplier.create({ data: { name: "HealthSupply Distribuidora Ltda", cnpj: "78901234000156", foundedAt: new Date("2015-07-20") } }),
    prisma.supplier.create({ data: { name: "Alfa Servicos Integrados Eireli", cnpj: "99887766000111", foundedAt: new Date("2024-01-10") } }),
  ]);

  const c1 = await prisma.contract.create({ data: { number: "CT-SP-2024-001", object: "Construcao de viaduto na Rodovia Anhanguera", value: 12500000, startDate: new Date("2024-01-15"), endDate: new Date("2025-06-30"), competitorCount: 1, agencyId: agencies[0].id, supplierId: suppliers[0].id } });
  const c2 = await prisma.contract.create({ data: { number: "CT-DF-2024-002", object: "Sistema de gestao hospitalar implantacao e suporte", value: 890000, startDate: new Date("2024-02-01"), endDate: new Date("2026-01-31"), competitorCount: 2, agencyId: agencies[1].id, supplierId: suppliers[1].id } });
  await prisma.contractAdditive.createMany({ data: [
    { contractId: c2.id, description: "Ampliacao modulo telemedicina", valueAdded: 120000, addedAt: new Date("2024-05-01") },
    { contractId: c2.id, description: "Aditivo de prazo 3 meses", valueAdded: 0, addedAt: new Date("2024-08-15") },
    { contractId: c2.id, description: "Inclusao modulo faturamento", valueAdded: 85000, addedAt: new Date("2024-11-01") },
    { contractId: c2.id, description: "Reajuste contratual", valueAdded: 67000, addedAt: new Date("2025-02-10") },
  ]});
  const c3 = await prisma.contract.create({ data: { number: "CT-AM-2024-003", object: "Reforma de 12 escolas municipais zona norte", value: 4200000, startDate: new Date("2024-03-10"), endDate: new Date("2025-03-09"), competitorCount: 2, agencyId: agencies[2].id, supplierId: suppliers[2].id } });
  await prisma.contractAdditive.createMany({ data: [
    { contractId: c3.id, description: "Revisao projeto estrutural bloco C", valueAdded: 340000, addedAt: new Date("2024-07-01") },
    { contractId: c3.id, description: "Aditivo de prazo chuvas 60 dias", valueAdded: 0, addedAt: new Date("2024-10-20") },
  ]});
  await prisma.contract.create({ data: { number: "CT-DF-2024-004", object: "Fornecimento de medicamentos basicos", value: 310000, startDate: new Date("2024-04-01"), endDate: new Date("2024-12-31"), competitorCount: 7, agencyId: agencies[1].id, supplierId: suppliers[3].id } });
  const c5 = await prisma.contract.create({ data: { number: "CT-RJ-2024-005", object: "Consultoria em tecnologia da informacao", value: 7800000, startDate: new Date("2024-05-01"), endDate: new Date("2026-04-30"), competitorCount: 1, agencyId: agencies[3].id, supplierId: suppliers[4].id } });
  await prisma.contractAdditive.createMany({ data: [
    { contractId: c5.id, description: "Ampliacao cloud computing", valueAdded: 450000, addedAt: new Date("2024-07-15") },
    { contractId: c5.id, description: "Seguranca cibernetica", valueAdded: 380000, addedAt: new Date("2024-09-01") },
    { contractId: c5.id, description: "Treinamento adicional equipes", valueAdded: 220000, addedAt: new Date("2024-11-20") },
    { contractId: c5.id, description: "Suporte e manutencao estendida", valueAdded: 310000, addedAt: new Date("2025-01-10") },
    { contractId: c5.id, description: "Reajuste e expansao de escopo", valueAdded: 190000, addedAt: new Date("2025-03-01") },
  ]});
  await prisma.contract.create({ data: { number: "CT-SP-2024-006", object: "Manutencao preventiva de frota oficial", value: 180000, startDate: new Date("2024-06-01"), endDate: new Date("2026-05-31"), competitorCount: 5, agencyId: agencies[0].id, supplierId: suppliers[3].id } });
  await prisma.contract.create({ data: { number: "CT-AM-2025-007", object: "Aquisicao de equipamentos de informatica escolas", value: 620000, startDate: new Date("2025-01-10"), endDate: new Date("2025-12-31"), competitorCount: 1, agencyId: agencies[2].id, supplierId: suppliers[0].id } });

  console.log("[SEED] Contratos: 7");
  console.log("[SEED] ✅ Seed v2 concluido!");
  console.log("[SEED] Login: gabrielchagas2306@gmail.com | Senha: Argos@2024");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
