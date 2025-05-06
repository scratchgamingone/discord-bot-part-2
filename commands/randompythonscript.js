const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    name: 'randompythonscript',
    description: 'Generate a random Python script using GPT-4',
    async execute(interaction) {
        const prompt = "Generate a short random Python script, max 20 lines, that does something fun.";
        const response = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        });
        const script = response.data.choices[0].message.content;
        await interaction.reply(`Here’s your random Python script:\n\`\`\`python\n${script}\n\`\`\``);
    },
};
