const { config, prefix, verif, thankyou, megaphone, no, warning, wl, dl, arrow1, arrow2, arrow3, StoreName, bot, owner, world } = require('../config.json');

let maintenanceMode = false;

module.exports = {
  name: 'setmt',
  description: 'Toggle maintenance mode for the bot.',
  execute(message, args) {
    // Check if the user executing the command has the allowed user ID
    if (!config.adminIds.includes(message.author.id)) {
      return message.reply('You do not have permission to use this command.');
    }

    // Toggle maintenance mode
    maintenanceMode = !maintenanceMode;

    // Send a response message indicating the current maintenance status
    message.channel.send(`Maintenance mode is now ${maintenanceMode ? 'enabled' : 'disabled'}.`);
  },
  isMaintenanceModeEnabled: () => maintenanceMode,
};