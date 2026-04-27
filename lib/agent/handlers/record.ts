import { AgentHandler } from './base';
import { AgentInput, AgentResponse, IntentResult } from '../types';

export class RecordHandler implements AgentHandler {
  async handle(input: AgentInput, intent: IntentResult): Promise<AgentResponse> {
    return {
      response: "好的，已经开始录像啦！记录下这个美好的瞬间~",
      action: "startRecording",
      timestamp: new Date()
    };
  }
}
