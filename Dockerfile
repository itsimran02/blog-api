FROM node:22-alpine AS base

# 2️⃣ Set working directory inside the container
WORKDIR /usr/src/app

# 3️⃣ Copy package files first (for better caching)
COPY package*.json ./


# 4️⃣ Install dependencies
RUN npm install --production

# 5️⃣ Copy rest of the project files
COPY . .

# 6️⃣ Build the TypeScript code (compile -> dist/)
RUN npm run build
# 7️⃣ Expose API port (same as your server listens)
EXPOSE 3000


# 8️⃣ Command to start your app
CMD ["node", "dist/server.js"]
