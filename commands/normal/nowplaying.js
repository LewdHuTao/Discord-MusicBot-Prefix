const { MessageEmbed } = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
    name: "nowplaying",
    category: "Music",
    description: "See what the current play song",
    args: false,
    usage: "",
    permission: [],
    aliases: ["nowplay", "np"],

    run: async (message, args, client, prefix) => {

        const player = message.client.manager.players.get(message.guild.id);

        if (!player) {
            const queueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("There's nothing playing in the queue");
            return message.reply({ embeds: [queueEmbed], ephemeral: true });
        }

        if (!player.playing) {
            const queueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("There's nothing playing.");
            return message.reply({ embeds: [queueEmbed], ephemeral: true });
        }

        const song = player.queue.current;
        const embed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle("Now playing ♪")
            // show who requested the song via setField, also show the duration of the song
            .setFields([
                {
                    name: "Requested by",
                    value: `<@${song.requester.id}>`,
                    inline: true,
                },
                // show duration if live show live
                {
                    name: "Duration",
                    value: song.isStream
                        ? `\`LIVE\``
                        : `\`${prettyMilliseconds(player.position, {
                            secondsDecimalDigits: 0,
                        })} / ${prettyMilliseconds(song.duration, {
                            secondsDecimalDigits: 0,
                        })}\``,
                    inline: true,
                },
            ])
            // show the thumbnail of the song using displayThumbnail("maxresdefault")
            .setThumbnail(song.displayThumbnail("maxresdefault"))
            // show the title of the song and link to it
            .setDescription(`[${song.title}](${song.uri})`);
        return message.reply({ embeds: [embed] });
    }
}