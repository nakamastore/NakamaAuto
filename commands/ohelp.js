const { EmbedBuilder } = require('discord.js');
const { prefix, verif, thankyou, megaphone, no, warning, wl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require('../config.json');

module.exports = {
  name: 'ohelp',
  description: 'List available commands',
  execute(message, args) {
    const ohelpEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${megaphone} | Commands Auto Store`)
      .setDescription(`${warning} **Public Commands**
${arrow1} **${prefix}help**
${arrow1} **${prefix}set** <growid>
${arrow1} **${prefix}buy** <code> <amount>
${arrow1} **${prefix}bal**
${arrow1} **${prefix}info**
${arrow1} **${prefix}stock**
${arrow1} **${prefix}depo**
${arrow1} **${prefix}ping**

**${warning} Owner Commands**
${arrow1} **${prefix}addbal** <user> <amount>
${arrow1} **${prefix}addproduct** <name> <code> <price> <type ["yes", "no", "df"]> <role>
${arrow1} **${prefix}add** <code> <text or file>
${arrow1} **${prefix}removeproduct** <code>
${arrow1} **${prefix}removebal** <user> <amount>
${arrow1} **${prefix}removeuser** <mention-user>
${arrow1} **${prefix}removestock** <code> <amount>
${arrow1} **${prefix}setdepo** <world> <owner> <botname>
${arrow1} **${prefix}send** <mention user> <code> <amount>
${arrow1} **${prefix}checkbal** <mention user>
${arrow1} **${prefix}changename** <code> <name>
${arrow1} **${prefix}changecode** <code> <codename>
${arrow1} **${prefix}changeprice** <code> <price>
${arrow1} **${prefix}realtime**
${arrow1} **${prefix}setmt**
${arrow1} **${prefix}resetcount**`)
      .setTimestamp(Date.now())
      .setFooter({
        text: `${StoreName}`,
        iconURL:
          "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
      })
    message.channel.send({ embeds: [ohelpEmbed] });
  },
};
