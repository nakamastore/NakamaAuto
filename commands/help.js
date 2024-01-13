const { EmbedBuilder } = require('discord.js');
const { imageURL, prefix, verif, thankyou, megaphone, no, warning, wl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require('../config.json');

module.exports = {
  name: 'help',
  description: 'List available commands',
  execute(message, args) {
    const ohelpEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${megaphone} | Commands Auto Store`)
      .addFields({
        name: `${warning} Public Commands`, value: `
          ${arrow1} ** ${prefix}help ** --To help navigate using auto store
          ${arrow1} ** ${prefix}set ** [GrowID] -- To set growid in the store
          ${arrow1} **${prefix}buy** [code] [amount] -- To buy product in the store
          ${arrow1} **${prefix}bal** -- To check balance
          ${arrow1} **${prefix}info** -- To check your GrowID
          ${arrow1} **${prefix}stock** -- To check stock
          ${arrow1} **${prefix}depo** -- To check depo information`, inline: true
      })
      .setTimestamp(Date.now())
      .setFooter({
        text: `${StoreName}`,
        iconURL:
          "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
      })
    message.reply({ embeds: [ohelpEmbed] });
  },
};
