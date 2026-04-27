import { AgentHandler } from './base';
import { AgentInput, AgentResponse, IntentResult } from '../types';

export class TranslateHandler implements AgentHandler {
  async handle(input: AgentInput, intent: IntentResult): Promise<AgentResponse> {
    return {
      response: "翻译模式已开启，正在实时翻译外语对话...",
      action: "startTranslation",
      timestamp: new Date()
    };
  }
}
