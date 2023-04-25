const { MessageEmbed, message } = require("discord.js");

module.exports = {
  name: "guildleave",
  category: "Util",
  description: "Leave server.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["leave"],

  run: async (message, args, client, prefix) => {
    const id = args.join(" ");

    if (isNaN(id)) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(":x: | Please put a valid id to set"),
        ],
      });
    }

    if (message.author.id === client.config.adminId) {
        try{
        const id = message.options.getString('id');

        if (id.toLowerCase() === 'list'){
            client.guilds.cache.forEach((guild) => {
            console.log(`${guild.name} | ${guild.id}`);
            });
            const guild = client.guilds.cache.map(guild => ` ${guild.name} | ${guild.id}`);
            try{
            return message.reply({content:`Guilds:\n\`${guild}\``, ephemeral: true});
            }catch{
            return message.reply({content:`check console for list of guilds`, ephemeral: true});
            }
        }

        const guild = client.guilds.cache.get(id);

        if(!guild){
            return message.reply({content: `\`${id}\` is not a valid guild id`, ephemeral:true});
        }

        await guild.leave().then(c => console.log(`left guild ${id}`)).catch((err) => {console.log(err)});
        return message.reply({content:`left guild \`${id}\``, ephemeral: true});
        }catch (error){
        console.log(`there was an error trying to leave guild ${id}`, error);
        }
    }else {
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription("You are not authorized to use this command!"),
            ],
        });
    }
  },
};
