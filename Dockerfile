FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install  # Isso instala todas as dependências

COPY . .  # Copia o restante do código

EXPOSE 3000
CMD ["npm", "start"]
