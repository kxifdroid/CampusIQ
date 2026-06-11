import { SchemaType, FunctionDeclaration } from "@google/generative-ai";

export const geminiTools: FunctionDeclaration[] = [
  {
    name: "search_library",
    description: "Search for books, check availability, get library hours and seat availability",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: "Search query or question about library" },
        endpoint: { type: SchemaType.STRING, description: "One of: search, status, book" }
      },
      required: ["query", "endpoint"]
    }
  },
  {
    name: "get_cafeteria_info",
    description: "Get today's menu, meal timings, weekly specials, food available at cafeteria",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: "Query about cafeteria" },
        endpoint: { type: SchemaType.STRING, description: "One of: menu, specials, timings" }
      },
      required: ["query", "endpoint"]
    }
  },
  {
    name: "get_campus_events",
    description: "Get upcoming campus events, workshops, fests, club activities",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: "Query about events" },
        endpoint: { type: SchemaType.STRING, description: "One of: events, today, this-week" },
        category: { type: SchemaType.STRING, description: "Optional event category filter" }
      },
      required: ["query", "endpoint"]
    }
  },
  {
    name: "get_academics_info",
    description: "Get class schedule, assignment deadlines, holidays, academic notices",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: "Query about academics" },
        endpoint: { type: SchemaType.STRING, description: "One of: schedule, deadlines, holidays, notices" }
      },
      required: ["query", "endpoint"]
    }
  }
];

