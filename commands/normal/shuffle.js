const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "shuffle",
    category: "Music",
    description: "Shuffle queue",
    args: false,
    usage: "",
    permission: [],
    aliases: ["shuff"],

    run: async (message, args, client, prefix) => {

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            const queueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | **There's nothing playing in the queue**");
            return message.reply({ embeds: [queueEmbed], ephemeral: true });
        }

        if (!message.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "❌ | **You must be in a voice channel to use this command.**"
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

        if (!player.queue || !player.queue.length || player.queue.length === 0) {
            const AddEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | **There are no songs in the queue.**");
            return message.reply({ embeds: [AddEmbed], ephemeral: true });
        }

        //  if the queue is not empty, shuffle the entire queue
        player.queue.shuffle();
        const ShuffleEmbed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription("🔀 | **Successfully shuffled the queue.**");
        return message.reply({ embeds: [ShuffleEmbed] });
    }
}