const { Client, EmbedBuilder } = require('discord.js');
const User = require('../models/user'); // Import your User model (adjust the path as needed)
const { prefix, verif, thankyou, megaphone, no, warning, wl, bgl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require('../config.json');

module.exports = {
  name: 'bal',
  description: 'Check your balance',
  async execute(message, args) {
    try {
      const discordId = message.author.id; // Get the user's Discord ID

      // Check if the user exists in the database
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

      // Get and send the user's balance
      const userBalance = user.balance;
      const depoEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${bgl} Balance Information`)
        .setDescription(`
      ${arrow1}  Balance : **${user.balance} ${wl}**`)
        .setTimestamp(Date.now())
        .setFooter({
          text: `${StoreName}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
        })
      message.reply({ embeds: [depoEmbed] });
    } catch (error) {
      console.error('Error:', error);
      return message.reply('Something went wrong.');
    }
  },
};
