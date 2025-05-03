const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rollname')
        .setDescription('Randomly picks a server member\'s username'),
    async execute(interaction) {
        const members = await interaction.guild.members.fetch();
        const onlineMembers = members.filter(m => !m.user.bot);

        const randomMember = onlineMembers.random();

        await interaction.reply(`🎲 The random pick is: **${randomMember.user.username}**!`);
    },
};
