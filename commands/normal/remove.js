const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "remove",
    category: "Music",
    description: "Remove songs from queue",
    args: false,
    usage: "",
    permission: [],
    aliases: ["rmv"],

    run: async (message, args, client, prefix) => {

        const opt = args.join(" ");

        if (isNaN(opt)) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(":x: | Please put a valid track number")
                ]
            })
        }

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            const queueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("There's nothing playing in the queue");
            return message.reply({ embeds: [queueEmbed], ephemeral: true });
        }

        if (!message.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "You have to join voice channel first before you can use this command"
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
                    "You must be in the same voice channel as me first before you can use this command"
                );
            return message.reply({ embeds: [sameEmbed], ephemeral: true });
        }

        const position = Number(opt) - 1;
        if (position > player.queue.size) {
            let thing = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    `Current queue has only **${player.queue.size}** track`
                );
            return message.reply({ embeds: [thing] });
        }

        const song = player.queue[position];
        player.queue.remove(position);

        const number = position + 1;
        let thing = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription(`Removed track number **${number}** from queue`);
        return message.reply({ embeds: [thing] });
    }
}