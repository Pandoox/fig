# Usa a imagem do Node.js
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos do package.json primeiro (para aproveitar cache)
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia todos os arquivos do projeto para dentro do container
COPY . .

# Expõe a porta (caso seja um servidor web)
EXPOSE 3000

# Define o comando de inicialização
CMD ["npm", "start"]
