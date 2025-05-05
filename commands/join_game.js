const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join_game')
        .setDescription('Show a button to join the linked Roblox game'),

    async execute(interaction) {
        try {
            const gameId = process.env.ROBLOX_GAME_ID;

            // Debug log to check if env loaded
            console.log('✅ ROBLOX_GAME_ID loaded:', gameId);

            if (!gameId) {
                await interaction.reply({ content: '❌ Roblox Game ID is not set in the .env file.', ephemeral: true });
                return;
            }

            const robloxLink = `https://www.roblox.com/games/${gameId}/join`;
            const robloxProtocolLink = `roblox://placeId=${gameId}`;

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Join in Browser')
                    .setStyle(ButtonStyle.Link)
                    .setURL(robloxLink),

                new ButtonBuilder()
                    .setLabel('Join in App')
                    .setStyle(ButtonStyle.Link)
                    .setURL(robloxProtocolLink)
            );

            await interaction.reply({
                content: '🎮 Click a button below to join the Roblox game:',
                components: [row],
                ephemeral: false
            });

        } catch (error) {
            console.error('❌ Error inside /join_game command:', error);

            // Check if a reply was already sent
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: '❌ There was an error while executing this command.',
                    ephemeral: true
                }).catch(console.error);
            } else {
                await interaction.reply({
                    content: '❌ There was an error while executing this command.',
                    ephemeral: true
                }).catch(console.error);
            }
        }
    },
};
