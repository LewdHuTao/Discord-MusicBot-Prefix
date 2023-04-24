const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "volume",
    category: "Music",
    description: "set or see current volume",
    args: false,
    usage: "",
    permission: [],
    aliases: ["vol", "v"],

    run: async (message, args, client, prefix) => {

        const category = args.join(" ");

        if (isNaN(category)) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(":x: | Please put a valid number to set")
                ]
            })
        }

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

        let vol = category
        if (!vol || vol < 1 || vol > 125) {
            const NumberEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(`:loud_sound: | **Current volume ${player.volume}**`);
            return message.reply({ embeds: [NumberEmbed] });
        }

        player.setVolume(vol);
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(
                        `:loud_sound: | Successfully set volume to **${player.volume}**`
                    ),
            ],
        });
    }
}