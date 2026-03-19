'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/');
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Credenciais invalidas';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className='min-h-screen bg-argos-bg flex items-center justify-center'><div className='w-8 h-8 rounded-full border-2 border-argos-accent/30 border-t-argos-accent animate-spin' /></div>;

  return (
    <div className='min-h-screen bg-argos-bg flex items-center justify-center px-4'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col items-center mb-8'>
          <div className='w-14 h-14 rounded-2xl bg-argos-accent/15 border border-argos-accent/30 flex items-center justify-center text-2xl mb-4'>👁</div>
          <h1 className='text-2xl font-mono font-bold text-argos-text tracking-[0.3em]'>ARGOS</h1>
          <p className='text-xs font-mono text-argos-dim mt-1 tracking-widest'>MONITORAMENTO DE CONTRATOS PUBLICOS</p>
        </div>
        <div className='rounded-2xl border border-argos-border bg-argos-surface p-8'>
          <h2 className='text-sm font-mono font-bold text-argos-text mb-6'>Acesso ao Sistema</h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-xs font-mono text-argos-dim mb-1.5 uppercase tracking-wider'>E-mail</label>
              <input type='email' value={email} onChange={e => setEmail(e.target.value)} required placeholder='seu@email.com'
                className='w-full px-4 py-2.5 rounded-lg bg-argos-bg border border-argos-border text-sm font-mono text-argos-text placeholder:text-argos-dim/50 focus:outline-none focus:border-argos-accent/60 transition-all' />
            </div>
            <div>
              <label className='block text-xs font-mono text-argos-dim mb-1.5 uppercase tracking-wider'>Senha</label>
              <input type='password' value={password} onChange={e => setPassword(e.target.value)} required placeholder='••••••••'
                className='w-full px-4 py-2.5 rounded-lg bg-argos-bg border border-argos-border text-sm font-mono text-argos-text placeholder:text-argos-dim/50 focus:outline-none focus:border-argos-accent/60 transition-all' />
            </div>
            {error && <div className='flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-400/10 border border-red-400/30'><span className='text-red-400 text-xs'>⚠</span><p className='text-xs font-mono text-red-400'>{error}</p></div>}
            <button type='submit' disabled={submitting}
              className='w-full py-2.5 rounded-lg mt-2 bg-argos-accent text-white text-sm font-mono font-bold tracking-wider hover:bg-argos-accent/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2'>
              {submitting ? <><span className='w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin' />Entrando...</> : 'Entrar no Sistema'}
            </button>
          </form>
        </div>
        <p className='text-center text-xs font-mono text-argos-dim mt-6'>Acesso restrito a usuarios autorizados</p>
      </div>
    </div>
  );
}
