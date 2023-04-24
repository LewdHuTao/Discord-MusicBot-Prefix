const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "join",
    category: "Music",
    description: "Make bot join your voice channel",
    args: false,
    usage: "",
    permission: [],
    aliases: [],

    run: async (message, args, client, prefix) => {

        let channel = await client.getChannel(client, message);
        let node = await client.getLavalink(client);
        if (!node)
            return message.reply({
                embeds: [client.ErrorEmbed("**Lavalink node not connected**")],
            });
        if (!message.member.voice.channel) {
            const joinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "❌ | **You must be in a voice channel to use this command.**"
                );
            return message.reply({ embeds: [joinEmbed], ephemeral: true });
        }

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            player = client.createPlayer(message.channel, channel);
            player.connect(true);
        }

        if (channel.id !== player.voiceChannel) {
            player.setVoiceChannel(channel.id);
            player.connect();
        }

        message.reply({
            embeds: [
                client.Embed(`:thumbsup: | **Successfully joined <#${channel.id}>!**`),
            ],
        });
    }
}