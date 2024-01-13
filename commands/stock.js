const { Client, EmbedBuilder } = require('discord.js');
const Product = require('../models/product'); // Import your Product model (adjust the path as needed)
const { stockChannelId, prefix, verif, thankyou, megaphone, no, warning, wl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require('../config.json');

module.exports = {
  name: 'stock',
  description: 'Display product stock information',
  async execute(message, args) {
    try {
      // Find all products in the database
      const products = await Product.find();

      if (products.length === 0) {
        return message.reply('No products found in the database.');
      }

      // Create a MessageEmbed to display product information
      const depoEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${megaphone} Stock Information`)
        .setDescription(`You can see the current stock in <#${stockChannelId}>`)
        .setTimestamp(Date.now())
        .setFooter({
          text: `${StoreName}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
        })

      // Add information about each product to the embed

      // Send the MessageEmbed with product information
      message.reply({ embeds: [depoEmbed] });
    } catch (error) {
      console.error('Error:', error);
      return message.reply('Something went wrong.');
    }
  },
};
