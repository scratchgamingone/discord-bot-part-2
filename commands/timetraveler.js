const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timetraveler')
    .setDescription('Generates a fictional report from a specified year')
    .addIntegerOption(option =>
      option.setName('year')
        .setDescription('The year to generate a report for')
        .setRequired(true)
    ),

  async execute(interaction) {
    const year = interaction.options.getInteger('year');
    const currentYear = new Date().getFullYear();

    const pastEvents = [
      { year: 1969, event: 'Apollo 11 lands on the Moon.' },
      { year: 1989, event: 'Fall of the Berlin Wall.' },
      { year: 2000, event: 'Y2K bug fails to cause worldwide chaos.' },
      { year: 2012, event: 'Mayans were wrong; the world didn’t end.' },
      { year: 2020, event: 'Global pandemic changes the world.' },
    ];

    const futurePredictions = [
      'Humans establish the first colony on Mars.',
      'Artificial Intelligence becomes self-aware.',
      'Teleportation becomes a common mode of transport.',
      'Time travel is made possible for the public.',
      'Aliens make first contact with Earth.',
    ];

    let description = '';

    if (year < currentYear) {
      const event = pastEvents.find(e => e.year === year);
      if (event) {
        description = `📜 In ${year}, ${event.event}`;
      } else {
        description = `🔍 No significant records found for the year ${year}.`;
      }
    } else if (year === currentYear) {
      description = `🕰️ Welcome to the present year, ${year}! Make the most of it.`;
    } else {
      const prediction = futurePredictions[Math.floor(Math.random() * futurePredictions.length)];
      description = `🔮 In ${year}, ${prediction}`;
    }

    const embed = new EmbedBuilder()
      .setTitle('🕰️ Time Traveler Report')
      .setDescription(description)
      .setColor(0x00AE86)
      .setFooter({ text: 'This report is purely fictional.' });

    await interaction.reply({ embeds: [embed] });
  },
};
