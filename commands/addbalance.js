const { Client, EmbedBuilder } = require('discord.js');
const User = require('../models/user');// Import your User model (adjust the path as needed)
const { adminIds, prefix, verif, thankyou, megaphone, no, warning, wl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require('../config.json');

module.exports = {
  name: 'addbal',
  description: 'Add balance to a user',
  async execute(message, args) {
    // Check if there's a user mentioned in the message
    const userMention = message.mentions.users.first();

    if (!adminIds.includes(message.author.id)) {
      return message.reply('You do not have permission to use this command.');
    }

    if (!userMention) {
      return message.reply('Please mention a user to add balance to.');
    }

    // Check if the specified amount to add is a valid number
    if (args.length < 2 || isNaN(args[1])) {
      return message.reply('Please provide a valid amount to add.');
    }

    const amountToAdd = parseFloat(args[1]);

    try {
      // Find the mentioned user in the database by Discord ID
      const user = await User.findOne({ discordId: userMention.id });

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

      // Add the specified amount to the user's balance
      user.balance += amountToAdd;
      await user.save();

      const AddEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${verif} ┆ Add Balance Successfully`)
        .setDescription(`
        Added **${amountToAdd}** to ${userMention.tag}'s balance.
        New balance : **${user.balance}** ${wl}`)
        .setTimestamp(Date.now())
        .setFooter({
          text: `${StoreName}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
        });
      return message.reply({ embeds: [AddEmbed] });
    } catch (error) {
      console.error('Error:', error);
      return message.reply('Something went wrong.');
    }
  },
};
