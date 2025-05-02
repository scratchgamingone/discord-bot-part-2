// main.js - For Second Bot Setup
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events, REST, Routes } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();
const prefix = process.env.COMMAND_PREFIX?.trim() || '!';
const commands = [];

// Load commands from ./commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
}

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        console.log('🚀 Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Successfully registered slash commands.');
    } catch (error) {
        console.error('❌ Error registering slash commands:', error);
    }
})();

// Listen for interactions
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Error executing command ${interaction.commandName}:`, error);
        await interaction.reply({
            content: '❌ An error occurred while executing this command.',
            ephemeral: true
        }).catch(console.error);
    }
});

client.once('ready', () => {
    console.log(`✅ Bot logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);


// --- test.js in commands folder ---

// commands/test.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('🔧 Test command to confirm the bot is working.'),
    async execute(interaction) {
        await interaction.reply('✅ **Test successful!** The second bot is up and running.');
    }
};
