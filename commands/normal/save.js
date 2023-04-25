const { MessageEmbed, message } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "save",
  category: "Util",
  description: "Save current playing song to DM.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["grab"],

  run: async (message, args, client, prefix) => {
    let channel = await client.getChannel(client, message);
    if (!channel) {
      return;
    }

    let player;
    if (client.manager) {
      player = client.manager.players.get(message.guild.id);
    } else {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Lavalink node is not connected"),
        ],
      });
    }

    if (!player) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("There is no music playing right now."),
        ],
        ephemeral: true,
      });
    }

    const sendtoDmEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setAuthor({
        name: "Saved track",
        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
      })
      .setDescription(
        `**Saved [${player.queue.current.title}](${player.queue.current.uri}) to your DM**`
      )
      .addFields(
        {
          name: "Track Duration",
          value: `\`${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}\``,
          inline: true,
        },
        {
          name: "Track Author",
          value: `\`${player.queue.current.author}\``,
          inline: true,
        },
        {
          name: "Requested Guild",
          value: `\`${message.guild}\``,
          inline: true,
        }
      );

    message.author.send({ embeds: [sendtoDmEmbed] });

    return message.reply({
      embeds: [
        new MessageEmbed()
          .setColor(client.config.embedColor)
          .setDescription(
            "Please check your **DMs**. If you didn't receive any message from me please make sure your **DMs** are open"
          ),
      ],
      ephemeral: true,
    });
  },
};
