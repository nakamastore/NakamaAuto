const { EmbedBuilder } = require('discord.js');
const User = require('../models/user');// Import your User model (adjust the path as needed);
const { prefix, verif, thankyou, megaphone, no, warning, wl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require('../config.json');

module.exports = {
  name: 'info',
  description: 'Get your GrowID and balance information',
  async execute(message, args) {
    if (!message.guild) {
      return message.reply('This command can only be used in a guild.');
    }

    try {
      // Check if the user exists in the database
      const discordId = message.author.id;
      const user = await User.findOne({ discordId });

      if (!user) {
        const UserEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle(`${no} Account Not Found`)
          .setDescription(`You need to set your GrowID using the **${prefix}set** command first.`)
          .setTimestamp(Date.now())
          .setFooter({
            text: `${StoreName}`,
            iconURL:
              "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
          })
        return message.reply({ embeds: [UserEmbed] });
      }

      // Send the user's GrowID and balance information
      const depoEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${bot} Account Information`)
        .setDescription(`
        ${arrow1}  GrowID : **${user.growId}**
        ${arrow1}  Balance : **${user.balance} ${wl}**`)
        .setTimestamp(Date.now())
        .setFooter({
          text: `${StoreName}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
        })
      return message.reply({ embeds: [depoEmbed] });

    } catch (error) {
      console.error('Error:', error);
      return message.reply('Something went wrong.');
    }
  },
};
