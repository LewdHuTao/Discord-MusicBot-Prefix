const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "resume",
    category: "Music",
    description: "resume current playing song",
    args: false,
    usage: "",
    permission: [],
    aliases: ["res"],

    run: async (message, args, client, prefix) => {

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            const queueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | Nothing is playing right now...");
            return message.reply({ embeds: [queueEmbed], ephemeral: true });
        }

        if (!message.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "❌ | **You must be in the same voice channel as me to use this command!**"
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

        if (!player.paused) {
            let ResumedEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | **Current track is already resumed**");
            return message.reply({ embeds: [ResumedEmbed], ephemeral: true });
        }
        player.pause(false);
        let ResEmbed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription(`⏯ **Resumed!**`);
        return message.reply({ embeds: [ResEmbed] });
    }
}