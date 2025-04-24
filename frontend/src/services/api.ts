import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getCurrentUserToken, isTokenExpired } from './authService';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      // Verificar se o token está expirado
      const tokenExpired = await isTokenExpired();
      if (tokenExpired) {
        console.warn('Token expirado, redirecionando para login');
        window.location.href = '/login';
        return Promise.reject(new Error('Token expirado'));
      }
      
      const token = await getCurrentUserToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log de requisição
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
      
      return config;
    } catch (error) {
      console.error('[API] Erro ao preparar requisição:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('[API] Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de resposta bem-sucedida
    console.log(`[API] Resposta ${response.status} de ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // Log detalhado de erro
    console.error(
      `[API] Erro ${error.response?.status || 'desconhecido'} em ${error.config?.url}:`,
      error.response?.data || error.message
    );
    
    // Tratamento específico de erros HTTP
    if (error.response) {
      const { status } = error.response;
      
      // Erro de autenticação
      if (status === 401) {
        console.warn('Sessão expirada, redirecionando para login');
        window.location.href = '/login';
      }
      
      // Erro de permissão
      if (status === 403) {
        console.warn('Sem permissão para acessar este recurso');
      }
      
      // Erro de servidor
      if (status >= 500) {
        console.error('Erro no servidor:', error.response.data);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Função auxiliar para requisições GET
 */
export const get = async <T>(path: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.get<T>(path, { ...config, params });
    return response.data;
  } catch (error) {
    console.error(`[API GET] Erro em ${path}:`, error);
    throw error;
  }
};

/**
 * Função auxiliar para requisições POST
 */
export const post = async <T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.post<T>(path, data, config);
    return response.data;
  } catch (error) {
    console.error(`[API POST] Erro em ${path}:`, error);
    throw error;
  }
};

/**
 * Função auxiliar para requisições PUT
 */
export const put = async <T>(path: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.put<T>(path, data, config);
    return response.data;
  } catch (error) {
    console.error(`[API PUT] Erro em ${path}:`, error);
    throw error;
  }
};

/**
 * Função auxiliar para requisições DELETE
 */
export const del = async <T>(path: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await api.delete<T>(path, config);
    return response.data;
  } catch (error) {
    console.error(`[API DELETE] Erro em ${path}:`, error);
    throw error;
  }
};

/**
 * Função para verificar se a API está disponível
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    console.error('[API] API indisponível:', error);
    return false;
  }
};

export default api;
