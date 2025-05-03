const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('player_count_in_game')
    .setDescription('Shows the current number of players in your Roblox game'),

  async execute(interaction) {
    const placeId = process.env.ROBLOX_GAME_ID;

    try {
      // Step 1: Get universe ID
      const universeRes = await axios.get(`https://apis.roproxy.com/universes/v1/places/${placeId}/universe`);
      const universeId = universeRes.data.universeId;

      // Step 2: Get player count from game data
      const gameRes = await axios.get(`https://games.roproxy.com/v1/games?universeIds=${universeId}`);
      const gameData = gameRes.data.data[0];
      const playerCount = gameData.playing;

      // Step 3: Prepare embed message
      const embed = new EmbedBuilder()
        .setTitle(`🎮 ${gameData.name}`)
        .setColor(0x5865F2);

      if (playerCount === 0) {
        embed.setDescription('🚫 No players are currently in-game.');
      } else {
        embed.setDescription(`✅ There are currently **${playerCount}** player(s) online.`);
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching Roblox player count:', error);
      await interaction.reply('❌ Could not retrieve player count at the moment.');
    }
  },
};
