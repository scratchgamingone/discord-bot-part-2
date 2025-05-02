const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('picknumber')
        .setDescription('🎲 Picks a random number between 1 and 100'),
    async execute(interaction) {
        const number = Math.floor(Math.random() * 100) + 1;
        await interaction.reply(`🎲 Your random number is: **${number}**`);
    }
};
