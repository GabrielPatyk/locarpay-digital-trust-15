# --- Estágio 1: Build da Aplicação ---
FROM node:18-alpine AS build
WORKDIR /app

# Copia os arquivos de manifesto
COPY package*.json ./

# Usa 'npm ci' que é mais rápido e confiável para builds
RUN npm ci

# Copia o resto do código
COPY . .

# Executa o build
RUN npm run build


# --- Estágio 2: Imagem Final de Produção ---
FROM node:18-alpine
WORKDIR /app

# Copia os arquivos de manifesto para instalar apenas as dependências de produção
COPY package*.json ./

# Instala apenas as dependências de produção (como o 'serve')
RUN npm ci --omit=dev

# AQUI ESTÁ A CORREÇÃO: Copia a pasta 'dist' gerada no estágio de build
COPY --from=build /app/dist ./dist

# Expõe a porta que o servidor vai usar
EXPOSE 3000

# Comando final para iniciar o servidor, servindo a pasta 'dist' na porta 3000
CMD [ "npx", "serve", "-s", "dist", "-l", "3000" ]
