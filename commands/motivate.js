const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('motivate')
        .setDescription('🌟 Get a random motivational quote from the web!'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://zenquotes.io/api/random');
            const quoteData = response.data[0];
            const quote = `💬 "${quoteData.q}" — *${quoteData.a}*`;

            await interaction.reply(quote);
        } catch (error) {
            console.error('❌ Error fetching quote:', error);
            await interaction.reply('⚠️ Sorry, I could not fetch a motivational quote right now.');
        }
    }
};
