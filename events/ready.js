const Discord = require("discord.js");

module.exports = async (bot) => {

    bot.user.setActivity(`Mes messages privés.`, { type: "WATCHING" })
    console.log(`${bot.user.username} est pret !`);

} 
