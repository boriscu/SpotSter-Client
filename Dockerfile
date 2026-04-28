FROM node:18-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- Dev target: has source + node_modules, ready for vite dev server ---
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Build target: produces optimized static assets ---
FROM deps AS build
COPY . .
RUN npm run build

# --- Production target: serves static files ---
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve@14
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
