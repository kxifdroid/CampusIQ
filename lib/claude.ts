import Anthropic from '@anthropic-ai/sdk';
import { anthropicTools } from './tools';
import {
  callLibraryTool,
  callCafeteriaTool,
  callEventsTool,
  callAcademicsTool,
  ToolName,
  SERVER_LABELS
} from './mcp-client';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type StreamChunk =
  | { type: 'text'; content: string }
  | { type: 'servers'; servers: Array<{ label: string; emoji: string }> }
  | { type: 'error'; message: string };

// Process a single tool call by routing to the right MCP server
async function processTool(
  toolName: string,
  toolInput: Record<string, string>
): Promise<unknown> {
  switch (toolName) {
    case 'search_library':
      return callLibraryTool(toolInput.endpoint, toolInput.searchParam);
    case 'get_cafeteria_info':
      return callCafeteriaTool(toolInput.endpoint, toolInput.day);
    case 'get_campus_events':
      return callEventsTool(toolInput.endpoint, toolInput.category);
    case 'get_academics_info':
      return callAcademicsTool(toolInput.endpoint);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

export async function streamChatResponse(
  messages: ChatMessage[],
  onChunk: (chunk: StreamChunk) => void
): Promise<void> {
  const systemPrompt = `You are CampusIQ, an intelligent AI assistant for IIT Roorkee students.
You have access to real-time data from 4 campus systems:
- 📚 Library: book search, availability, library hours, seat count
- 🍽️ Cafeteria: today's menu, meal timings, weekly specials
- 🎉 Events: upcoming events, workshops, fests, sports matches
- 📖 Academics: class schedule, assignment deadlines, holidays, official notices

Always use the appropriate tool(s) to fetch live data before answering. Be concise, friendly, and helpful.
Format your responses clearly using markdown. If data is unavailable (tool error), say so gracefully.
Do NOT make up data — always use tools to get current information.`;

  const anthropicMessages: Anthropic.MessageParam[] = messages.map(m => ({
    role: m.role,
    content: m.content,
  }));

  // First call to Claude — may trigger tool use
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system: systemPrompt,
    tools: anthropicTools,
    messages: anthropicMessages,
  });

  // If Claude decided to use tools
  if (response.stop_reason === 'tool_use') {
    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
    );

    // Track which servers were used
    const usedServers = toolUseBlocks
      .map(tb => SERVER_LABELS[tb.name as ToolName])
      .filter(Boolean);

    // Notify frontend which servers were queried
    onChunk({ type: 'servers', servers: usedServers });

    // Execute all tool calls in parallel
    const toolResults = await Promise.all(
      toolUseBlocks.map(async (tb) => {
        const result = await processTool(tb.name, tb.input as Record<string, string>);
        return {
          type: 'tool_result' as const,
          tool_use_id: tb.id,
          content: JSON.stringify(result),
        };
      })
    );

    // Second call to Claude with tool results
    const finalMessages: Anthropic.MessageParam[] = [
      ...anthropicMessages,
      { role: 'assistant', content: response.content },
      { role: 'user', content: toolResults },
    ];

    const finalResponse = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      system: systemPrompt,
      tools: anthropicTools,
      messages: finalMessages,
    });

    // Stream the final text response
    for (const block of finalResponse.content) {
      if (block.type === 'text') {
        // Simulate streaming by chunking the text
        const words = block.text.split(' ');
        for (let i = 0; i < words.length; i += 5) {
          const chunk = words.slice(i, i + 5).join(' ') + ' ';
          onChunk({ type: 'text', content: chunk });
          await new Promise(r => setTimeout(r, 10));
        }
      }
    }
  } else {
    // No tools needed — stream text directly
    for (const block of response.content) {
      if (block.type === 'text') {
        const words = block.text.split(' ');
        for (let i = 0; i < words.length; i += 5) {
          const chunk = words.slice(i, i + 5).join(' ') + ' ';
          onChunk({ type: 'text', content: chunk });
          await new Promise(r => setTimeout(r, 10));
        }
      }
    }
  }
}
