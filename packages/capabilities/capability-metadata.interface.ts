export interface CapabilityMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  tags: string[];
  aiBridge: {
    enabled: boolean;
    provider: 'ollama' | 'openai' | 'anthropic';
    model: string;
    temperature?: number;
  };
  endpoints?: {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    description: string;
  }[];
}
