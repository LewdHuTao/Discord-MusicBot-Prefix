const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "loopqueue",
    category: "Music",
    description: "Loop the whole queue",
    args: false,
    usage: "",
    permission: [],
    aliases: ["repeatqueue", "lq"],

    run: async (message, args, client, prefix) => {

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            return message.reply({
                embeds: [client.ErrorEmbed("There is no music playing")],
            });
        }
        if (!message.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "❌ | **You need to join voice channel first before you can use this command.**"
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
                    "❌ | **You must be in the same voice channel as me.**"
                );
            return message.reply({ embeds: [sameEmbed], ephemeral: true });
        }
        if (player.setQueueRepeat(!player.queueRepeat));
        const queueRepeat = player.queueRepeat ? "enabled" : "disabled";

        let loopembed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription(`:thumbsup: | **Loop queue is now \`${queueRepeat}\`**`);
        message.reply({ embeds: [loopembed] });
    }
}