const { EmbedBuilder } = require('discord.js');
const Product = require('../models/product');
const { prefix, verif, thankyou, megaphone, no, warning, wl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require('../config.json');

const sendStockMessage = async (message) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return message.reply('No products found in the database.');
    }

    const stockInfoEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${megaphone} Real-time Stock ${megaphone}\n${arrow2} Updated stock every purchase`)
      .setTimestamp()
      .setFooter({ text: `${StoreName}` });

    products.forEach((product) => {
      stockInfoEmbed.addFields(
        {
          name: `-----------------------------------------`,
          value: `
          ${arrow1} Product : **${product.name.replace(/"/g, '')}**
          ${arrow1}  Code : **${product.code}**
          ${arrow1}  Stock : **${product.stock}**
          ${arrow1}  Price : **${product.price}** ${wl}
          **-----------------------------------------**`,
          inline: false,
        }
      );
    });

    let sentMessage;

    if (!message._editedMessage) {
      // Send the initial stock message
      sentMessage = await message.channel.send({ embeds: [stockInfoEmbed] });
      message._editedMessage = sentMessage; // Store the initial message for editing
    } else {
      // Edit the existing message to update stock information
      sentMessage = await message._editedMessage.edit({ embeds: [stockInfoEmbed] });
    }

    return sentMessage; // Return the sent message object
  } catch (error) {
    console.error('Error:', error);
    return null; // Return null in case of an error
  }
};

module.exports = { sendStockMessage };
