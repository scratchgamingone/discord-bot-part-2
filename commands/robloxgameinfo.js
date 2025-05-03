const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('robloxgameinfo')
        .setDescription('Fetches information about the configured Roblox game.'),

    async execute(interaction) {
        const gameId = process.env.ROBLOX_GAME_ID;

        try {
            const response = await axios.get(`https://games.roblox.com/v1/games?universeIds=${gameId}`);
            const gameData = response.data.data[0];

            if (!gameData) {
                return interaction.reply({
                    content: '❌ Could not find game data. Please check the ROBLOX_GAME_ID.',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setTitle(gameData.name)
                .setDescription(gameData.description || 'No description provided.')
                .setURL(`https://www.roblox.com/games/${gameId}`)
                .addFields(
                    { name: '👥 Players', value: `${gameData.playing}`, inline: true },
                    { name: '⭐ Favorites', value: `${gameData.favoritedCount}`, inline: true },
                    { name: '👍 Likes', value: `${gameData.likes}`, inline: true },
                    { name: '👎 Dislikes', value: `${gameData.dislikes}`, inline: true },
                    { name: '💾 Visits', value: `${gameData.visits}`, inline: true },
                    { name: '⏱️ Created', value: new Date(gameData.created).toLocaleDateString(), inline: true }
                )
                .setThumbnail(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${gameId}&size=512x512&format=Png&isCircular=false`)
                .setColor(0x00AAFF);

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Error fetching Roblox game info:', error);
            await interaction.reply({
                content: '❌ There was an error fetching the Roblox game information.',
                ephemeral: true
            });
        }
    },
};
