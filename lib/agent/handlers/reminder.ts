import { AgentHandler } from './base';
import { AgentInput, AgentResponse, IntentResult } from '../types';

export class ReminderHandler implements AgentHandler {
  async handle(input: AgentInput, intent: IntentResult): Promise<AgentResponse> {
    const content = intent.data?.content || '';

    // 判断是否包含时间信息（分钟/小时/明天/后天等）
    const hasTimeInfo = content.match(/\d+(分钟|小时|天)/) ||
                        content.includes("明天") ||
                        content.includes("后天") ||
                        content.includes("上午") ||
                        content.includes("下午") ||
                        content.includes("晚上");

    let response = "";

    if (content.includes("高铁") || content.includes("火车")) {
      if (hasTimeInfo) {
        if (content.includes("3小时") || content.includes("三小时")) {
          response = "还有3小时就高铁就发车了呢，时间挺充裕的！别忘了带好身份证和车票哦，我帮你记着时间，提前提醒你出发~";
        } else if (content.includes("分钟后") || content.includes("分钟")) {
          response = "哎呀，马上就要发车啦！快准备出发，别忘了带身份证和车票~";
        } else {
          response = `收到提醒：${content}，我会提前提醒你准备哦~`;
        }
      } else {
        response = "高铁要发车啦！现在该准备出发了哦，别忘了带身份证和车票~";
      }
    } else if (content.includes("开会") || content.includes("会议")) {
      if (hasTimeInfo) {
        if (content.includes("分钟后") || content.includes("分钟")) {
          response = "马上要开会啦！准备好了吗？别迟到哦~";
        } else {
          response = `收到提醒：${content}，我会提前叫你哦~`;
        }
      } else {
        response = "马上要开会啦！准备好了吗？别迟到哦~";
      }
    } else if (content.includes("接孩子") || content.includes("孩子")) {
      if (hasTimeInfo) {
        if (content.includes("分钟后") || content.includes("分钟")) {
          response = "时间差不多啦，该去接孩子了哦，路上小心~";
        } else {
          response = `收到提醒：${content}，到时提醒你哦~`;
        }
      } else {
        response = "该去接孩子了哦，路上小心~";
      }
    } else {
      // 通用提醒
      if (hasTimeInfo) {
        if (content.includes("分钟后") || content.includes("分钟")) {
          response = `提醒：${content}，该行动啦！`;
        } else {
          response = `收到提醒：${content}，我会帮你记着，到时提醒你哦~`;
        }
      } else {
        response = `提醒：${content}，该行动啦！`;
      }
    }

    return {
      response,
      timestamp: new Date()
    };
  }
}
