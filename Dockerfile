# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /app

# Copia apenas os arquivos essenciais primeiro (para otimizar cache)
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia todos os arquivos do projeto
COPY . . 

# Comando de inicialização
CMD ["npm", "start"]
