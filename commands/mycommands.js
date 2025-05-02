const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mycommands')
        .setDescription('📋 Show how many commands are available and list them!'),
    async execute(interaction) {
        const allCommands = interaction.client.commands;

        const commandNames = allCommands.map(cmd => `• /${cmd.data.name}`).join('\n');
        const totalCount = allCommands.size;

        const replyMessage = `✅ **Total Commands Available:** ${totalCount}\n\n**Here’s what you can use:**\n${commandNames}`;

        await interaction.reply(replyMessage);
    }
};
