import { MOCK_LIBRARY_DATA, MOCK_CAFETERIA_DATA, MOCK_EVENTS_DATA, MOCK_ACADEMICS_DATA } from './mock-data';

const LIBRARY_URL = process.env.MCP_LIBRARY_URL || 'http://localhost:4001';
const CAFETERIA_URL = process.env.MCP_CAFETERIA_URL || 'http://localhost:4002';
const EVENTS_URL = process.env.MCP_EVENTS_URL || 'http://localhost:4003';
const ACADEMICS_URL = process.env.MCP_ACADEMICS_URL || 'http://localhost:4004';

async function fetchMCP(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`MCP error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`MCP fetch failed for ${url}:`, err);
    throw err; // Propagate error so callers can use fallbacks
  }
}

export async function callLibraryTool(endpoint: string, searchParam?: string) {
  try {
    switch (endpoint) {
      case 'search': {
        const q = encodeURIComponent(searchParam || '');
        return await fetchMCP(`${LIBRARY_URL}/search?q=${q}`);
      }
      case 'status':
        return await fetchMCP(`${LIBRARY_URL}/status`);
      case 'book':
        return await fetchMCP(`${LIBRARY_URL}/book/${searchParam || 1}`);
      default:
        return await fetchMCP(`${LIBRARY_URL}/status`);
    }
  } catch (e) {
    console.log(`Using mock data for library: ${endpoint}`);
    if (endpoint === 'search') {
      const q = (searchParam || '').toLowerCase();
      if (!q) return MOCK_LIBRARY_DATA.books;
      return MOCK_LIBRARY_DATA.books.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) ||
        b.subject.toLowerCase().includes(q)
      );
    }
    if (endpoint === 'book') {
      return MOCK_LIBRARY_DATA.books.find(b => b.id === Number(searchParam)) || MOCK_LIBRARY_DATA.books[0];
    }
    return MOCK_LIBRARY_DATA.status;
  }
}

export async function callCafeteriaTool(endpoint: string, day?: string) {
  try {
    switch (endpoint) {
      case 'menu':
        return day
          ? await fetchMCP(`${CAFETERIA_URL}/menu/${day}`)
          : await fetchMCP(`${CAFETERIA_URL}/menu`);
      case 'specials':
        return await fetchMCP(`${CAFETERIA_URL}/specials`);
      case 'timings':
        return await fetchMCP(`${CAFETERIA_URL}/timings`);
      default:
        return await fetchMCP(`${CAFETERIA_URL}/menu`);
    }
  } catch (e) {
    console.log(`Using mock data for cafeteria: ${endpoint}`);
    const d = (day || new Date().toLocaleString('en-US', { weekday: 'short' })).toLowerCase().slice(0, 3);
    const dayKey = MOCK_CAFETERIA_DATA[d] ? d : 'mon';
    if (endpoint === 'menu') return { day: dayKey, menu: MOCK_CAFETERIA_DATA[dayKey] };
    if (endpoint === 'specials') return MOCK_CAFETERIA_DATA.specials;
    return MOCK_CAFETERIA_DATA.timings;
  }
}

export async function callEventsTool(endpoint: string, category?: string) {
  try {
    switch (endpoint) {
      case 'events': {
        const url = category
          ? `${EVENTS_URL}/events?category=${category}`
          : `${EVENTS_URL}/events`;
        return await fetchMCP(url);
      }
      case 'today':
        return await fetchMCP(`${EVENTS_URL}/events/today`);
      case 'this-week':
        return await fetchMCP(`${EVENTS_URL}/events/this-week`);
      default:
        return await fetchMCP(`${EVENTS_URL}/events`);
    }
  } catch (e) {
    console.log(`Using mock data for events: ${endpoint}`);
    if (category) return MOCK_EVENTS_DATA.filter(ev => ev.category === category);
    return MOCK_EVENTS_DATA;
  }
}

export async function callAcademicsTool(endpoint: string) {
  try {
    switch (endpoint) {
      case 'schedule':
        return await fetchMCP(`${ACADEMICS_URL}/schedule`);
      case 'deadlines':
        return await fetchMCP(`${ACADEMICS_URL}/deadlines`);
      case 'holidays':
        return await fetchMCP(`${ACADEMICS_URL}/holidays`);
      case 'notices':
        return await fetchMCP(`${ACADEMICS_URL}/notices`);
      default:
        return await fetchMCP(`${ACADEMICS_URL}/notices`);
    }
  } catch (e) {
    console.log(`Using mock data for academics: ${endpoint}`);
    if (endpoint === 'schedule') return MOCK_ACADEMICS_DATA.schedule;
    if (endpoint === 'deadlines') return MOCK_ACADEMICS_DATA.deadlines;
    if (endpoint === 'notices') return MOCK_ACADEMICS_DATA.notices;
    return [];
  }
}

export type ToolName = 'search_library' | 'get_cafeteria_info' | 'get_campus_events' | 'get_academics_info';

export const SERVER_LABELS: Record<ToolName, { label: string; emoji: string }> = {
  search_library: { label: 'Library', emoji: '📚' },
  get_cafeteria_info: { label: 'Cafeteria', emoji: '🍽️' },
  get_campus_events: { label: 'Events', emoji: '🎉' },
  get_academics_info: { label: 'Academics', emoji: '📖' },
};

export async function callMCPServer(toolName: string, args: any) {
  switch (toolName) {
    case 'search_library':
      return callLibraryTool(args.endpoint, args.query);
    case 'get_cafeteria_info':
      return callCafeteriaTool(args.endpoint, args.query);
    case 'get_campus_events':
      return callEventsTool(args.endpoint, args.category);
    case 'get_academics_info':
      return callAcademicsTool(args.endpoint);
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}
