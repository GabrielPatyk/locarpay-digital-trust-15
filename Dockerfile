FROM node:18-alpine

WORKDIR /app

# Primeiro copia apenas os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Constrói a aplicação
RUN npm run build

# Porta exposta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "preview"]
