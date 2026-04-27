import { Agent } from './agent';

let agentInstance: Agent | null = null;

export function getAgent(): Agent {
  if (!agentInstance) {
    agentInstance = new Agent();
  }
  return agentInstance;
}
