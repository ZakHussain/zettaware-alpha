export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
  status: 'available' | 'unavailable' | 'error';
}

export const DEFAULT_MODEL = 'gpt-4o-mini'

// Model pricing page - https://platform.openai.com/docs/models/compare?model=gpt-4o-mini
export const MODELS: Record<string, ModelConfig> = {
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'gpt-4o mini',
    provider: 'openai',
    maxTokens: 4096,
    supportsStreaming: true,
    supportsVision: true,
    status: 'unavailable'
  }
}


// // TODO: once working, apply a more complete Model interface
// export interface ModelPricing {
//   input: number;           // Cost per 1M tokens
//   cachedInput?: number;    // Cost per 1M cached tokens (optional)
//   output: number;          // Cost per 1M tokens
//   reasoningTokens?: number; // Cost per 1M reasoning tokens (if applicable)
// }

// export interface ModelContext {
//   window: number;          // Context window size
//   maxOutputTokens: number; // Maximum output tokens
// }

// export interface ModelEndpoints {
//   chatCompletions: boolean;
//   responses?: boolean;
//   assistants?: boolean;
//   batch?: boolean;
//   fineTuning?: boolean;
// }

// export interface ModelFeatures {
//   streaming: boolean;
//   functionCalling: boolean;
//   structuredOutputs: boolean;
//   fineTuning: boolean;
//   distillation: boolean;
//   predictedOutputs: boolean;
//   imageInput: boolean;
// }

// export interface RateLimitTier {
//   name: string;
//   tokensPerMinute: number;
// }

// export interface ModelRateLimits {
//   tiers: RateLimitTier[];
// }

// export interface ModelPerformance {
//   intelligence: 'low' | 'medium' | 'high' | 'very_high';
//   speed: 'slow' | 'medium' | 'fast' | 'very_fast';
//   inputLatency?: 'low' | 'medium' | 'high';
//   outputLatency?: 'low' | 'medium' | 'high';
// }

// export interface ModelConfig {
//   // Basic Information
//   id: string;
//   name: string;
//   provider: string;
//   status: 'available' | 'loading' | 'error' | 'deprecated';
//   knowledgeCutoff: string; // ISO date string
  
//   // Performance Characteristics
//   performance: ModelPerformance;
  
//   // Context and Token Limits
//   context: ModelContext;
  
//   // Pricing (per 1M tokens)
//   pricing: ModelPricing;
  
//   // Supported Endpoints
//   endpoints: ModelEndpoints;
  
//   // Features
//   features: ModelFeatures;
  
//   // Rate Limits
//   rateLimits: ModelRateLimits;
  
//   // Legacy compatibility fields (can be derived from features)
//   maxTokens: number;        // Same as context.maxOutputTokens
//   supportsStreaming: boolean; // Same as features.streaming
//   supportsVision: boolean;    // Same as features.imageInput
// }

// // Example usage with gpt-4o-mini
// export const MODELS: Record<string, ModelConfig> = {
//   'gpt-4o-mini': {
//     id: 'gpt-4o-mini',
//     name: 'GPT-4o Mini',
//     provider: 'openai',
//     status: 'available',
//     knowledgeCutoff: '2023-10-01',
    
//     performance: {
//       intelligence: 'high',
//       speed: 'very_fast',
//       inputLatency: 'low',
//       outputLatency: 'low'
//     },
    
//     context: {
//       window: 128000,
//       maxOutputTokens: 16384
//     },
    
//     pricing: {
//       input: 0.15,
//       cachedInput: 0.08,
//       output: 0.60
//     },
    
//     endpoints: {
//       chatCompletions: true,
//       responses: true,
//       assistants: true,
//       batch: true,
//       fineTuning: true
//     },
    
//     features: {
//       streaming: true,
//       functionCalling: true,
//       structuredOutputs: true,
//       fineTuning: true,
//       distillation: true,
//       predictedOutputs: true,
//       imageInput: true
//     },
    
//     rateLimits: {
//       tiers: [
//         { name: 'Free', tokensPerMinute: 40000 },
//         { name: 'Tier 1', tokensPerMinute: 200000 },
//         { name: 'Tier 2', tokensPerMinute: 2000000 },
//         { name: 'Tier 3', tokensPerMinute: 4000000 },
//         { name: 'Tier 4', tokensPerMinute: 10000000 },
//         { name: 'Tier 5', tokensPerMinute: 150000000 }
//       ]
//     },
    
//     // Legacy compatibility
//     maxTokens: 16384,
//     supportsStreaming: true,
//     supportsVision: true
//   }
// };

// // Helper functions for working with model configs
// export const getModelPricing = (model: ModelConfig, tokenType: 'input' | 'output' | 'cachedInput') => {
//   const price = tokenType === 'cachedInput' ? model.pricing.cachedInput : model.pricing[tokenType];
//   return price ?? null;
// };

// export const getRateLimitForTier = (model: ModelConfig, tierName: string): number | null => {
//   const tier = model.rateLimits.tiers.find(t => t.name === tierName);
//   return tier?.tokensPerMinute ?? null;
// };

// export const isFeatureSupported = (model: ModelConfig, feature: keyof ModelFeatures): boolean => {
//   return model.features[feature] ?? false;
// };

// // Type guard for checking if cached pricing is available
// export const hasCachedPricing = (model: ModelConfig): boolean => {
//   return model.pricing.cachedInput !== undefined;
// };

// // Calculate cost for a given number of tokens
// export const calculateCost = (
//   model: ModelConfig,
//   inputTokens: number,
//   outputTokens: number,
//   cachedTokens: number = 0
// ): number => {
//   const inputCost = (inputTokens - cachedTokens) * (model.pricing.input / 1000000);
//   const cachedCost = cachedTokens * (model.pricing.cachedInput ?? model.pricing.input) / 1000000;
//   const outputCost = outputTokens * (model.pricing.output / 1000000);
  
//   return inputCost + cachedCost + outputCost;
// };