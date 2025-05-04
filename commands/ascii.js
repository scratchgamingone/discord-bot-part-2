const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ascii')
        .setDescription('Convert a number to its ASCII character')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('Enter a number to convert to ASCII')
                .setRequired(true)),
    async execute(interaction) {
        const number = interaction.options.getInteger('number');

        if (number < 0 || number > 127) {
            await interaction.reply('⚠️ Please enter a number between 0 and 127 (standard ASCII range).');
            return;
        }

        const asciiChar = String.fromCharCode(number);

        await interaction.reply(`✅ The ASCII character for **${number}** is: \`${asciiChar}\``);
    },
};
