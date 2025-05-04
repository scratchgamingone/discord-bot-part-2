const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unicodeemojiroll')
        .setDescription('Rolls 3 fully random Unicode emojis for you!'),
    async execute(interaction) {
        // Unicode emoji ranges (basic)
        const ranges = [
            [0x1F600, 0x1F64F], // Emoticons
            [0x1F300, 0x1F5FF], // Misc Symbols and Pictographs
            [0x1F680, 0x1F6FF], // Transport and Map
            [0x2600, 0x26FF],   // Misc symbols
            [0x2700, 0x27BF],   // Dingbats
            [0x1F900, 0x1F9FF], // Supplemental Symbols and Pictographs
        ];

        const getRandomEmoji = () => {
            const [start, end] = ranges[Math.floor(Math.random() * ranges.length)];
            const codePoint = Math.floor(Math.random() * (end - start + 1)) + start;
            return String.fromCodePoint(codePoint);
        };

        const emoji1 = getRandomEmoji();
        const emoji2 = getRandomEmoji();
        const emoji3 = getRandomEmoji();

        await interaction.reply(`🎰 You spun: ${emoji1} ${emoji2} ${emoji3}`);
    },
};
