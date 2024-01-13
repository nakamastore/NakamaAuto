// depo.js

const { EmbedBuilder } = require("discord.js");
const Depo = require("../models/depo");
const { prefix, verif, thankyou, megaphone, no, warning, wl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require("../config.json");

module.exports = {
  name: "depo",
  description: "Retrieve and display depo information",
  async execute(message, args) {
    try {
      // Retrieve depo information from the database
      const depoInfo = await Depo.findOne();

      if (!depoInfo) {
        return message.reply("Depo information has not been set.");
      }

      // Create an embed to display depo information
      const depoEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${megaphone} ┆ World Depo Information`)
        .setDescription(
          `${world} World : **${depoInfo.depoWorld}**
           ${owner} Owner : **${depoInfo.worldOwner}**
           ${bot} Bot Name : **${depoInfo.botName}**`
        )
        .addFields({
          name: `${warning} Attention`,
          value:
            `If bot depo offline, use screenshot then send picture to ticket`,
        })
        .setTimestamp()
        .setFooter({
          text: `${StoreName}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
        });

      return message.reply({ embeds: [depoEmbed] });
    } catch (error) {
      console.error("Error:", error);
      return message.reply("Something went wrong.");
    }
  },
};
