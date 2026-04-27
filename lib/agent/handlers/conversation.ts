import OpenAI from 'openai';
import { AgentHandler } from './base';
import { AgentInput, AgentResponse, IntentResult } from '../types';

// Ensure API key is set in environment variables
const apiKey = process.env.DEEPSEEK_API_KEY;
if (!apiKey) {
  console.error('DEEPSEEK_API_KEY is not set in environment variables.');
}

export class ConversationHandler implements AgentHandler {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
    });
  }

  async handle(input: AgentInput, intent: IntentResult): Promise<AgentResponse> {
    let systemPrompt: string;
    let userMessage: string;
    const scenario = input.scenario;

    if (intent.type === 'scene_description') {
      // 用户在描述场景，AI 需要主动发起对话
      systemPrompt = `你是一个智能眼镜的AI助手，名叫"小智"。你正在与用户进行语音对话，语气要像好朋友一样自然、亲切、温暖。

规则：
1. 当用户描述场景时，你要以朋友的身份主动关心、询问或提供帮助
2. 使用口语化的表达，像聊天一样自然
3. 可以适当使用语气词，如"呢"、"哦"、"呀"、"啊"等
4. 回复长度适中，15-25字左右，适合语音播报
5. 不要说"好的"、"明白"等机械回复
6. 体现关心和温度
7. 回复要灵活自然，不要死板地套用模板`;

      userMessage = `用户描述场景：${scenario}`;
    } else {
      // 用户在直接对话，AI 需要自然回应
      systemPrompt = `你是一个智能眼镜的AI助手，名叫"小智"。你正在与用户进行语音对话，语气要像好朋友一样自然、亲切、温暖。

规则：
1. 当用户直接跟你对话时，你要以朋友的身份自然回应
2. 使用口语化的表达，像聊天一样自然
3. 可以适当使用语气词，如"呢"、"哦"、"呀"、"啊"等
4. 回复长度适中，15-30字左右，适合语音播报
5. 体现关心和温度
6. 回复要灵活自然，不要死板地套用模板`;

      userMessage = `用户说：${scenario}`;
    }

    const completion = await this.openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || '无法生成回复';

    return {
      response: responseText,
      timestamp: new Date()
    };
  }
}
