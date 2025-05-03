const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('randommeme')
        .setDescription('Sends a random meme from the internet'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://meme-api.com/gimme');
            const meme = response.data;

            await interaction.reply({
                content: `${meme.title}\n${meme.url}`,
                ephemeral: false
            });
        } catch (error) {
            console.error('Error fetching meme:', error);
            await interaction.reply('😞 Sorry, I couldn\'t fetch a meme right now.');
        }
    },
};
