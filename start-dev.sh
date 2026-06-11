#!/bin/bash
# CampusIQ — Start all MCP servers + Next.js dev server
echo "🚀 Starting CampusIQ..."

# Start all MCP servers in background
node mcp-servers/library/index.js &
echo "✅ Library MCP Server started (port 4001)"

node mcp-servers/cafeteria/index.js &
echo "✅ Cafeteria MCP Server started (port 4002)"

node mcp-servers/events/index.js &
echo "✅ Events MCP Server started (port 4003)"

node mcp-servers/academics/index.js &
echo "✅ Academics MCP Server started (port 4004)"

echo "🌐 Starting Next.js development server..."
npm run dev

# Cleanup on exit
trap "kill 0" EXIT
