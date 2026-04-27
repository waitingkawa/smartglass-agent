import { AgentInput, AgentResponse, IntentResult } from '../types';

export interface AgentHandler {
  handle(input: AgentInput, intent: IntentResult): Promise<AgentResponse>;
}
