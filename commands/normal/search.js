const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
  } = require("discord.js");

module.exports = {
    name: "search",
    category: "Music",
    description: "Search song",
    args: false,
    usage: "",
    permission: [],
    aliases: ["se"],

    run: async (message, args, client, prefix) => {

        const result = args.join(" ");

        if (!result) {
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(":x: | Please put a query to search")
                ]
            })
        }

        let player = client.manager.get(message.guild.id);

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

        if (!player) {
            player = client.manager.create({
                guild: message.guild.id,
                voiceChannel: message.member.voice.channel.id,
                textChannel: message.channel.id,
                selfDeafen: true,
            });
        }

        if (player.state !== "CONNECTED") {
            player.connect();
        }

        let res;
        const search = result;

        try {
            res = await player.search(search, message.author);
            if (res.loadType === "LOAD_FAILED") {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription("An error occured while searching for the song")
                            .setColor(client.config.embedColor),
                    ],
                    ephemeral: true,
                });
            }
        } catch (err) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setAuthor({
                            name: "An error occured while searching for the song",
                        })
                        //.setAuthor("An error occured while searching for the song")
                        .setColor(client.config.embedColor),
                ],
                ephemeral: true,
            });
        }

        if (res.loadType == "NO_MATCHES") {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(`No results found for \`${search}\``)
                        .setColor(client.config.embedColor),
                ],
                ephemeral: true,
            });
        } else {
            let max = 10;
            if (res.tracks.length < max) max = res.tracks.length;

            let resultFromSearch = [];

            res.tracks.slice(0, max).map((track) => {
                resultFromSearch.push({
                    label: `${track.title}`,
                    value: `${track.uri}`,
                });
            });

            const menus = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setCustomId("select")
                    .setPlaceholder("Select a song")
                    .addOptions(resultFromSearch)
            );

            let choosenTracks = await message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.config.embedColor)
                        .setDescription(
                            `Here are searched result I found for \`${result}\`. Please select track within \`30 seconds\``
                        ),
                ],
                components: [menus],
            });
            const filter = (button) => button.user.id === message.author.id;

            const tracksCollector = choosenTracks.createMessageComponentCollector({
                filter,
                time: 30000,
            });
            tracksCollector.on("collect", async (i) => {
                if (i.isSelectMenu()) {
                    await i.deferUpdate();
                    let uriFromCollector = i.values[0];
                    let trackForPlay;

                    trackForPlay = await player?.search(
                        uriFromCollector,
                        message.author
                    );
                    player?.queue?.add(trackForPlay.tracks[0]);
                    if (!player?.playing && !player?.paused && !player?.queue?.size)
                        player?.play();
                    i.editReply({
                        content: null,
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    `Added [${trackForPlay?.tracks[0]?.title}](${trackForPlay?.tracks[0].uri}) [${trackForPlay?.tracks[0]?.requester}]`
                                )
                                .setColor(client.config.embedColor),
                        ],
                        components: [],
                    });
                }
            });
            tracksCollector.on("end", async (i) => {
                if (i.size == 0) {
                    choosenTracks.edit({
                        content: null,
                        embeds: [
                            new MessageEmbed()
                                .setDescription(
                                    `No track selected. You took too long to select a track.`
                                )
                                .setColor(client.config.embedColor),
                        ],
                        components: [],
                    });
                }
            });
        }
    }
}