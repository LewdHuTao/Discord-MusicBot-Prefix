const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "replay",
    category: "Music",
    description: "Replay current playing song",
    args: false,
    usage: "",
    permission: [],
    aliases: [],

    run: async (message, args, client, prefix) => {

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            const QueueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("There's nothing playing in the queue");
            return message.reply({ embeds: [QueueEmbed], ephemeral: true });
        }

        if (!message.member.voice.channel) {
            const JoinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "You have to join voice channel first before you can use this command"
                );
            return message.reply({ embeds: [JoinEmbed], ephemeral: true });
        }

        if (
            message.guild.me.voice.channel &&
            !message.guild.me.voice.channel.equals(
                message.member.voice.channel
            )
        ) {
            const SameEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "You must be in the same voice channel as me first before you can use this command"
                );
            return message.reply({ embeds: [SameEmbed], ephemeral: true });
        }
        player.seek(0);
      const replayEmbed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setDescription("Song replayed!");
        return message.reply({ embeds: [replayEmbed] });
    
  }
}