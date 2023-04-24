const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "pause",
    category: "Music",
    description: "Pause current playing track",
    args: false,
    usage: "",
    permission: [],
    aliases: [],

    run: async (message, args, client, prefix) => {

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            const queueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | **Nothing is playing right now...**");
            return message.reply({ embeds: [queueEmbed], ephemeral: true });
        }

        if (!message.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "❌ | **You must be in a voice channel to use this command!**"
                );
            return message.reply({ embeds: [joinEmbed], ephemeral: true });
        }

        if (
            message.guild.me.voice.channel &&
            !message.guild.me.voice.channel.equals(
                message.member.voice.channel
            )
        ) {
            const sameEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "❌ | **You must be in the same voice channel as me to use this command!**"
                );
            return message.reply({ embeds: [sameEmbed], ephemeral: true });
        }

        if (player.paused) {
            let pembed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | **Current playing track is already paused!**");
            return message.reply({ embeds: [pembed], ephemeral: true });
        }

        player.pause(true);

        let pauseembed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription(`⏸ **Paused!**`);
        return message.reply({ embeds: [pauseembed] });
    }
}