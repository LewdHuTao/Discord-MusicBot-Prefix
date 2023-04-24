const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "disconnect",
    category: "Music",
    description: "Make bot stop play current song and leave voice channel",
    args: false,
    usage: "",
    permission: [],
    aliases: ["dc", "stop", "leave"],

    run: async (message, args, client, prefix) => {

        let player = client.manager.players.get(message.guild.id);
        if (!player)
            return message.reply({
                embeds: [client.ErrorEmbed("**Nothing is playing right now...**")],
            });

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

        player.destroy();

        message.reply({
            embeds: [client.Embed(`:wave: | **Disconnected!**`)],
        });
    }
}