const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "filters",
    category: "Music",
    description: "Set filter to current playing song",
    args: false,
    usage: "",
    permission: [],
    aliases: ["filter"],

    run: async (message, args, client, prefix) => {

        const op = args.join(" ").toLowerCase();

        if (!op) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(":x: | Please type a filter option to apply")
                    .addField(
                        "Available options",
                        "Nightcore\nBassBoost\nVaporwave\nPop\nSoft\nTreblebass\n8D\nKaraoke\nVibrato\nTremolo"
                    )
                    .setFooter({
                        text: `Usage: ${prefix}filters <options>`
                    })
                ]
            })
        }

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

        // create a new embed
        let thing = new MessageEmbed().setColor(client.config.embedColor);

        if (op === "nightcore") {
            thing.setDescription("✅ | Nightcore filter is now active!");
            player.nightcore = true;
        } else if (op === "bassboost") {
            thing.setDescription("✅ | BassBoost filter is now on!");
            player.bassboost = true;
        } else if (op === "vaporwave") {
            thing.setDescription("✅ | Vaporwave filter is now on!");
            player.vaporwave = true;
        } else if (op === "pop") {
            thing.setDescription("✅ | Pop filter is now on!");
            player.pop = true;
        } else if (op === "soft") {
            thing.setDescription("✅ | Soft filter is now on!");
            player.soft = true;
        } else if (op === "treblebass") {
            thing.setDescription("✅ | Treblebass filter is now on!");
            player.treblebass = true;
        } else if (op === "8d") {
            thing.setDescription("✅ | Eight Dimension filter is now on!");
            player.eightD = true;
        } else if (op === "karaoke") {
            thing.setDescription("✅ | Karaoke filter is now on!");
            player.karaoke = true;
        } else if (op === "vibrato") {
            thing.setDescription("✅ | Vibrato filter is now on!");
            player.vibrato = true;
        } else if (op === "tremolo") {
            thing.setDescription("✅ | Tremolo filter is now on!");
            player.tremolo = true;
        } else if (op === "off") {
            thing.setDescription("✅ | EQ has been cleared!");
            player.reset();
        }

        return message.reply({ embeds: [thing] });
    }
}