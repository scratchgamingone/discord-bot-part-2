const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join_game')
        .setDescription('Show a button to join the linked Roblox game'),

    async execute(interaction) {
        const gameId = process.env.ROBLOX_GAME_ID;
        if (!gameId) {
            return interaction.reply({ content: '❌ Roblox Game ID is not set in the .env file.', ephemeral: true });
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
            content: '🎮 Click below to join the Roblox game:',
            components: [row],
            ephemeral: false
        });
    },
};
