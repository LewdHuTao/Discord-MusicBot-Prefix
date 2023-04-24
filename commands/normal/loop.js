const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "loop",
    category: "Music",
    description: "Loop current playing song",
    args: false,
    usage: "",
    permission: [],
    aliases: ["repeat", "l"],

    run: async (message, args, client, prefix) => {

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            return message.reply({
                embeds: [client.ErrorEmbed("❌ | **Nothing is playing right now...**")],
            });
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
        if (player.setTrackRepeat(!player.trackRepeat));
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";

        let loopembed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription(`👍 | **Loop has been \`${trackRepeat}\`**`);
        message.reply({ embeds: [loopembed] });
    }
}