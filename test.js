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

// Servir QR Code via HTTP
app.get('/qrcode', (req, res) => {
    const qrPath = path.join(__dirname, 'qrcode.png');
    if (fs.existsSync(qrPath)) {
        res.sendFile(qrPath);
    } else {
        res.status(404).send('QR Code ainda não foi gerado.');
    }
});

client.on('qr', async (qr) => {
    console.log('🔄 Gerando QR Code...');

    const qrPath = path.join(__dirname, 'qrcode.png');
    await qrcode.toFile(qrPath, qr);

    console.log(`✅ QR Code salvo! Baixe em: http://localhost:${port}/qrcode`);
});

client.on('ready', () => {
    console.log('✅ Bot está pronto!');
});

// Iniciar servidor HTTP APÓS a inicialização do bot
client.initialize().then(() => {
    app.listen(port, () => {
        console.log(`📂 Servidor rodando! Acesse: http://localhost:${port}/qrcode para baixar o QR Code.`);
    });
});
