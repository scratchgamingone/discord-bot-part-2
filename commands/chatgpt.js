const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Chat with ChatGPT!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Your message to ChatGPT')
                .setRequired(true)),
    async execute(interaction) {
        const userMessage = interaction.options.getString('message');

        try {
            await interaction.deferReply();

            const response = await openai.createChatCompletion({
                model: 'gpt-4',
                messages: [{ role: 'user', content: userMessage }],
            });

            const botReply = response.data.choices[0].message.content.trim();

            if (botReply.length > 2000) {
                await interaction.editReply('❗ The response is too long to display.');
            } else {
                await interaction.editReply(`💬 **ChatGPT says:**\n${botReply}`);
            }
        } catch (error) {
            console.error('Error talking to ChatGPT:', error.response?.data || error.message);
            await interaction.editReply('❌ Sorry, something went wrong talking to ChatGPT.');
        }
    },
};
