const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spacefact')
        .setDescription('🚀 Get today’s Astronomy Picture of the Day (APOD) with a cool space fact!'),
    async execute(interaction) {
        try {
            const apiKey = process.env.NASA_API_KEY;
            const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`🌌 ${data.title}`)
                .setDescription(data.explanation.length > 1000 ? data.explanation.substring(0, 1000) + '...' : data.explanation)
                .setImage(data.url)
                .setFooter({ text: `Date: ${data.date}` });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('❌ Error fetching space fact:', error);
            await interaction.reply({ content: '❌ Sorry, I couldn’t fetch the space fact right now.', ephemeral: true });
        }
    },
};
