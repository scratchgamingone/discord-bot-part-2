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

// Utility: Load commands safely from a folder
function loadCommandsFromFolder(folderPath) {
    if (!fs.existsSync(folderPath)) return;

    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of files) {
        try {
            const command = require(`${folderPath}/${file}`);
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
            } else {
                console.warn(`⚠️ Skipped ${file}: Missing data or execute.`);
            }
        } catch (error) {
            console.error(`❌ Error loading ${folderPath}/${file}:`, error);
        }
    }
}

// Load all command folders (ignore missing folders or errors)
loadCommandsFromFolder('./commands');
loadCommandsFromFolder('./commands/admin');
loadCommandsFromFolder('./commands/booster restriction');

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        console.log('🚀 Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash commands registered.');
    } catch (error) {
        console.error('❌ Failed to register slash commands:', error);
    }
})();

// Handle commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Error executing ${interaction.commandName}:`, error);
        await interaction.reply({
            content: '❌ There was an error while executing this command.',
            ephemeral: true
        }).catch(() => {});
    }
});

// Bot ready
client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} has been updated!`);
    const notifyChannelId = process.env.NOTIFY_BOT_ONLINE_CHANNEL_ID;
    const notifyRoles = process.env.NOTIFY_BOT_ONLINE_ROLES_ID?.split(',').map(id => `<@&${id.trim()}>`).join(' ') || '';

    if (notifyChannelId) {
        try {
            const channel = await client.channels.fetch(notifyChannelId);
            if (channel) {
                await channel.send(`${notifyRoles} ✅ ${client.user.tag} is now online!`);
            }
        } catch (err) {
            console.warn(`⚠️ Failed to send startup message:`, err);
        }
    }
});

// Handle errors
process.on('uncaughtException', err => console.error('🚨 Uncaught Exception:', err));
process.on('unhandledRejection', reason => console.error('🚨 Unhandled Rejection:', reason));

process.on('SIGINT', async () => {
    console.log("❌ Bot is shutting down...");
    const notifyChannelId = process.env.NOTIFY_BOT_ONLINE_CHANNEL_ID;
    const notifyRoles = process.env.NOTIFY_BOT_ONLINE_ROLES_ID?.split(',').map(id => `<@&${id.trim()}>`).join(' ') || '';
    try {
        const channel = await client.channels.fetch(notifyChannelId);
        if (channel) {
            await channel.send(`${notifyRoles} ❌ Bot is now offline.`);
        }
    } catch {}
    process.exit();
});

// Start the bot
client.login(process.env.DISCORD_TOKEN);
