import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'ARGOS',
  description: 'Monitoramento de Contratos Publicos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body className='bg-argos-bg min-h-screen'>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
