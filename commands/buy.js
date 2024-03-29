// Import necessary libraries
const Product = require('../models/product');
const User = require('../models/user');
const purchaseEmitter = require('../events/purchaseEmitter');
const fs = require('fs');
const mongoose = require('mongoose'); // Import Mongoose
const { prefix, verif, thankyou, megaphone, no, warning, wl, bgl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require('../config.json');
const { buylogChannelId } = require('../config.json'); // Replace with the ID of your chosen log channel
const OrderCount = require('../models/orderCount'); // Import the OrderCount model
const { EmbedBuilder } = require('discord.js');

// Initialize the order count from the database
let orderCount = 0;

// Function to get the order count from the database
const getOrderCount = async () => {
  const orderCountDoc = await OrderCount.findOne();
  if (orderCountDoc) {
    return orderCountDoc.count;
  }
  return 0; // Return 0 if no orderCount document found
};

module.exports = {
  name: 'buy',
  description: 'Buy a random product',
  async execute(message, args) {
    if (!message.guild) {
      return message.reply('This command can only be used in a guild.');
    }

    // Check if the channel where the command was used is a ticket channel
    if (!message.channel.name.startsWith('ticket-')) {
      const TicketEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${warning} Error Messages`)
        .setDescription(`Please Use the command in ticket channel or create ticket in here #Ticket`)
        .setTimestamp(Date.now())
        .setFooter({
          text: `${StoreName}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
        })
      return message.reply({ embeds: [TicketEmbed] });
    }

    // Check if there's a GrowID provided in the command
    if (args.length < 2) {
      return message.reply(`${warning} Please provide both the code of the product and the quantity you want to buy.`);
    }

    const productCode = args[0];
    const quantity = parseInt(args[1]);
    const discordId = message.author.id; // Get the user's Discord ID

    const logChannel = message.guild.channels.cache.get(buylogChannelId);

    if (isNaN(quantity) || quantity <= 0) {
      return message.reply(`${warning} Please provide a valid quantity greater than 0.`);
    }
    try {
      let purchasedAccounts = [];
      // Check if the user already exists in the database
      const user = await User.findOne({ discordId });

      if (!user) {
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
      }

      // Find the product in the database by code
      const product = await Product.findOne({ code: productCode });

      if (!product) {
        return message.reply(`${warning} This product does not exist.`);
      }

      // Check if there are variations (account details) available
      if (!product.variations || product.variations.length === 0) {
        return message.reply(`${warning} There are no product details available for this product.`);
      }

      // Check if there's enough stock to buy
      if (product.stock < quantity) {
        return message.reply(`${warning} There is not enough stock to purchase ${quantity} of this product.`);
      }

      // Calculate the total price based on the quantity of products
      const totalPrice = product.price * quantity;

      // Check if the user has enough balance to make the purchase
      if (user.balance < totalPrice) {
        return message.reply(`${warning} You do not have enough balance to purchase this quantity of the product.`);
      }

      // Check the product type
      switch (product.type) {
        // Inside the 'buy' command
        case 'yes':
          // Handle "yes" type using the asynchronous function
          await handleYesType(user, message, product, quantity);
          break;

        case 'no':
          // For "any-product" type, reduce both stock and details
          if (product.variations.length < quantity) {
            return message.reply(`${warning} There are only **${product.variations.length} ${product.name}** available for purchase.`);
          }
          purchasedAccounts = [];
          const randomIndexes = [];

          for (let i = 0; i < quantity; i++) {
            // Generate a random index
            let randomIndex;
            do {
              randomIndex = Math.floor(Math.random() * product.variations.length);
            } while (randomIndexes.includes(randomIndex)); // Ensure we don't select the same detail twice

            randomIndexes.push(randomIndex);

            const selectedVariation = product.variations[randomIndex];
            purchasedAccounts.push(selectedVariation);
          }
          // Remove the purchased details from the product's variations
          product.variations = product.variations.filter((_, index) => !purchasedAccounts.includes(product.variations[index]));

          // Update the stock count
          product.stock -= quantity;

          // Save the updated product to the database
          await product.save();

          // Emit the 'purchaseMade' event to trigger real-time stock update
          purchaseEmitter.emit('purchase');

          const detailsMessage = purchasedAccounts.join('\n');
          const fileName = `${user.growId}.txt`;

          // Create the details file
          fs.writeFileSync(fileName, detailsMessage);

          // Send the file to the user via DM
          const embedDM = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`${verif} ┆ Purchase Successfully`)
            .setDescription(`
            You have purchased **${quantity} ${product.name.replace(/"/g, '')}** for **${totalPrice}${wl}**
            **Don't forget to give reps.**`)
            .setTimestamp()
            .setFooter({
              text: `${StoreName}`,
              iconURL:
                "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
            });
          await message.author.send({ embeds: [embedDM], files: [fileName] });

          // Delete the file after sending
          fs.unlinkSync(fileName);
          break;

        case 'df':
          // Handle "df" type to send random details from the database via DM
          if (product.variations.length < quantity) {
            return message.reply(`${warning} There are only **${product.variations.length} ${product.name}** available for purchase.`);
          }
          purchasedAccounts = [];
          const randomIndexess = [];

          for (let i = 0; i < quantity; i++) {
            // Generate a random index
            let randomIndex;
            do {
              randomIndex = Math.floor(Math.random() * product.variations.length);
            } while (randomIndexess.includes(randomIndex)); // Ensure we don't select the same detail twice

            randomIndexess.push(randomIndex);

            const selectedVariation = product.variations[randomIndex];
            purchasedAccounts.push(selectedVariation);
          }
          // Remove the purchased details from the product's variations
          product.variations = product.variations.filter((_, index) => !purchasedAccounts.includes(product.variations[index]));

          // Update the stock count
          product.stock -= quantity;

          // Save the updated product to the database
          await product.save();

          // Emit the 'purchaseMade' event to trigger real-time stock update
          purchaseEmitter.emit('purchase');

          const detailssMessage = purchasedAccounts.join('\n\n\n');
          const fileNames = `${StoreName}_${user.growId}_${Date.now}.txt`;

          // Create the details file
          fs.writeFileSync(fileNames, detailssMessage);

          // Send the file to the user via DM
          const embedDMs = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`${verif} ┆ Purchase Successfully`)
            .setDescription(`
            You have purchased **${quantity} ${product.name.replace(/"/g, '')}** for **${totalPrice}${wl}**
            **Don't forget to give reps.**`)
            .setTimestamp()
            .setFooter({
              text: `${StoreName}`,
              iconURL:
                "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
            });
          await message.author.send({ embeds: [embedDMs], files: [fileNames] });

          // Delete the file after sending
          fs.unlinkSync(fileNames);
          break;
        case 'autosend':
          // Handle autosend type (customize as needed)
          // For example, send the purchased product directly here
          await autosendFunction(user, message, product, quantity);
          break;
        default:
          return message.reply(`${warning}This product type is not supported.`);
      }

      // Save the updated product to the database
      await product.save();

      // Deduct the total price from the user's balance
      user.balance -= totalPrice;
      await user.save();

      // Fetch the current orderCount
      orderCount = await getOrderCount();

      // Increment the order count
      orderCount++;

      // Update the order count in the database
      await OrderCount.findOneAndUpdate({}, { count: orderCount }, { upsert: true });

      // Emit the 'purchaseMade' event to trigger real-time stock update
      purchaseEmitter.emit('purchase');

      // Add the role to the user
      const roleToAdd = message.guild.roles.cache.get(product.roleToadd);

      if (roleToAdd) {
        await message.member.roles.add(roleToAdd);
      }

      // Create the purchase log embed
      const purchaseLogEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${megaphone} Order Number : **${orderCount}**`)
        .setDescription(`
        ${verif} Verified Transaction
        ${arrow1} Buyer : <@${message.author.id}>
        ${arrow1} Product : **${product.name.replace(/"/g, '')}**
        ${arrow1} Code : **${product.code}**
        ${arrow1} Total Price : **${totalPrice}** ${wl}
        **Thanks For Purchasing Our Product(s)**`)
        .setTimestamp()
        .setFooter({
          text: `${StoreName}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
        });

      // Send the purchase log to the log channel
      if (logChannel) {
        logChannel.send({ embeds: [purchaseLogEmbed] });
      }

      // Send the purchase confirmation message to the user
      const purchaseConfirmationEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${verif} ┆ Purchase Successfully`)
        .setDescription(`You have successfully purchased **${quantity} ${product.name}.** Please Check your DM!`)
        .setTimestamp()
        .setFooter({
          text: `${StoreName}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
        });

      message.reply({ embeds: [purchaseConfirmationEmbed] })
        .then(() => {
          // Delay the channel deletion to allow the user to see the messages and send a warning message
          const delayBeforeDeletion = 10000; // 10 seconds
          setTimeout(() => {
            // Check if the channel exists before attempting to delete it
            if (message.channel) {
              const DeleteEmbed = new EmbedBuilder()
                .setColor("Random")
                .setTitle(`${warning} Deleting Ticket`)
                .setDescription(`This channel will be deleted in **${delayBeforeDeletion / 1000}** seconds. Thank's for buying ${thankyou}`)
                .setTimestamp(Date.now())
                .setFooter({
                  text: `${StoreName}`,
                  iconURL:
                    "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
                });
              message.channel.send({ embeds: [DeleteEmbed] })
                .then(() => {
                  setTimeout(() => {
                    // Check if the channel exists again before attempting to delete it
                    if (message.channel) {
                      message.channel.delete()
                        .catch(console.error);
                    }
                  }, delayBeforeDeletion);
                });
            }
          }, 1000); // Delay the warning message by 1 second
        });
    } catch (error) {
      console.error('Error:', error);
      return message.reply('Something went wrong.');
    }
  },
};


async function autosendFunction(user, message, product, quantity) {
  // Customize this function to handle autosend products
  // For example, send the purchased product directly to the user here
}

// Define an asynchronous function to handle the "yes" type
async function handleYesType(user, message, product, quantity) {
  // Check if there's enough stock to buy
  const totalPrice = product.price * quantity;

  const randomDetails = [];
  for (let i = 0; i < quantity; i++) {
    const randomIndex = Math.floor(Math.random() * product.variations.length);
    randomDetails.push(product.variations[randomIndex]);
  }



  // Update the stock count accordingly
  product.stock -= quantity;

  // Save the updated product to the database
  await product.save();

  // Emit the 'purchaseMade' event to trigger real-time stock update
  purchaseEmitter.emit('purchase');

  const detailsMessages = randomDetails.join('\n');
  const fileNames = `${user.growId}.txt`;

  // Create the details file
  fs.writeFileSync(fileNames, detailsMessages);

  // Send the file to the user
  const embedDMs = new EmbedBuilder()
    .setColor("Random")
    .setTitle(`${verif} ┆ Purchase Successfully`)
    .setDescription(`
    You have purchased **${quantity} ${product.name.replace(/"/g, '')}** for **${totalPrice}${wl}**
    **Don't forget to give reps.**`)
    .setTimestamp()
    .setFooter({
      text: `${StoreName}`,
      iconURL:
        "https://cdn.discordapp.com/attachments/1193772542821945385/1193772901799825438/Profile_Asli.gif?ex=65adeea7&is=659b79a7&hm=5dfe42b7bad9b5046b8e0ec01dbaa384cdccbfe70d55a91e39abe812067f8fd2&",
    });
  await message.author.send({ embeds: [embedDMs], files: [fileNames] });

  // Delete the file after sending
  fs.unlinkSync(fileNames);
}