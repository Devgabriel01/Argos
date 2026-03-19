'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { fetchContracts } from '@/lib/api';
import { Contract } from '@/lib/types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { formatCurrency } from '@/lib/format';

const RISK_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#f59e0b',
  LOW: '#22c55e',
};

const RISK_LABELS: Record<string, string> = {
  CRITICAL: 'Critico',
  HIGH: 'Alto',
  MEDIUM: 'Medio',
  LOW: 'Baixo',
};

export default function GraficosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) fetchContracts().then(setContracts).finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) return <div className='min-h-screen bg-argos-bg flex items-center justify-center'><div className='w-8 h-8 rounded-full border-2 border-argos-accent/30 border-t-argos-accent animate-spin' /></div>;

  // Dados para pizza
  const pieData = ['CRITICAL','HIGH','MEDIUM','LOW'].map(level => ({
    name: RISK_LABELS[level],
    value: contracts.filter(c => c.riskLevel === level).length,
    color: RISK_COLORS[level],
  })).filter(d => d.value > 0);

  // Top 10 por valor
  const top10 = [...contracts].sort((a,b) => b.value - a.value).slice(0,10).map(c => ({
    name: c.number,
    valor: c.value,
    score: c.riskScore,
    color: RISK_COLORS[c.riskLevel],
  }));

  // Contratos por mes
  const byMonth: Record<string, number> = {};
  contracts.forEach(c => {
    const d = new Date(c.startDate);
    const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
    byMonth[key] = (byMonth[key] || 0) + 1;
  });
  const lineData = Object.entries(byMonth).sort(([a],[b]) => a.localeCompare(b)).map(([mes, total]) => ({ mes, total }));

  // Valor por nivel
  const valorPorNivel = ['CRITICAL','HIGH','MEDIUM','LOW'].map(level => ({
    name: RISK_LABELS[level],
    valor: contracts.filter(c => c.riskLevel === level).reduce((s,c) => s + c.value, 0),
    color: RISK_COLORS[level],
  }));

  const totalValue = contracts.reduce((s,c) => s + c.value, 0);
  const avgScore = contracts.length ? Math.round(contracts.reduce((s,c) => s + c.riskScore, 0) / contracts.length) : 0;
  const criticalValue = contracts.filter(c => c.riskLevel === 'CRITICAL').reduce((s,c) => s + c.value, 0);

  return (
    <div className='min-h-screen bg-argos-bg bg-grid'>
      <header className='sticky top-0 z-20 border-b border-argos-border bg-argos-bg/90 backdrop-blur-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-lg bg-argos-accent/20 border border-argos-accent/40 flex items-center justify-center text-sm'>👁</div>
            <div>
              <h1 className='text-sm font-mono font-bold text-argos-text tracking-[0.2em]'>ARGOS</h1>
              <p className='text-[10px] font-mono text-argos-dim tracking-wider'>ANALISE ESTATISTICA</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <button onClick={() => router.push('/')} className='px-3 py-1.5 rounded-lg border border-argos-border text-xs font-mono text-argos-dim hover:text-argos-text hover:border-argos-muted transition-all'>
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
        <div className='mb-8'>
          <h2 className='text-xl font-sans font-semibold text-argos-text mb-1'>Analise Estatistica</h2>
          <p className='text-sm font-mono text-argos-dim'>Visualizacao dos {contracts.length} contratos monitorados</p>
        </div>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <StatCard label='Score Medio' value={avgScore + 'pts'} color='#4f7ef8' />
          <StatCard label='Valor Total' value={formatCurrency(totalValue)} color='#4f7ef8' />
          <StatCard label='Valor em Risco Critico' value={formatCurrency(criticalValue)} color='#ef4444' />
          <StatCard label='Contratos Criticos' value={String(contracts.filter(c => c.riskLevel === 'CRITICAL').length)} color='#ef4444' />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <ChartCard title='Distribuicao por Nivel de Risco' subtitle='Quantidade de contratos por classificacao'>
            <ResponsiveContainer width='100%' height={280}>
              <PieChart>
                <Pie data={pieData} cx='50%' cy='50%' innerRadius={70} outerRadius={110} paddingAngle={3} dataKey='value'>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }} formatter={(v: any, n: any) => [v + ' contratos', n]} />
                <Legend formatter={(v) => <span style={{color:'#8891b4',fontFamily:'monospace',fontSize:'12px'}}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title='Valor Exposto por Nivel de Risco' subtitle='Soma dos valores contratuais por classificacao'>
            <ResponsiveContainer width='100%' height={280}>
              <BarChart data={valorPorNivel} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#1e2130' />
                <XAxis dataKey='name' tick={{ fill: '#8891b4', fontFamily: 'monospace', fontSize: 11 }} axisLine={{ stroke: '#1e2130' }} />
                <YAxis tick={{ fill: '#8891b4', fontFamily: 'monospace', fontSize: 10 }} axisLine={{ stroke: '#1e2130' }} tickFormatter={v => 'R$' + (v/1000000).toFixed(1) + 'M'} />
                <Tooltip contentStyle={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }} formatter={(v: any) => [formatCurrency(v), 'Valor']} />
                <Bar dataKey='valor' radius={[4,4,0,0]}>
                  {valorPorNivel.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <ChartCard title='Top 10 Contratos por Valor' subtitle='Maiores contratos em valores absolutos'>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={top10} layout='vertical' margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#1e2130' horizontal={false} />
                <XAxis type='number' tick={{ fill: '#8891b4', fontFamily: 'monospace', fontSize: 10 }} axisLine={{ stroke: '#1e2130' }} tickFormatter={v => 'R$' + (v/1000000).toFixed(1) + 'M'} />
                <YAxis type='category' dataKey='name' tick={{ fill: '#8891b4', fontFamily: 'monospace', fontSize: 9 }} axisLine={{ stroke: '#1e2130' }} width={90} />
                <Tooltip contentStyle={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }} formatter={(v: any) => [formatCurrency(v), 'Valor']} />
                <Bar dataKey='valor' radius={[0,4,4,0]}>
                  {top10.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title='Contratos por Mes de Inicio' subtitle='Distribuicao temporal dos contratos'>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#1e2130' />
                <XAxis dataKey='mes' tick={{ fill: '#8891b4', fontFamily: 'monospace', fontSize: 10 }} axisLine={{ stroke: '#1e2130' }} />
                <YAxis tick={{ fill: '#8891b4', fontFamily: 'monospace', fontSize: 10 }} axisLine={{ stroke: '#1e2130' }} />
                <Tooltip contentStyle={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }} formatter={(v: any) => [v + ' contratos', 'Total']} />
                <Line type='monotone' dataKey='total' stroke='#4f7ef8' strokeWidth={2} dot={{ fill: '#4f7ef8', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className='rounded-xl border border-argos-border bg-argos-surface p-4' style={{ boxShadow: 'inset 0 1px 0 ' + color + '30' }}>
      <div className='absolute' style={{ background: color, opacity: 0.5 }} />
      <p className='text-xs font-mono text-argos-dim mb-1 uppercase tracking-wider'>{label}</p>
      <p className='text-lg font-mono font-bold truncate' style={{ color }}>{value}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className='rounded-xl border border-argos-border bg-argos-surface p-5'>
      <div className='mb-4'>
        <h3 className='text-sm font-mono font-bold text-argos-text'>{title}</h3>
        <p className='text-xs font-mono text-argos-dim mt-0.5'>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
