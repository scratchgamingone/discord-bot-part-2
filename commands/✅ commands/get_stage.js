const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_stage')
        .setDescription('Check which stage a Roblox player has completed.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Roblox username')
                .setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString('username');

        try {
            // Step 1: Get Roblox UserId
            const userRes = await axios.post(`https://users.roblox.com/v1/usernames/users`, {
                usernames: [username]
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (!userRes.data.data || userRes.data.data.length === 0) {
                return interaction.reply(`❌ Could not find Roblox user: **${username}**`);
            }

            const userId = userRes.data.data[0].id;

            // Step 2: Simulate pulling stage data (placeholder)
            const fakeStage = Math.floor(Math.random() * 10) + 1; // Example: random stage between 1–10

            await interaction.reply(`🎮 **${username}** (UserId: ${userId}) has completed **Stage ${fakeStage}**!`);
        } catch (error) {
            console.error(`❌ Error fetching Roblox data for ${username}:`, error);
            await interaction.reply('❌ An error occurred while fetching the player’s stage data.');
        }
    }
};
