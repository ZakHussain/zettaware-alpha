export interface MessageSchemaV1 {
  id: string;
  content: string;
  role: 'user' | 'assistant' |'system';
  timestamp: Date;
}

export interface MessageSchemaV2 extends MessageSchemaV1 {
  metadata?: {
    crew?: string;
    endpoint?: string;
    executionTime?: number;
    model?: string;
    tokens?: {
      input: number;
      output: number;
    };
  };
}

export interface MessageSchemaV3 extends MessageSchemaV2 {
  attachments?: {
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string;
  }[];
  reactions?: {
    emoji: string;
    count: number;
  }[];
}

// Swappable message schemas for dev.
export type CurrentMessageSchema = MessageSchemaV1;
export type Message = CurrentMessageSchema;
