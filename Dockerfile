# Estágio de construção
FROM node:18-alpine AS builder

WORKDIR /app

# Cache de dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copia o restante e faz o build
COPY . .
RUN npm run build

# Estágio de produção
FROM node:18-alpine

WORKDIR /app

# Copia apenas o necessário
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Porta exposta (Vite usa 3000 por padrão)
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "preview"]
