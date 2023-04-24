const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "move",
    category: "Music",
    description: "Move songs",
    args: false,
    usage: "",
    permission: [],
    aliases: [],

    run: async (message, args, client, prefix) => {

        const track = args[0];
        if (isNaN(track)) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(":x: | Please put a valid track number")
                ]
            })
        }

        const position = args[1];

        if (isNaN(position)) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(":x: | Please put a valid destination number")
                ]
            })
        }

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
                .setDescription("You must be in a voice channel to use this command!");
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
                    "You must be in the same voice channel as me to use this command!"
                );
            return message.reply({ embeds: [sameEmbed], ephemeral: true });
        }

        let trackNum = Number(track) - 1;
        if (trackNum < 0 || trackNum > player.queue.length - 1) {
            return message.reply(":x: | **Invalid track number**");
        }

        let dest = Number(position) - 1;
        if (dest < 0 || dest > player.queue.length - 1) {
            return message.reply(":x: | **Invalid position number**");
        }

        const thing = player.queue[trackNum];
        player.queue.splice(trackNum, 1);
        player.queue.splice(dest, 0, thing);
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(":white_check_mark: | **Moved track**"),
            ],
        });
    }
}