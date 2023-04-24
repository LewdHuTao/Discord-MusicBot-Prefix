const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "skip",
    category: "Music",
    description: "Skip song ofc",
    args: false,
    usage: "",
    permission: [],
    aliases: ["s"],

    run: async (message, args, client, prefix) => {

        let channel = await client.getChannel(client, message);
        if (!channel) return;
        let player = client.manager.players.get(message.guild.id);
        if (!player)
            return message.reply({
                embeds: [client.ErrorEmbed("There's nothing to skipped!")],
            });

        if (!message.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "❌ | **You must be in a voice channel to use this command!**"
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
        player.stop();
        message.reply({ embeds: [client.Embed("✅ | **Skipped!**")] });
    }
}