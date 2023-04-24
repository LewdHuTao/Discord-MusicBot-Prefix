const { MessageEmbed } = require("discord.js");
const colors = require("colors");

module.exports = {
    name: "autopause",
    category: "Music",
    description: "Autopause the queue when everone left the voice channel.",
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

    let autoPauseEmbed = new MessageEmbed().setColor(client.config.embedColor);
    const autoPause = player.get("autoPause");
    player.set("requester", message.guild.members.me);

    if (!autoPause || autoPause === false) {
      player.set("autoPause", true);
    } else {
      player.set("autoPause", false);
    }
    autoPauseEmbed
			.setDescription(`**Auto Pause is** \`${!autoPause ? "ON" : "OFF"}\``)
			.setFooter({
			  text: `The player will ${!autoPause ? "now be automatically" : "no longer be"} paused when everyone leaves the voice channel.`
			});
    client.warn(
      `Player: ${player.options.guild} | [${colors.blue(
        "AUTOPAUSE"
      )}] has been [${colors.blue(!autoPause ? "ENABLED" : "DISABLED")}] in ${
        client.guilds.cache.get(player.options.guild)
          ? client.guilds.cache.get(player.options.guild).name
          : "a guild"
      }`
    );

    return message.reply({ embeds: [autoPauseEmbed] });
    }
}