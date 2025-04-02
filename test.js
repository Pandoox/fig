const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000; // Porta dinâmica para Railway

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'], headless: true },
    ignoreSelf: false, // Garante que ele escute todas as mensagens, incluindo as do próprio bot
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

// Gerar e salvar o QR Code
client.on('qr', async (qr) => {
    console.log('🔄 Gerando QR Code...');
    const qrPath = path.join(__dirname, 'qrcode.png');
    await qrcode.toFile(qrPath, qr);
    console.log(`✅ QR Code salvo! Baixe em: https://seu-projeto.up.railway.app/qrcode`);
});

// Quando o bot estiver pronto
client.on('ready', () => {
    console.log('✅ Bot conectado e pronto para receber mensagens!');
});

// Escutar mensagens recebidas
client.on('message', async (msg) => {
    console.log(`📩 Mensagem recebida de ${msg.from}: ${msg.body}`);
    
    if (msg.body === '!ping') {
        msg.reply('🏓 Pong!');
    }

    if (msg.body === '!s' && msg.hasQuotedMsg) {
        try {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.hasMedia) {
                const media = await quotedMsg.downloadMedia();
                await client.sendMessage(msg.to, media, { sendMediaAsSticker: true });
                console.log(`✅ Sticker enviado no chat: ${msg.to}`);
            } else {
                msg.reply('❌ A mensagem marcada não contém mídia.');
            }
        } catch (error) {
            console.error('Erro ao processar o comando !s:', error);
            msg.reply('❌ Ocorreu um erro ao criar a figurinha.');
        }
    }
});

// Capturar mensagens enviadas pelo próprio bot
client.on('message_create', async (msg) => {
    console.log(`📤 Mensagem enviada para ${msg.to}: ${msg.body}`);
});

// Lidar com falhas de autenticação
client.on('auth_failure', (msg) => {
    console.error('❌ Falha na autenticação:', msg);
});

// Reconexão automática em caso de desconexão
client.on('disconnected', async (reason) => {
    console.log(`⚠ Bot desconectado: ${reason}`);
    setTimeout(() => {
        console.log('🔄 Tentando reconectar...');
        client.initialize();
    }, 5000);
});

// Iniciar servidor HTTP
app.listen(port, () => {
    console.log(`📂 Servidor rodando! Acesse: https://seu-projeto.up.railway.app/qrcode`);
});

// Inicializar o bot
client.initialize();
