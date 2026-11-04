# Runs the PepBank MCP server over stdio. It forwards each request to https://pepbank.io/mcp.
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY bin ./bin
ENTRYPOINT ["node", "bin/pepbank.mjs"]
