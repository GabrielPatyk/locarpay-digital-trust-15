# --- Estágio 1: Build da Aplicação ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

# AQUI ESTÁ A CORREÇÃO: Removemos a flag --omit=dev
RUN npm install

COPY . .

RUN npm run build

# --- Estágio 2: Imagem Final de Produção ---
# Esta parte continua igual e garante uma imagem final pequena
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./dist
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
