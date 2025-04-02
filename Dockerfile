FROM node:18

WORKDIR /app

# Copia apenas os arquivos essenciais primeiro
COPY package.json package-lock.json ./

RUN npm install

# Agora copia o restante do código
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
