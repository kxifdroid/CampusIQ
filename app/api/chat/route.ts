import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { geminiTools } from "@/lib/tools";
import { callMCPServer } from "@/lib/mcp-client";
import { authOptions } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await req.json();
  const userMessage = messages[messages.length - 1].content;
  const history = messages.slice(0, -1).map((m: any) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ functionDeclarations: geminiTools }],
  });

  const chat = model.startChat({ history });
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Initial call to Gemini
        let result = await chat.sendMessage(userMessage);
        let response = result.response;
        const functionCalls = response.functionCalls();

        if (functionCalls && functionCalls.length > 0) {
          // Notify UI about servers being queried
          const toolNames = functionCalls.map(c => c.name);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'servers', servers: toolNames.map(name => ({ label: name.replace(/_/g, ' '), emoji: '🔍' })) })}\n\n`));

          // Run tool calls in parallel
          const toolResults = await Promise.all(
            functionCalls.map(async (call) => {
              const mcpData = await callMCPServer(call.name, call.args as any);
              return {
                functionResponse: {
                  name: call.name,
                  response: { result: mcpData }
                }
              };
            })
          );

          // Stream final response
          const finalResult = await chat.sendMessageStream(toolResults as any);
          for await (const chunk of finalResult.stream) {
            const chunkText = chunk.text();
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: chunkText })}\n\n`));
          }
        } else {
          // No tools - stream direct response (re-running as stream for consistency)
          // Since we already got 'result' from non-streaming sendMessage, we can just send it if it's text
          // But to be clean with streaming, we'll re-do it or just send what we have in chunks
          const text = response.text();
          const words = text.split(' ');
          for (let i = 0; i < words.length; i += 5) {
            const chunk = words.slice(i, i + 5).join(' ') + ' ';
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`));
            await new Promise(r => setTimeout(r, 20));
          }
        }

        controller.enqueue(encoder.encode('data: {"type":"done"}\n\n'));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'AI Error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
