const { Client } = require("discord.js");
const User = require("../models/user");
const { EmbedBuilder } = require("discord.js");
const { prefix, verif, thankyou, megaphone, no, warning, wl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require("../config.json");

module.exports = {
  name: "set",
  description: "Set your GrowID.",
  execute(message, args) {
    // Check if there's a GrowID provided in the command
    if (args.length < 1) {
      const ProvEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${megaphone} ┆ Error Messages!`)
        .setDescription(
          "Please use command " +
          "`" +
          ".set [GrowiD Growtopia]" +
          "`" +
          " to set your GrowID in store"
        )
        .setTimestamp()
        .setFooter({
          text: `${StoreName}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
        });
      return message.reply({ embeds: [ProvEmbed] });
    } else {
      const growID = args[0]; // Extract the provided GrowID from args
      const discordId = message.author.id; // Get the user's Discord ID

      // Check if the user already exists in the database
      User.findOne({ discordId })
        .then((user) => {
          if (user) {
            // If the user exists, update their GrowID
            user.growId = growID;
            user.save();
            const changeEmbed = new EmbedBuilder()
              .setColor("Random")
              .setTitle(`${verif} ┆ GrowID change successfully`)
              .setDescription(
                `Successfully changed!\nYour GrowID is ` +
                "`" +
                `${growID}` +
                "`"
              )
              .setTimestamp()
              .setFooter({
                text: `${StoreName}`,
                iconURL:
                  "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
              });
            message.reply({ embeds: [changeEmbed] });
          } else {
            // If the user does not exist, create a new user
            const newUser = new User({
              discordId,
              discordTag: message.author.tag,
              growId: growID,
              balance: 0, // You can set an initial balance here
            });
            newUser.save();
            const depoEmbed = new EmbedBuilder()
              .setColor("Random")
              .setTitle(`${verif} ┆ GrowID Set successfully`)
              .setDescription(
                `${megaphone} Welcome to ${StoreName}! Your GrowID is now set to **${growID}**`
              )
              .setTimestamp()
              .setFooter({
                text: `${StoreName}`,
                iconURL:
                  "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
              });

            message.reply({ embeds: [depoEmbed] });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          message.reply(
            "Something went wrong, please contact <@1193767442632167444>"
          );
        });
    }
  },
};
