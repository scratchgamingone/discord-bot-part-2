const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');  // Use this if on Node <18
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badge')
        .setDescription('Check how many Roblox badges you have earned in this game (linked via Bloxlink).'),

    async execute(interaction) {
        const robloxGameId = process.env.ROBLOX_GAME_ID;
        const discordId = interaction.user.id;

        await interaction.deferReply();

        try {
            // Step 1: Get linked Roblox user ID from Bloxlink
            const bloxlinkApiUrl = `https://v3.blox.link/developer/discord/${discordId}`;
            const bloxlinkResponse = await fetch(bloxlinkApiUrl);

            if (!bloxlinkResponse.ok) {
                console.error('Bloxlink API failed:', bloxlinkResponse.status);
                return interaction.editReply('❌ Failed to contact Bloxlink API.');
            }

            const bloxlinkData = await bloxlinkResponse.json();

            if (!bloxlinkData.user || !bloxlinkData.user.primaryAccount) {
                return interaction.editReply('❌ You do not have a linked Roblox account through Bloxlink.');
            }

            const robloxUserId = bloxlinkData.user.primaryAccount;

            // Step 2: Get user’s badge inventory
            const badgeApiUrl = `https://inventory.roblox.com/v1/users/${robloxUserId}/items/Badge?limit=100`;
            const badgeResponse = await fetch(badgeApiUrl);

            if (!badgeResponse.ok) {
                console.error('Roblox API failed:', badgeResponse.status);
                return interaction.editReply('❌ Failed to fetch badge data from Roblox.');
            }

            const badgeData = await badgeResponse.json();
            const allBadges = badgeData.data || [];

            // Step 3: Filter badges by gameId (optional, depending on API support)
            const badgesInGame = allBadges.filter(badge => badge.assetId && badge.creatorTargetId == robloxGameId);

            await interaction.editReply(`🏅 You have earned **${badgesInGame.length} badge(s)** in this game!`);
        } catch (error) {
            console.error('Error in /badge command:', error);
            await interaction.editReply('❌ Something went wrong while fetching your badge count.');
        }
    },
};
