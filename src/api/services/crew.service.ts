import { CrewAIAdapter } from '../adapters/crewai.adapter';
import { CrewContract, ProcessRequest, ProcessResponse, HealthStatus } from '../contracts/crew.contract';
import { CrewType } from '../../config/endpoints.config';
import { Message } from '../../schemas/message.schema';

export class CrewService {
  private adapters: Map<CrewType, CrewContract> = new Map();

  constructor() {
    this.initializeAdapters();
  }

  private initializeAdapters() {
    const crewTypes: CrewType[] = ['transbot'];
    
    crewTypes.forEach(crewType => {
      this.adapters.set(crewType, new CrewAIAdapter(crewType));
    });
  }

  async sendMessage(
    crew: CrewType,
    endpoint: string,
    message: Message,
    context?: string,
    model?: string
  ): Promise<ProcessResponse> {
    const adapter = this.adapters.get(crew);
    if (!adapter) {
      throw new Error(`Crew ${crew} not found`);
    }

    const request: ProcessRequest = {
      message,
      context,
      model,
      temperature: 0.7,
      maxTokens: 4096
    };

    return adapter.sendMessage(endpoint, request);
  }

  async checkCrewHealth(crew: CrewType): Promise<HealthStatus> {
    const adapter = this.adapters.get(crew);
    if (!adapter) {
      throw new Error(`Crew ${crew} not found`);
    }

    return adapter.checkHealth();
  }

  async checkAllCrewsHealth(): Promise<Record<CrewType, HealthStatus>> {
    const results: Record<string, HealthStatus> = {};
    
    for (const [crew, adapter] of this.adapters.entries()) {
      try {
        results[crew] = await adapter.checkHealth();
      } catch (error) {
        results[crew] = {
          status: 'unhealthy',
          uptime: 0,
          lastCheck: new Date(),
          details: {
            error: error instanceof Error ? error.message : 'Health check failed'
          }
        };
      }
    }

    return results as Record<CrewType, HealthStatus>;
  }

  async getAvailableModels(crew: CrewType): Promise<string[]> {
    const adapter = this.adapters.get(crew);
    if (!adapter || !adapter.getAvailableModels) {
      return [];
    }

    return adapter.getAvailableModels();
  }
}