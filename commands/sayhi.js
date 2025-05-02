const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sayhi')
        .setDescription('👋 Sends a random greeting!'),
    async execute(interaction) {
        const greetings = ['Hello!', 'Hi there!', 'Hey!', 'What’s up?', 'Greetings!'];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        await interaction.reply(randomGreeting);
    }
};
