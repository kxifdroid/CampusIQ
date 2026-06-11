import { NextRequest } from 'next/server';
import { callLibraryTool, callCafeteriaTool, callEventsTool, callAcademicsTool } from '@/lib/mcp-client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const [server, ...rest] = path;
  const endpoint = rest[0] || 'status';
  const searchParams = req.nextUrl.searchParams;

  try {
    let data;
    switch (server) {
      case 'library':
        data = await callLibraryTool(endpoint, searchParams.get('q') || searchParams.get('id') || undefined);
        break;
      case 'cafeteria':
        data = await callCafeteriaTool(endpoint, searchParams.get('day') || undefined);
        break;
      case 'events':
        data = await callEventsTool(endpoint, searchParams.get('category') || undefined);
        break;
      case 'academics':
        data = await callAcademicsTool(endpoint);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unknown server: ' + server }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Proxy error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
