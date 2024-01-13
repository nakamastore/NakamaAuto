const User = require('../models/user'); // Import your User model
const { prefix, verif, thankyou, megaphone, no, warning, wl, bgl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world, desiredChannelId, specificUserId } = require('../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  once: false,
  execute: async (message, client) => {
    // Check if the message author is the specific user and in the desired channel
    if (message.author.id === specificUserId && message.channel.id === desiredChannelId) {
      const description = message.embeds[0].description;
      const growIDMatch = description.match(/GrowID: (\w+)/);
      const depositMatch = description.match(/Deposit: (\d+) (.*)/);

      if (growIDMatch && depositMatch) {
        const growID = growIDMatch[1];
        const depositAmount = parseInt(depositMatch[1]);
        const itemName = depositMatch[2]; // This captures the whole item name with spaces

        try {
          const itemValues = {
            "World Lock": 1,
            "Diamond Lock": 100,
            "Blue Gem Lock": 10000,
          };

          // Find the document with the matching GrowID in the database, ignoring case
          let user = await User.findOne({ growId: new RegExp(`^${growID}$`, 'i') });

          if (user) {
            // If the document exists and the item name is recognized, update the balance with the deposit amount
            if (itemValues[itemName]) {
              user.balance += depositAmount * itemValues[itemName];
              await user.save();
              const AddEmbed = new EmbedBuilder()
                .setColor("Random")
                .setTitle(`${verif} ┆ Add Balance Successfully`)
                .setDescription(`
                Successfully Adding **${depositAmount}** **${itemName}** to **${growID}**
                Your new balance is **${user.balance}** ${wl}`)
                .setTimestamp(Date.now())
                .setFooter({
                  text: `${StoreName}`,
                  iconURL:
                    "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
                });
              message.reply({ embeds: [AddEmbed] });

              console.log(`Sent a success message: Successfully updated ${growID}'s balance by ${depositAmount} ${itemName}.`);
            } else {
              message.reply(`Unknown item name : ${itemName}`);
              console.log('Unknown item name');
            }
          } else {
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
            message.reply({ embeds: [ProvEmbed] });
            console.log('Not Registered');
          }
        } catch (error) {
          console.error('Error:', error);
          message.reply('Something went wrong.');
        }
      }
    }
  },
};