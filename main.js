// main_second_bot.js - Run SECOND bot using shared codebase
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events, REST, Routes } = require('discord.js');
const fs = require('fs');

// === Setup SECOND bot ===
const clientSecond = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

clientSecond.commands = new Collection();
const prefixSecond = process.env.COMMAND_PREFIX?.trim() || '!';
const commandsSecond = [];

// Load commands for second bot
const generalCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of generalCommandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.execute) {
        clientSecond.commands.set(command.data.name, command);
        commandsSecond.push(command.data.toJSON());
    }
}

const adminCommandFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
for (const file of adminCommandFiles) {
    const command = require(`./commands/admin/${file}`);
    if (command.data && command.execute) {
        clientSecond.commands.set(command.data.name, command);
        commandsSecond.push(command.data.toJSON());
    }
}

const restSecond = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN_SECOND);
(async () => {
    try {
        console.log('🚀 Registering SECOND bot application (/) commands...');
        await restSecond.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID_SECOND, process.env.GUILD_ID),
            { body: commandsSecond }
        );
        console.log('✅ Successfully registered slash commands for SECOND bot.');
    } catch (error) {
        console.error('❌ Error registering slash commands for SECOND bot:', error);
    }
})();

clientSecond.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = clientSecond.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Error executing command ${interaction.commandName} (SECOND bot):`, error);
        await interaction.reply({
            content: '❌ An error occurred while executing this command.',
            ephemeral: true
        }).catch(console.error);
    }
});

clientSecond.once('ready', () => {
    console.log(`✅ SECOND bot logged in as ${clientSecond.user.tag}!`);
});

clientSecond.login(process.env.DISCORD_TOKEN_SECOND);
