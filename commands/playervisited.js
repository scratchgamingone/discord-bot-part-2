const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playervisited')
    .setDescription('Displays the total number of visits to your Roblox game'),

  async execute(interaction) {
    const placeId = process.env.ROBLOX_GAME_ID;

    try {
      // Step 1: Get universe ID
      const universeRes = await axios.get(`https://apis.roproxy.com/universes/v1/places/${placeId}/universe`);
      const universeId = universeRes.data.universeId;

      // Step 2: Get game data
      const gameRes = await axios.get(`https://games.roproxy.com/v1/games?universeIds=${universeId}`);
      const gameData = gameRes.data.data[0];
      const visitCount = gameData.visits;

      // Step 3: Prepare embed message
      const embed = new EmbedBuilder()
        .setTitle(`📊 ${gameData.name} - Total Visits`)
        .setColor(0x5865F2)
        .setDescription(`👥 This game has been visited **${visitCount.toLocaleString()}** times.`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching Roblox visit count:', error);
      await interaction.reply('❌ Could not retrieve visit count at the moment.');
    }
  },
};
