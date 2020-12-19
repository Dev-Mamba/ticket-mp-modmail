const Discord = require("discord.js");
const functions = require("../../functions/functions");

exports.run = async (bot, message, args) => {

    if(message.channel.type !== "dm" && !message.author.bot && !message.channel.name.startsWith(`mp-`) && !isNaN(message.channel.topic)) return functions.error(message.channel, "This command can only be executed in a help room.");

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

    let closeEmbed = new Discord.MessageEmbed()
    .setAuthor(`🗑️ | Ticket Close`)
    .setColor(bot.color.blue)
    .setTimestamp()
    .setFooter(`Renvoyez un message pour rouvrir un ticket.`)
    .setDescription(`Votre ticket a été fermé par un membre de notre équipe. Si vous pensez qu'il a fait une erreur, n'hésitez pas à la rouvrir en envoyant un message.`)
    .addField(`Comment supprimer tous les messages ?`, [
        `Vous pouvez supprimer tous les messages du bot en envoyant : \`clear svp.\``
    ]);

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