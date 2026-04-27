export type IntentType = 'reminder' | 'record' | 'translate' | 'scene_description' | 'conversation';

export interface AgentInput {
  scenario: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface AgentResponse {
  response: string;
  action?: 'startTranslation' | 'startRecording' | 'stopRecording';
  timestamp: Date;
}

export interface IntentResult {
  type: IntentType;
  confidence: number;
  data?: Record<string, any>;
}
