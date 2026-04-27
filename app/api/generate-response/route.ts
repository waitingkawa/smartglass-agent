import { NextRequest, NextResponse } from 'next/server';
import { getAgent } from '@/lib/agent';
import { AgentInput } from '@/lib/agent/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario } = body;

    if (!scenario) {
      return NextResponse.json({ error: 'Scenario is required' }, { status: 400 });
    }

    const input: AgentInput = { scenario };
    const agent = getAgent();
    const result = await agent.process(input);

    return NextResponse.json({
      response: result.response,
      action: result.action
    });

  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
