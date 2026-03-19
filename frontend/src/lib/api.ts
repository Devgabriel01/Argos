import axios from 'axios';
import { Contract } from './types';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('argos_token');
    if (token) config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('argos_token');
      localStorage.removeItem('argos_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export async function loginRequest(email: string, password: string) {
  const { data } = await http.post('/api/auth/login', { email, password });
  return data;
}

export async function fetchContracts(): Promise<Contract[]> {
  const { data } = await http.get('/api/contracts');
  return data;
}

export async function importarPorOrgao(codigoOrgao: string, pagina = 1) {
  const { data } = await http.post('/api/transparencia/importar/orgao', { codigoOrgao, pagina });
  return data;
}

export async function importarPorFornecedor(cnpj: string, pagina = 1) {
  const { data } = await http.post('/api/transparencia/importar/fornecedor', { cnpj, pagina });
  return data;
}

export default http;
