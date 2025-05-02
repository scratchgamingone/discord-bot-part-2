// main.js - Modified for Second Bot on Separate Railway Project
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events, REST, Routes, ChannelType, PermissionsBitField } = require('discord.js');
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

// Load General Commands
const generalCommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of generalCommandFiles) {
    try {
        const command = require(`./commands/${file}`);
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    } catch (error) {
        console.error(`❌ Error loading command ${file}:`, error);
    }
}

// Load Admin Commands
const adminCommandFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
for (const file of adminCommandFiles) {
    try {
        const command = require(`./commands/admin/${file}`);
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    } catch (error) {
        console.error(`❌ Error loading admin command ${file}:`, error);
    }
}

// Load Booster-Restricted Commands
const boosterCommandFiles = fs.readdirSync('./commands/booster restriction').filter(file => file.endsWith('.js'));
for (const file of boosterCommandFiles) {
    try {
        const command = require(`./commands/booster restriction/${file}`);
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            command.boosterOnly = true;
        }
    } catch (error) {
        console.error(`❌ Error loading booster command ${file}:`, error);
    }
}

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        console.log('🚀 Registering SECOND BOT application (/) commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Successfully registered slash commands for SECOND BOT.');
    } catch (error) {
        console.error('❌ Error registering slash commands for SECOND BOT:', error);
    }
})();

// Handle command execution with channel restriction
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const allowedRoles = (process.env.BYPASS_COMMAND_RESTRICTION || '').split(',').map(id => id.trim());
    const requiredChannelId = process.env.REQUIRED_COMMAND_CHANNEL_ID;
    const guessChannelId = process.env.GUESS_CHANNEL_ID;
    const boosterRoleId = process.env.BOOSTER_ROLE_ID;
    const member = interaction.member;

    const hasBypassRole = member.roles.cache.some(role => allowedRoles.includes(role.id));
    const isGuessRangeCommand = interaction.commandName === 'guessrange';

    if (isGuessRangeCommand && interaction.channelId !== guessChannelId) {
        return interaction.reply({
            content: `❌ You can only use this command in <#${guessChannelId}>.`,
            ephemeral: true
        });
    }

    if (command.boosterOnly && !member.roles.cache.has(boosterRoleId)) {
        return interaction.reply({
            content: '🚫 This command is restricted to server boosters only.',
            ephemeral: true
        });
    }

    if (!isGuessRangeCommand && !hasBypassRole && interaction.channelId !== requiredChannelId) {
        return interaction.reply({
            content: `❌ You can only use commands in <#${requiredChannelId}>.`,
            ephemeral: true
        });
    }

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

client.once('ready', async () => {
    console.log(`✅ SECOND BOT logged in as ${client.user.tag}!`);

    const notifyChannelId = process.env.NOTIFY_BOT_ONLINE_CHANNEL_ID;
    const notifyRoles = process.env.NOTIFY_BOT_ONLINE_ROLES_ID?.split(',').map(id => `<@&${id.trim()}>`).join(' ') || '';

    if (notifyChannelId) {
        try {
            const channel = await client.channels.fetch(notifyChannelId);
            if (channel) {
                await channel.send(`${notifyRoles} 🚀 The second bot has been updated and is online!`);
            } else {
                console.warn(`⚠️ Notify channel ID ${notifyChannelId} not found.`);
            }
        } catch (error) {
            console.warn(`⚠️ Could not fetch notify channel (${notifyChannelId}):`, error);
        }
    }
});

process.on('uncaughtException', (err) => {
    console.error('🚨 Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Promise Rejection:', reason);
});

process.on('SIGINT', async () => {
    console.log('❌ SECOND BOT is shutting down...');

    const notifyChannelId = process.env.NOTIFY_BOT_ONLINE_CHANNEL_ID;
    const notifyRoles = process.env.NOTIFY_BOT_ONLINE_ROLES_ID?.split(',').map(id => `<@&${id.trim()}>`).join(' ') || '';

    if (notifyChannelId) {
        try {
            const channel = await client.channels.fetch(notifyChannelId);
            if (channel) {
                await channel.send(`${notifyRoles} ❌ The second bot is now offline.`);
            }
        } catch (error) {
            console.warn(`⚠️ Could not fetch notify channel (${notifyChannelId}) during shutdown:`, error);
        }
    }

    process.exit();
});

client.login(process.env.DISCORD_TOKEN);
