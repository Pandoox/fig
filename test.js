const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'], headless: true },
    ignoreSelf: false,
    allMessages: true
});

client.on('qr', async (qr) => {
    console.log('🔄 Gerando QR Code...');

    // Caminho para salvar a imagem do QR Code
    const qrPath = './qrcode.png';
    await qrcode.toFile(qrPath, qr);

    console.log('📤 Enviando QR Code para seu número no WhatsApp...');

    const yourNumber = '5511999999999@c.us'; // Substitua pelo seu número no formato internacional
    const media = MessageMedia.fromFilePath(qrPath);

    client.on('ready', async () => {
        try {
            await client.sendMessage(yourNumber, media);
            console.log('✅ QR Code enviado para seu número!');
        } catch (err) {
            console.error('❌ Erro ao enviar QR Code:', err);
        }
    });
});

client.on('ready', () => {
    console.log('✅ Bot está pronto!');
});

const handleStickerCommand = async (msg) => {
    console.log(`(Mensagem capturada) ${msg.from}: ${msg.body}`);

    if (msg.body === '!s' && msg.hasQuotedMsg) {
        try {
            const quotedMsg = await msg.getQuotedMessage();
            if (quotedMsg.hasMedia) {
                const media = await quotedMsg.downloadMedia();
                await client.sendMessage(msg.to, media, { sendMediaAsSticker: true }); // Envia no mesmo chat
                console.log(`✅ Sticker enviado no chat: ${msg.to}`);
            } else {
                msg.reply('❌ A mensagem marcada não contém mídia.');
            }
        } catch (error) {
            console.error('Erro ao processar o comando !s:', error);
            msg.reply('❌ Ocorreu um erro ao criar a figurinha.');
        }
    }
};

// Captura mensagens recebidas
client.on('message', async (msg) => {
    await handleStickerCommand(msg);
});

// Captura mensagens enviadas pelo próprio bot ou pelo dono
client.on('message_create', async (msg) => {
    await handleStickerCommand(msg);
});

client.initialize();
