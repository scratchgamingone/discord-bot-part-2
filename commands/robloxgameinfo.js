const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('robloxgameinfo')
        .setDescription('Fetches information about the configured Roblox game.'),

    async execute(interaction) {
        const placeId = process.env.ROBLOX_GAME_ID;

        try {
            const response = await axios.get(`https://games.roblox.com/v1/places/${placeId}`);
            console.log('✅ Raw API response:', response.data);  // <-- Add this log

            if (response.data.errors) {
                console.error('❌ API returned error:', response.data.errors);
                return interaction.reply({
                    content: '❌ Roblox API returned an error: ' + response.data.errors[0]?.message,
                    ephemeral: true
                });
            }

            const gameData = response.data;

            const thumbResponse = await axios.get(`https://thumbnails.roblox.com/v1/places/thumbnails?placeIds=${placeId}&size=512x512&format=Png&isCircular=false`);
            const thumbnailUrl = thumbResponse.data.data[0]?.imageUrl || '';

            const embed = new EmbedBuilder()
                .setTitle(gameData.name)
                .setDescription(gameData.description || 'No description provided.')
                .setURL(`https://www.roblox.com/games/${placeId}`)
                .addFields(
                    { name: '👥 Max Players', value: `${gameData.maxPlayers}`, inline: true },
                    { name: '⏱️ Created', value: new Date(gameData.created).toLocaleDateString(), inline: true },
                    { name: '🛠️ Updated', value: new Date(gameData.updated).toLocaleDateString(), inline: true }
                )
                .setThumbnail(thumbnailUrl)
                .setColor(0x00AAFF);

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Error fetching Roblox game info (axios error):', error);
            await interaction.reply({
                content: '❌ There was an error fetching the Roblox game information.',
                ephemeral: true
            });
        }
    },
};
