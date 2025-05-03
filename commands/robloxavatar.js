const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('RobloxAvatar')
        .setDescription('Shows your Discord avatar (linked with Bloxlink if connected).'),

    async execute(interaction) {
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('#0099ff')
            .setFooter({ text: 'Bloxlink linked avatars will reflect your Roblox profile!' });

        await interaction.reply({ embeds: [embed] });
    },
};
