import { CrewType } from './endpoints.config';

export interface CrewConfig {
  id: CrewType;
  name: string;
  description: string;
  icon: string;
  color: string;
  capabilities: string[];
  defaultEndpoint: string;
}


export const CREWS: Record<CrewType, CrewConfig> = {
  transbot: {
    id: 'transbot',
    name: 'Transbot Code Generation Crew',
    description: 'Python code generation for transbot robot for motion planning',
    icon: 'Cpu',
    color: 'bg-green-500',
    capabilities: ['Motion Planning'],
    defaultEndpoint: 'generate'
  },
  // add other crews here ... then update the endpoints.configs
}