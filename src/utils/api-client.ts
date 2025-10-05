export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public crew?: string,
    public endpoint?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface APIClientConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export class APIClient {
  private config: APIClientConfig;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(config: APIClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      ...config
    };
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
    requestId?: string
  ): Promise<Response> {
    const url = `${this.config.baseURL}${endpoint}`;
    const controller = new AbortController();
    
    if (requestId) {
      this.abortControllers.set(requestId, controller);
    }

    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
          ...options.headers
        }
      });

      clearTimeout(timeoutId);
      
      if (requestId) {
        this.abortControllers.delete(requestId);
      }

      if (!response.ok) {
        throw new APIError(
          response.status,
          `HTTP ${response.status}: ${response.statusText}`,
          undefined,
          endpoint,
          await response.text().catch(() => null)
        );
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (requestId) {
        this.abortControllers.delete(requestId);
      }

      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        0,
        error instanceof Error ? error.message : 'Network error',
        undefined,
        endpoint
      );
    }
  }

  async get<T>(endpoint: string, requestId?: string): Promise<T> {
    const response = await this.makeRequest(endpoint, { method: 'GET' }, requestId);
    return response.json();
  }

  async post<T>(endpoint: string, data?: any, requestId?: string): Promise<T> {
    const response = await this.makeRequest(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
      },
      requestId
    );
    return response.json();
  }

  async postFormData<T>(endpoint: string, formData: FormData, requestId?: string): Promise<T> {
    const response = await this.makeRequest(
      endpoint,
      {
        method: 'POST',
        body: formData,
        headers: {} // Let browser set multipart headers
      },
      requestId
    );
    return response.json();
  }

  cancelRequest(requestId: string): void {
    const controller = this.abortControllers.get(requestId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(requestId);
    }
  }

  cancelAllRequests(): void {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }
}