const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "lyrics",
    category: "Music",
    description: "Get lyrics from a song",
    args: false,
    usage: "",
    permission: [],
    aliases: ["lyric"],

    run: async (message, args, client, prefix) => {

        const opt = args.join(" ");

        let player = client.manager.players.get(message.guild.id);

        if (!opt && !player)
            return message.reply({
                embeds: [client.ErrorEmbed("**There's nothing playing**")],
            });

        // if no input, search for the current song. if no song console.log("No song input");
        let search = opt ? opt : player.queue.current.title;
        let url = `https://api.darrennathanael.com/lyrics?song=${search}`;
        let url2 = `https://api.darrennathanael.com/lyrics-genius?song=${search}`;
        // get the lyrics
        let lyrics = await fetch(url).then((res) => res.json());

        // check if the response is 200
        try {
            if (lyrics.response !== 200) {
                let lyrics2 = await fetch(url2).then((res) => res.json());
                if (lyrics2.response !== 200) {
                    let noLyrics = new MessageEmbed()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `❌ | No lyrics found for ${search}! Please try again.`
                        );
                    return message.reply({ embeds: [noLyrics], ephemeral: true });
                } else {
                    let embed = new MessageEmbed()
                        .setColor(client.config.embedColor)
                        .setTitle(`${lyrics2.full_title}`)
                        .setURL(lyrics2.url)
                        .setThumbnail(lyrics2.thumbnail)
                        .setDescription(lyrics2.lyrics);
                    return message.reply({ embeds: [embed], ephemeral: false });
                }
            }
            // if the response is 200
            let embed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setTitle(`${lyrics.full_title}`)
                .setURL(lyrics.url)
                .setThumbnail(lyrics.thumbnail)
                .setDescription(lyrics.lyrics);
            return message.reply({ embeds: [embed], ephemeral: false });
        } catch (err) {
            let noLyrics = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    `❌ | No lyrics found for ${search}! Please try again.`
                );
            return message.reply({ embeds: [noLyrics], ephemeral: true });
        }
    }
}