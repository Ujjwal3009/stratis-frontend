import { getAuthToken } from './auth';

const BASE_URL = 'http://localhost:8080'; // Configure this via env var in real app

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestConfig {
  method?: RequestMethod;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: config.method || 'GET',
    headers,
    body: config.body ? JSON.stringify(config.body) : undefined,
  });

  // Handle 401 Unauthorized globally if needed (e.g. redirect to login)
  // For now, we throw error and let caller/context handle it
  if (response.status === 401) {
    // Optionally trigger logout event here
    throw new ApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    let errorData = null;
    try {
      errorData = await response.json();
      errorMessage = errorData?.message || errorMessage;
    } catch (e) {
      // failed to parse error json
    }
    throw new ApiError(response.status, errorMessage, errorData);
  }

  // Handle empty responses
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0') {
    return {} as T;
  }

  try {
    return await response.json();
  } catch (e) {
    // If response is OK but not JSON (e.g. simple string or empty), return safe default or check content-type
    return {} as T;
  }
}

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', headers }),
  post: <T>(endpoint: string, body: any, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'POST', body, headers }),
  put: <T>(endpoint: string, body: any, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PUT', body, headers }),
  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'DELETE', headers }),
};
