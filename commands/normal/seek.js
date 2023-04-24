const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "seek",
    category: "Music",
    description: "Seeeeeek",
    args: false,
    usage: "",
    permission: [],
    aliases: [],

    run: async (message, args, client, prefix) => {

        const opt = args.join(" ");

        if (!opt) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(":x: | Please put a valid time to seek")
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
    
        const time = ms(opt);
        const position = player.position;
        const duration = player.queue.current.duration;

        if (time <= duration) {
            if (time > position) {
                player.seek(time);
                let thing = new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(
                        `⏩ | **${player.queue.current.title}** has been seeked to **${ms(
                            time
                        )}**`
                    );
                return message.reply({ embeds: [thing] });
            } else {
                player.seek(time);
                let thing = new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(
                        `⏩ | **${player.queue.current.title}** has been seeked to **${ms(
                            time
                        )}**`
                    );
                return message.reply({ embeds: [thing] });
            }
        } else {
            let thing = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    `Cannot seek current playing track. This may happened because seek duration has exceeded track duration`
                );
            return message.reply({ embeds: [thing] });
        }
    }
}