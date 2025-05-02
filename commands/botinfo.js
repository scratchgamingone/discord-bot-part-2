const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('ℹ️ Shows information about this bot'),
    async execute(interaction) {
        await interaction.reply(`🤖 I am **${interaction.client.user.tag}** (ID: ${interaction.client.user.id}) and I’m here just for you!`);
    }
};
