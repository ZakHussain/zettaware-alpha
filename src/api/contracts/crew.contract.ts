import { Message } from '../../schemas/message.schema';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  uptime: number;
  version?: string;
  model?: string;
  lastCheck: Date;
  details?: Record<string, any>;
}

// Note: for now only message is used
// Todo: the additional fields can be expanded on later
export interface ProcessRequest {
  message: Message;
  context?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ProcessResponse {
  success: boolean;
  message?: string;
  data?: any;
  executionTime: number;
  tokens?: {
    prompt_input_tokens: number;
    prompt_output_tokens: number;
  };
  error?:string;
}

export interface CrewContract {
  sendMessage(endpoint: string, request: ProcessRequest): Promise<ProcessResponse>;
  checkHealth(): Promise<HealthStatus>;
  getAvailableModels?(): Promise<string[]>;
  streamResponse?(endpoint: string, request: ProcessRequest): AsyncIterableIterator<string>;
}
// export interface CrewContract {
//   sendMessage(endpoint: string, request: ProcessRequest): Promise<ProcessResponse>;
//   checkHealth(): Promise<HealthStatus>;
//   getAvailableModels?(): Promise<string[]>;
//   streamResponse?(endpoint: string, request: ProcessRequest): AsyncIterableIterator<string>;
// }