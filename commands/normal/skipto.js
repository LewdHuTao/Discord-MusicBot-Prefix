const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "skipto",
    category: "Music",
    description: "Skip to",
    args: false,
    usage: "",
    permission: [],
    aliases: ["st"],

    run: async (message, args, client, prefix) => {

        const opt = args.join(" ");

        if (isNaN(opt)) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(":x: | Please put a valid track number to skip")
                ]
            })
        }
        //const duration = player.queue.current.duration

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            const queueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | There is no music playing in this guild!");
            return message.reply({ embeds: [queueEmbed], ephemeral: true });
        }

        if (!message.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "❌ | You must be in a voice channel to use this command!"
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
                    "❌ | You must be in the same voice channel as the bot to use this command!"
                );
            return message.reply({ embeds: [sameEmbed], ephemeral: true });
        }

        const position = Number(opt);

        if (!position || position < 0 || position > player.queue.size) {
            let thing = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription("❌ | Invalid position!");
            return message.reply({ embeds: [thing] });
        }

        player.queue.remove(0, position - 1);
        player.stop();

        let thing = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription("✅ | Skipped to position " + position);

        return message.reply({ embeds: [thing] });
    }
}