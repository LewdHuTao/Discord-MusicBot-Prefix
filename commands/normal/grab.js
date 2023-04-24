const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "grab",
    category: "Music",
    description: "Save current playing song to your DM's",
    args: false,
    usage: "",
    permission: [],
    aliases: [],

    run: async (message, args, client, prefix) => {

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            const queueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(":x: | **There's nothing playing**");
            return message.reply({ embeds: [queueEmbed], ephemeral: true });
        }

        if (!message.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    ":x: | **You must be in a voice channel to use this command!**"
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
                    ":x: | **You must be in the same voice channel as me to use this command!**"
                );
            return message.reply({ embeds: [sameEmbed], ephemeral: true });
        }

        const save = new MessageEmbed()
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

        message.author.send({ embeds: [save] });

        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(
                        "Please check your **DM**. If you don't receive any message from me please make sure your **DM** is open"
                    ),
            ]
        });
    }
}