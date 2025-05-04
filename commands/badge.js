const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('badge')
        .setDescription('Check how many badges you have earned in the Roblox game.'),

    async execute(interaction) {
        const robloxGameId = process.env.ROBLOX_GAME_ID;

        // Get linked Roblox user ID from Bloxlink
        const discordId = interaction.user.id;
        const bloxlinkApiUrl = `https://v3.blox.link/developer/discord/${discordId}`;

        await interaction.deferReply();

        try {
            const bloxlinkResponse = await fetch(bloxlinkApiUrl);
            if (!bloxlinkResponse.ok) throw new Error('Failed to contact Bloxlink API');

            const bloxlinkData = await bloxlinkResponse.json();

            if (!bloxlinkData || !bloxlinkData.user || !bloxlinkData.user.primaryAccount) {
                return interaction.editReply('❌ You don’t have a linked Roblox account with Bloxlink.');
            }

            const robloxUserId = bloxlinkData.user.primaryAccount;

            // Get badges earned by the user
            const badgeApiUrl = `https://inventory.roblox.com/v1/users/${robloxUserId}/items/Badge?assetType=Badge&gameId=${robloxGameId}`;
            const badgeResponse = await fetch(badgeApiUrl);
            if (!badgeResponse.ok) throw new Error('Failed to fetch badge data from Roblox');

            const badgeData = await badgeResponse.json();
            const badgeCount = badgeData.data ? badgeData.data.length : 0;

            await interaction.editReply(`🏅 **You have earned ${badgeCount} badge(s)** in the game!`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Something went wrong while fetching your badge count.');
        }
    },
};
