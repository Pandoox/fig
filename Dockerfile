# Usa a imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Instala as dependências do Puppeteer
RUN apt-get update && apt-get install -y \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libpango-1.0-0 \
  libasound2 \
  libpangocairo-1.0-0 \
  libgtk-3-0 \
  libx11-xcb1 \
  xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# Define a variável de ambiente para Puppeteer rodar sem problemas
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Expõe a porta (caso seu bot precise)
EXPOSE 3000

# Comando para iniciar o bot
CMD ["node", "test.js"]
