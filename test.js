const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'], headless: true },
    ignoreSelf: false,
    allMessages: true
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escaneie o QR Code acima para conectar.');
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
