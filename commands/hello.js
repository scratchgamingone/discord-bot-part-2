const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Replies with a friendly hello!'),
    async execute(interaction) {
        await interaction.reply('👋 Hello there! This is Discord Bot Part 2.');
    },
};
