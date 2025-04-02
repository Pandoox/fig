# Usa a imagem oficial do Node.js como base
FROM node:18

# Define o diretório de trabalho no container
WORKDIR /app

# Copia apenas os arquivos necessários primeiro (melhor para cache)
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta (ajuste conforme necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
