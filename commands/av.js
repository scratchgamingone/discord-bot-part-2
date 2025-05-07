module.exports = {
    name: 'av',
    description: 'Shows your avatar or someone else\'s avatar',
    execute(message, args) {
        // Check if the message is exactly !av or starts with !av + mention
        if (message.content.startsWith('!av')) {
            const user = message.mentions.users.first() || message.author;
            const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });

            const { EmbedBuilder } = require('discord.js');
            const embed = new EmbedBuilder()
                .setTitle(`@${user.username}`)
                .setImage(avatarUrl)
                .setColor(0xff0000)
                .setFooter({ text: `Requested by ${message.author.tag}` });

            message.channel.send({ embeds: [embed] });
        }
    }
};
