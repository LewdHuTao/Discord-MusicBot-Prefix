const { MessageEmbed } = require("discord.js");
const db = require("../../util/prefixModel.js");

module.exports = {
    name: "prefix",
    category: "Utility",
    description: "Change prefix in this server",
    args: false,
    usage: "",
    aliases: [],
    permission: [],

  run: async (message, args, client, prefix) => {
    
    const data = await db.findOne({ Guild: message.guildId });
    const pre = await args.join(" ")

    if (!message.member.permissions.has('MANAGE_GUILD')) return message.reply({
      embeds: [new MessageEmbed()
        .setColor(client.config.embedColor)
        .setDescription("You don't have enough permission to run this command")
      ]
    });

    if (!pre[0]) {

    const embed = new MessageEmbed()
        .setDescription("Please specify the new prefix you want to set!")
        .setColor(client.config.embedColor)
      return message.reply({ embeds: [embed] });
    }
    
     if(data) {
       data.oldPrefix = prefix;
       data.Prefix = pre;
       await data.save()
     const update = new MessageEmbed()
     .setDescription(`Prefix in this server has been updated to **${pre}**`)
     .setColor(client.config.embedColor)

     return message.reply({embeds: [update]});

    } else {

     const newData = new db({
        Guild : message.guildId,
        Prefix : pre,
        oldPrefix: prefix
       });
       await newData.save()

     const embed = new MessageEmbed()
     .setDescription(`Prefix in this server is now set to **${pre}**`)
     .setColor(client.config.embedColor)
     return message.reply({embeds: [embed]});

    }
  }
};