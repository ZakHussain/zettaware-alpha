import { APIClient } from '../../utils/api-client';
import { CrewContract, ProcessRequest, ProcessResponse, HealthStatus } from '../contracts/crew.contract';
import { CrewType, ENDPOINTS } from '../../config/endpoints.config';

export class CrewAIAdapter implements CrewContract {
  private client: APIClient;
  private crewType: CrewType;


constructor(crewType: CrewType) {
    this.crewType = crewType;
    const crewConfig = ENDPOINTS.crews[crewType];

    console.log(`[${crewType}] Initializing adapter with base URL: ${crewConfig.base}`);

    this.client = new APIClient({
      baseURL: crewConfig.base,
      timeout: 180000, // 3 minutes timeout for LLM crew requests
      headers: {
        'User-Agent': 'Bolt-CodeGen/1.0'
      }
    });
  }

  async sendMessage(endpoint: string, request: ProcessRequest): Promise<ProcessResponse> {
    const startTime = Date.now();

    console.log(`[${this.crewType}] Sending message to endpoint: ${endpoint}`, { request });

    try {
      // const payload: ProcessRequest;

      const payload:ProcessRequest = {
          message: request.message,
          context: request.context,
          model: request.model,
          temperature: request.temperature || 0.7,
          maxTokens: request.maxTokens || 4096,
          stream: request.stream || false
      }

      // processing
      const endpointPath = ENDPOINTS.crews[this.crewType].endpoints[endpoint as keyof typeof ENDPOINTS.crews[typeof this.crewType]['endpoints']].path;
      console.log(`[${this.crewType}] Making request to: ${this.client['config'].baseURL}${endpointPath}`, { payload });

      const response = await this.client.post<ProcessResponse>(
        endpointPath,
        payload,
        `${this.crewType}-${endpoint}-${Date.now()}`
      );

      const executionTime = Date.now() - startTime;

      // Standard response handling for crews
      return {
        success: true,
        message: response.message,
        executionTime,
        tokens: response.tokens ? {
          prompt_input_tokens: response.tokens.prompt_input_tokens|| 0,
          prompt_output_tokens: response.tokens.prompt_output_tokens || 0
        } : undefined
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`[${this.crewType}] Request failed`, error);

      return {
        success: false,
        executionTime,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }


  async checkHealth(): Promise<HealthStatus> {
    try {
      const response = await this.client.get<HealthStatus>(
        ENDPOINTS.crews[this.crewType].endpoints.health.path,
        `${this.crewType}-health`
      );

      return {
        status: response.status || 'healthy',
        uptime: response.uptime || 0,
        version: response.version,
        model: response.model,
        lastCheck: new Date(),
        details: response.details
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        uptime: 0,
        lastCheck: new Date(),
        details: {
          error: error instanceof Error ? error.message : 'Health check failed'
        }
      };
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await this.client.get<{ models: string[] }>('/models');
      return response.models;
    } catch (error) {
      console.warn(`Failed to fetch models for ${this.crewType}:`, error);
      return [];
    }
  }
}