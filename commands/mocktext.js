const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mocktext')
        .setDescription('Returns your text in mocking sPoNgEbOb style')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('The text you want to mock')
                .setRequired(true)),
    async execute(interaction) {
        const inputText = interaction.options.getString('input');
        let mocked = '';

        for (let i = 0; i < inputText.length; i++) {
            mocked += i % 2 === 0
                ? inputText[i].toLowerCase()
                : inputText[i].toUpperCase();
        }

        await interaction.reply(mocked);
    },
};
