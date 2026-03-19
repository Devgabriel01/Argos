'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { fetchContracts } from '@/lib/api';
import { Contract, RiskLevel } from '@/lib/types';
import { ContractCard } from '@/components/ContractCard';
import { StatsBar } from '@/components/StatsBar';
import { FilterBar } from '@/components/FilterBar';

export default function DashboardPage() {
  const { user, loading: authLoading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [showImport, setShowImport] = useState(false);
  const [importOrgao, setImportOrgao] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  const loadContracts = () => {
    setDataLoading(true); setError(null);
    fetchContracts()
      .then(setContracts)
      .catch(() => setError('Nao foi possivel carregar os contratos.'))
      .finally(() => setDataLoading(false));
  };

  useEffect(() => { if (user) loadContracts(); }, [user]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return contracts.filter(c => {
      const matchesLevel = levelFilter === 'ALL' || c.riskLevel === levelFilter;
      const matchesSearch = !term || c.object.toLowerCase().includes(term) || c.agency.name.toLowerCase().includes(term) || c.supplier.name.toLowerCase().includes(term) || c.number.toLowerCase().includes(term);
      return matchesLevel && matchesSearch;
    });
  }, [contracts, search, levelFilter]);

  const handleImport = async () => {
    if (!importOrgao.trim()) return;
    setImporting(true); setImportResult(null);
    try {
      const { data } = await (await import('@/lib/api')).default.post('/api/transparencia/importar/orgao', { codigoOrgao: importOrgao });
      setImportResult(data);
      loadContracts();
    } catch(e: any) {
      setImportResult({ erro: e.response?.data?.message || 'Erro na importacao' });
    } finally { setImporting(false); }
  };

  if (authLoading || (!user && !authLoading)) return <div className='min-h-screen bg-argos-bg flex items-center justify-center'><div className='w-8 h-8 rounded-full border-2 border-argos-accent/30 border-t-argos-accent animate-spin' /></div>;

  return (
    <div className='min-h-screen bg-argos-bg bg-grid'>
      <header className='sticky top-0 z-20 border-b border-argos-border bg-argos-bg/90 backdrop-blur-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <div className='w-8 h-8 rounded-lg bg-argos-accent/20 border border-argos-accent/40 flex items-center justify-center'>
                <span className='text-sm'>👁</span>
              </div>
              <span className='absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-argos-accent animate-pulse-slow' />
            </div>
            <div>
              <h1 className='text-sm font-mono font-bold text-argos-text tracking-[0.2em]'>ARGOS</h1>
              <p className='text-[10px] font-mono text-argos-dim tracking-wider hidden sm:block'>MONITORAMENTO DE CONTRATOS PUBLICOS</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <button onClick={() => router.push('/graficos')} className='flex items-center gap-2 px-3 py-1.5 rounded-lg border border-argos-border text-xs font-mono text-argos-dim hover:text-argos-text transition-all'>?? Graficos</button>
            {isAdmin && (
              <button onClick={() => setShowImport(!showImport)} className='flex items-center gap-2 px-3 py-1.5 rounded-lg border border-argos-accent/40 bg-argos-accent/10 text-argos-accent text-xs font-mono font-bold hover:bg-argos-accent/20 transition-all'>
                ↓ Importar
              </button>
            )}
            <div className='hidden md:flex items-center gap-2 text-xs font-mono text-argos-dim'>
              {dataLoading ? <><span className='w-2 h-2 rounded-full bg-amber-400 animate-pulse' /> carregando...</> : <><span className='w-2 h-2 rounded-full bg-green-400' /> {contracts.length} contratos</>}
            </div>
            <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg border border-argos-border bg-argos-surface'>
              <div className='w-6 h-6 rounded-full bg-argos-accent/20 border border-argos-accent/40 flex items-center justify-center'>
                <span className='text-xs font-mono font-bold text-argos-accent'>{user?.name?.charAt(0)}</span>
              </div>
              <span className='text-xs font-mono text-argos-dim hidden sm:block'>{user?.name?.split(' ')[0]}</span>
              <button onClick={() => { logout(); router.replace('/login'); }} className='text-xs font-mono text-red-400 hover:text-red-300 transition-colors ml-1'>sair</button>
            </div>
          </div>
        </div>
        {showImport && isAdmin && (
          <div className='border-t border-argos-border bg-argos-surface px-4 sm:px-6 py-4'>
            <p className='text-xs font-mono text-argos-dim mb-3'>Importar do Portal da Transparencia — informe o codigo SIAFI do orgao:</p>
            <div className='flex gap-3 flex-wrap'>
              <input value={importOrgao} onChange={e => setImportOrgao(e.target.value)} placeholder='Ex: 36000 (Ministerio da Saude)'
                className='flex-1 min-w-48 px-4 py-2 rounded-lg bg-argos-bg border border-argos-border text-sm font-mono text-argos-text placeholder:text-argos-dim/50 focus:outline-none focus:border-argos-accent/60 transition-all' />
              <button onClick={handleImport} disabled={importing} className='px-4 py-2 rounded-lg bg-argos-accent text-white text-xs font-mono font-bold hover:bg-argos-accent/90 disabled:opacity-50 transition-all flex items-center gap-2'>
                {importing ? <><span className='w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin' />Importando...</> : 'Importar'}
              </button>
              {['36000','26000','52000','30000'].map(c => (
                <button key={c} onClick={() => setImportOrgao(c)} className='px-3 py-2 rounded-lg bg-argos-muted/50 border border-argos-border text-xs font-mono text-argos-dim hover:text-argos-text transition-all'>{c}</button>
              ))}
            </div>
            {importResult && (
              <div className='mt-3 p-3 rounded-lg border border-green-400/30 bg-green-400/5'>
                {importResult.erro
                  ? <p className='text-xs font-mono text-red-400'>{importResult.erro}</p>
                  : <p className='text-xs font-mono text-green-400'>Importados: {importResult.importados} | Atualizados: {importResult.atualizados} | Erros: {importResult.erros}</p>
                }
              </div>
            )}
          </div>
        )}
      </header>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
        {dataLoading && <div className='flex flex-col items-center justify-center py-32 gap-4'><div className='w-10 h-10 rounded-full border-2 border-argos-accent/30 border-t-argos-accent animate-spin' /><p className='text-sm font-mono text-argos-dim'>Carregando...</p></div>}
        {error && !dataLoading && <div className='flex flex-col items-center py-24 gap-4'><p className='text-red-400 font-mono text-sm'>{error}</p><button onClick={loadContracts} className='px-4 py-2 rounded-lg bg-argos-accent text-white text-xs font-mono'>Tentar novamente</button></div>}
        {!dataLoading && !error && (
          <>
            <div className='mb-6'>
              <h2 className='text-xl font-sans font-semibold text-argos-text mb-1'>Painel de Monitoramento</h2>
              <p className='text-sm font-mono text-argos-dim'>Contratos ordenados por score de risco</p>
            </div>
            <StatsBar contracts={contracts} />
            <FilterBar search={search} onSearch={setSearch} levelFilter={levelFilter} onLevelFilter={setLevelFilter} />
            {filtered.length === 0 ? (
              <div className='flex flex-col items-center py-20 gap-3'>
                <span className='text-4xl'>🔍</span>
                <p className='text-sm font-mono text-argos-dim'>Nenhum contrato encontrado</p>
                <button onClick={() => { setSearch(''); setLevelFilter('ALL'); }} className='text-xs font-mono text-argos-accent hover:underline'>Limpar filtros</button>
              </div>
            ) : (
              <>
                <p className='text-xs font-mono text-argos-dim mb-4'>Exibindo {filtered.length} de {contracts.length} contrato(s)</p>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                  {filtered.map((contract, i) => (
                    <div key={contract.id} className='card-enter' style={{ animationDelay: i * 60 + 'ms' }}>
                      <ContractCard contract={contract} index={i} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
      <footer className='border-t border-argos-border mt-16 py-6'>
        <div className='max-w-7xl mx-auto px-4 flex items-center justify-between'>
          <p className='text-xs font-mono text-argos-dim'>ARGOS v2 © 2024</p>
          <p className='text-xs font-mono text-argos-dim'>Motor de risco v2.0 · Score max: 60pts</p>
        </div>
      </footer>
    </div>
  );
}

