const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = 3000;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'], headless: true },
    ignoreSelf: false,
    allMessages: true
});

// Servir QR Code via HTTP para download
app.use('/qrcode', express.static(path.join(__dirname, 'qrcode.png')));

client.on('qr', async (qr) => {
    console.log('🔄 Gerando QR Code...');

    const qrPath = path.join(__dirname, 'qrcode.png');
    await qrcode.toFile(qrPath, qr);

    console.log(`✅ QR Code salvo! Baixe em: http://localhost:${port}/qrcode`);
});

client.on('ready', () => {
    console.log('✅ Bot está pronto!');
});

// Iniciar servidor HTTP
app.listen(port, () => {
    console.log(`📂 Servidor rodando! Acesse: http://localhost:${port}/qrcode para baixar o QR Code.`);
});

client.initialize();
