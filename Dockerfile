FROM node:18

# Instala pacotes necessários para o Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon-x11-0 \
    libgbm-dev \
    libasound2 \
    libpangocairo-1.0-0 \
    libxcomposite1 \
    libxrandr2 \
    xdg-utils \
    libgtk-3-0 \
    --no-install-recommends

# Cria diretório da aplicação
WORKDIR /app

# Copia os arquivos do projeto para o container
COPY package*.json ./
RUN npm install

# Copia os demais arquivos
COPY . .

# Expõe a porta (se necessário)
EXPOSE 3000

# Comando para iniciar o app
CMD ["node", "test.js"]
