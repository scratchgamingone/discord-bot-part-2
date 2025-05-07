const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: 'av',
    description: 'Shows your avatar or someone else\'s avatar',
    execute(message, args) {
        // Get the mentioned user or default to the message author
        const user = message.mentions.users.first() || message.author;

        // Get the avatar URL
        const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });

        // Send the avatar in an embed
        message.channel.send({
            embeds: [{
                color: 0x0099ff,
                title: `${user.username}'s Avatar`,
                image: { url: avatarUrl },
                footer: { text: `Requested by ${message.author.tag}` }
            }]
        });
    }
};
