const Discord = require("discord.js");
const functions = require("../../functions/functions");
const haste = require('hastebin-save');
const moment = require('moment');

exports.run = async (bot, message, args, hastebin) => {

    if(message.channel.type !== "dm" && !message.author.bot && !message.channel.name.startsWith(`mp-`) && !isNaN(message.channel.topic)) return functions.error(message.channel, "Cette commande ne peut être exécutée que dans un salons de ticket.");

 const channelstaff = bot.channels.cache.get("ID CHANNEL LOGS");

    if(!channelstaff) return;

    guildSupport = bot.guilds.cache.find(c => c.id === bot.config.serverID);
    if(!guildSupport) return console.log(`Aucun serveur valide n'a été défini comme serveur de support.`);

    let ticketSupport = guildSupport.roles.cache.find(r => r.name === "Ticket Support");
    if(!ticketSupport) {
        guildSupport.roles.create({data:{name: "Ticket Support", permissions: 0}, reason: 'Le staff a besoin de ce rôle pour voir les tickets.'});
        functions.error(message.channel, "Le rôle de support vient d'être créé, veuillez refaire cette commande.");
        return;
    }

    if(!message.guild.member(message.author).roles.cache.has(ticketSupport.id)) return functions.error(message.channel, `The ${ticketSupport} role is required for this command.`);

    let user = bot.users.cache.find(u => u.id === message.channel.topic);
    if(!user) return functions.error(message.channel, "Impossible de trouver cet utilisateur.");

    const closeEmbed = new Discord.MessageEmbed()
    .setAuthor(`🗑️ | Ticket Close`)
    .setColor(bot.color.blue)
    .setTimestamp()
    .setFooter(`Renvoyez un message pour rouvrir un ticket.`)
    .setDescription(`Votre ticket a été fermé par un membre de notre équipe. Si vous pensez qu'il a fait une erreur, n'hésitez pas à la rouvrir en envoyant un message.`)
    .addField(`Comment supprimer tous les messages ?`, [
        `Vous pouvez supprimer tous les messages du bot en envoyant : \`clear svp\``
    ]);

    let msg_channel = await message.channel.messages.fetch()
    const mapped = msg_channel.map((msg) => msg.author.bot?msg.author.id == bot.user.id?msg.embeds.length>0?`[ ${moment(msg.createdTimestamp).format('DD/MM/YYYY | HH:mm:ss')} ] <BOT> ${msg.embeds[0].author?msg.embeds[0].author.name:msg.embeds[0].title?msg.embeds[0].title:"Inconnu"}: ${msg.embeds[0].description}`:null:null:`[ ${moment(msg.createdTimestamp).format('DD/MM/YYYY | HH:mm:ss')} ] ${msg.author.username}: ${msg.content}`).join('\n');
    haste.upload(mapped, (link) => {

    const EmbedStaffTicket = new Discord.MessageEmbed()
    .setAuthor(`🗑️ | Ticket Close`)
    .setColor(bot.color.blue)
    .setTimestamp()
    .setDescription(`Le Ticket (#${message.channel.name}) est supprimé Par ${message.author.tag} (${message.author.id})\n\nArchive de la conversation : [Liste des Messages](https://hastebin.com/${link})`)
    channelstaff.send(EmbedStaffTicket);
    });

    user.send(closeEmbed)
    .then(m => {
        message.channel.delete().catch(e => {return functions.error(message.channel, "Impossible de supprimer les message.")});
    });
    
    
}

exports.help = {
    name: "close",
    aliases: [],
    category: "Utilities"
}

exports.requirements = {
    botPerms: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
    userPerms: []
}