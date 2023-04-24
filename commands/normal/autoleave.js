const { MessageEmbed } = require("discord.js");
const colors = require("colors");

module.exports = {
    name: "autoleave",
    category: "Music",
    description: "Autoleave when everyone left the voice channel",
    args: false,
    usage: "",
    permission: [],
    aliases: [],

    run: async (message, args, client, prefix) => {

        let channel = await client.getChannel(client, message);
    if (!channel) return;

    let player;
    if (client.manager)
      player = client.manager.players.get(message.guild.id);
    else
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Lavalink node is not connected"),
        ],
      });

    if (!player) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("There's nothing playing in the queue"),
        ],
        ephemeral: true,
      });
    }

    let autoLeaveEmbed = new MessageEmbed().setColor(client.config.embedColor);
    const autoLeave = player.get("autoLeave");
    player.set("requester", message.guild.me);

    if (!autoLeave || autoLeave === false) {
      player.set("autoLeave", true);
    } else {
      player.set("autoLeave", false);
    }
    autoLeaveEmbed
			.setDescription(`**Auto Leave is** \`${!autoLeave ? "ON" : "OFF"}\``)
			.setFooter({
			  text: `The player will ${!autoLeave ? "now automatically" : "not automatically"} leave when the voice channel is empty.`
			});
    client.warn(
      `Player: ${player.options.guild} | [${colors.blue(
        "autoLeave"
      )}] has been [${colors.blue(!autoLeave ? "ENABLED" : "DISABLED")}] in ${
        client.guilds.cache.get(player.options.guild)
          ? client.guilds.cache.get(player.options.guild).name
          : "a guild"
      }`
    );

    return message.reply({ embeds: [autoLeaveEmbed] });
    }
}