// add additional crews to the crews object.
export const ENDPOINTS = {
  crews: {
    transbot: {
      base: 'http://localhost:8001',
      endpoints: {
        generate: {
          path: '/generate-behavior',
          name: 'Transbot Code Generation',
          description: 'Generate Python control script for Transbot robot for motion planning',
          usage: 'Use to complete Python scripts for Tankbot movement.',
          request: {
            method: 'POST',
            body: {
              user_query: 'string (required) - Natural language description of desired robot behavior',
            }
          },
          response: {
            body: {
              status: 'string - Generation status (success, partial, failed, warning)',
              message: 'string - Human-readable response message',
              motion_plan: 'object (optional) - Generated motion plan with step-by-step instructions',
              api_references: 'array - Relevant Transbot_Lib API function references',
              generated_script: 'object (optional) - Complete Python script with metadata',
              usage_metrics: 'object (optional) - Token usage and performance metrics',
              warnings: 'array - Warning messages',
              errors: 'array - Error messages',
              metadata: 'object - Additional metadata and generation details'
            }
          }
        },
        health: {
          path: '/health',
          name: 'Health Check',
          description: 'Returns the health status and operational metrics of the TankBot Code Generation Crew',
          usage: 'Use to monitor service availability and LLM provider status',
          request: {
            method: 'GET',
            body: 'No body required'
          },
          response: {
            body: {
              status: 'string - Service health status (healthy/unhealthy/degraded)',
              uptime: 'number - Service uptime in milliseconds',
              version: 'string (optional) - Service version',
              model: 'string (optional) - Currently loaded model',
              details: 'object (optional) - Additional health details'
            }
          }
        }
      }
    } 
  },

  supabase: {
    base: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY
  }
} as const;

export type CrewType = keyof typeof ENDPOINTS.crews;
export type EndpointType<T extends CrewType> = keyof typeof ENDPOINTS.crews[T]['endpoints'];