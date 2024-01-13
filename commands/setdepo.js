// setdepo.js

const Depo = require('../models/depo');
const { adminIds, prefix, verif, thankyou, megaphone, no, warning, wl, bgl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require('../config.json');

module.exports = {
  name: 'setdepo',
  description: 'Set the depo world and bot name',
  async execute(message, args) {
    // Check if the user has permission to set depo information (you can implement your permission logic here)
    if (!adminIds.includes(message.author.id)) {
      return message.reply('You do not have permission to use this command.');
    }

    // Check if both depo world and bot name are provided
    if (args.length !== 3) {
      return message.reply('Usage : .setdepo <world> <owner> <botname>');
    }

    const depoWorld = args[0];
    const worldOwner = args[1];
    const botName = args[2];
    try {
      // Create or update the depo information in the database
      await Depo.findOneAndUpdate({}, { depoWorld, botName, worldOwner }, { upsert: true });

      return message.reply(`${verif} Depo information has been set.`);
    } catch (error) {
      console.error('Error:', error);
      return message.reply('Something went wrong.');
    }
  },
};
