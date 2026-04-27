import { AgentInput, AgentResponse, IntentResult, IntentType } from './types';
import { detectIntent } from './intent-detector';
import { AgentHandler } from './handlers/base';
import { ReminderHandler } from './handlers/reminder';
import { RecordHandler } from './handlers/record';
import { TranslateHandler } from './handlers/translate';
import { ConversationHandler } from './handlers/conversation';

export class Agent {
  private handlers: Map<IntentType, AgentHandler>;

  constructor() {
    this.handlers = new Map();
    // Initialize handlers
    this.registerHandler('reminder', new ReminderHandler());
    this.registerHandler('record', new RecordHandler());
    this.registerHandler('translate', new TranslateHandler());
    this.registerHandler('scene_description', new ConversationHandler());
    this.registerHandler('conversation', new ConversationHandler());
  }

  registerHandler(type: IntentType, handler: AgentHandler) {
    this.handlers.set(type, handler);
  }

  async process(input: AgentInput): Promise<AgentResponse> {
    // 1. Detect Intent
    const intent = detectIntent(input.scenario);

    // 2. Find Handler
    const handler = this.handlers.get(intent.type);

    // 3. Execute Handler
    if (handler) {
      return handler.handle(input, intent);
    }

    // Fallback for unknown intents
    return {
      response: "抱歉，我还没学会处理这个请求呢。",
      timestamp: new Date()
    };
  }
}
