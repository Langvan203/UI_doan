import { useAuth } from '@/app/providers/auth-provider';
import { fetchApi } from '@/lib/api-helper';

/**
 * Custom hook that provides authenticated API access
 */
export function useAuthApi() {
  const { getToken } = useAuth();
  
  /**
   * Make an authenticated API request
   */
  async function authFetch<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = getToken();
    return fetchApi<T>(endpoint, {
      ...options,
      token,
    });
  }

  return {
    get: <T>(endpoint: string) => authFetch<T>(endpoint, { method: 'GET' }),
    post: <T>(endpoint: string, data: any) => authFetch<T>(endpoint, { 
      method: 'POST', 
      body: data 
    }),
    put: <T>(endpoint: string, data: any) => authFetch<T>(endpoint, { 
      method: 'PUT', 
      body: data 
    }),
    delete: <T>(endpoint: string) => authFetch<T>(endpoint, { method: 'DELETE' }),
  };
} 