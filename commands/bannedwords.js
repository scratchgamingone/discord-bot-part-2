const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
});

const bannedWords = ['nigga', 'fuck', 'gay']; // Edit this list easily!

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const messageContent = message.content.toLowerCase();

    if (bannedWords.some(word => messageContent.includes(word))) {
        try {
            await message.member.ban({
                reason: `Used banned word: ${message.content}`,
                deleteMessageSeconds: 60 * 60 * 24 // Optional: delete last 24h of their messages
            });
            console.log(`Banned ${message.author.tag} for saying a banned word.`);
        } catch (error) {
            console.error(`Failed to ban ${message.author.tag}:`, error);
        }
    }
});

client.login(process.env.TOKEN);
