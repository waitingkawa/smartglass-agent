import { IntentResult } from './types';

export function detectIntent(scenario: string): IntentResult {
  // Matches (content)
  const reminderMatch = scenario.match(/^[\(（](.+)[\)）]$/);
  if (reminderMatch) {
    return { type: 'reminder', confidence: 1.0, data: { content: reminderMatch[1] } };
  }

  // Translation keywords
  if (
    scenario.includes('检测到外语对话') ||
    scenario.includes('开启翻译') ||
    scenario.includes('开始翻译') ||
    scenario.includes('翻译一下') ||
    scenario.includes('翻译模式')
  ) {
    return { type: 'translate', confidence: 1.0 };
  }

  // Recording keywords
  if (
    scenario.includes('记录现在的瞬间') ||
    scenario.includes('开始录像') ||
    scenario.includes('录下来') ||
    scenario.includes('拍视频') ||
    scenario.includes('录制')
  ) {
    return { type: 'record', confidence: 1.0 };
  }

  // Scene description keywords
  if (
    scenario.startsWith('当我现在') ||
    scenario.startsWith('现在我在') ||
    scenario.startsWith('现在正在') ||
    scenario.includes('场景是') ||
    scenario.includes('情况是')
  ) {
    return { type: 'scene_description', confidence: 0.9 };
  }

  // Default to conversation
  return { type: 'conversation', confidence: 0.8 };
}
