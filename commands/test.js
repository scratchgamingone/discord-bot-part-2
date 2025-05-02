const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const CLIENT_ID = process.env.CLIENT_ID;   // Your bot's client ID
const GUILD_ID = process.env.GUILD_ID;     // The server (guild) ID where you want to register the command

const commands = [
    new SlashCommandBuilder()
        .setName('test')
        .setDescription('🧪 Runs a test command')
        .toJSON()
];

// Register the slash command
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('⏳ Registering slash command...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash command registered!');
    } catch (error) {
        console.error('❌ Error registering command:', error);
    }
})();

// Handle the slash command interaction
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'test') {
        await interaction.reply('✅ Test command received!');
    }
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
