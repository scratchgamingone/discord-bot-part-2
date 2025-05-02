// commands/test.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('🔧 Test command to confirm the bot is working.'),
    async execute(interaction) {
        await interaction.reply({
            content: '✅ **Test successful!** The second bot is up and running.',
            ephemeral: true // This makes the reply visible only to the user who ran the command
        });
    }
};
