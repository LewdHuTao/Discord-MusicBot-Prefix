const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "previous",
    category: "Music",
    description: "Play previous song",
    args: false,
    usage: "",
    permission: [],
    aliases: ["prev"],

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

        if (!player.queue.previous)
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.config.embedColor)
                        .setDescription("❌ | **There is no previous song in the queue.**"),
                ],
            });

        const currentSong = player.queue.current;
        player.play(player.queue.previous);
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(
                        `⏮ | Previous song: **${currentSong.title}** by **${currentSong.requester.username}**`
                    ),
            ],
        });

        if (currentSong) player.queue.unshift(currentSong);
    }
}