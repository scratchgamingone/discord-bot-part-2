const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remindme')
        .setDescription('Set a reminder.')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time (e.g., 10m, 1h)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('What should I remind you about?')
                .setRequired(true)),
    async execute(interaction) {
        const timeInput = interaction.options.getString('time');
        const message = interaction.options.getString('message');

        const timeMs = parseTimeToMs(timeInput);
        if (!timeMs) {
            return interaction.reply('❌ Invalid time format. Use something like 10m, 1h, 2d.');
        }

        interaction.reply(`⏰ Okay! I will remind you in ${timeInput}.`);

        setTimeout(() => {
            interaction.user.send(`⏰ Reminder: ${message}`);
        }, timeMs);
    },
};

function parseTimeToMs(input) {
    const match = input.match(/^(\d+)(s|m|h|d)$/);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return null;
    }
}
