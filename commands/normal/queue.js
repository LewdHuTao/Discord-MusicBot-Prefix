const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const load = require("lodash");
const pms = require("pretty-ms");

module.exports = {
    name: "queue",
    category: "Music",
    description: "Shows all queued songs",
    args: false,
    usage: "",
    permission: [],
    aliases: ["q"],

    run: async (message, args, client, prefix) => {

        let player = client.manager.players.get(message.guild.id);
        if (!player) {
            const QueueEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "There's nothing playing in the queue"
                );
            return message.reply({ embeds: [QueueEmbed], ephemeral: true });
        }

        if (!message.member.voice.channel) {
            const JoinEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "You have to join voice channel first before you can use this command"
                );
            return message.reply({ embeds: [JoinEmbed], ephemeral: true });
        }

        if (
            message.guild.me.voice.channel &&
            !message.guild.me.voice.channel.equals(
                message.member.voice.channel
            )
        ) {
            const SameEmbed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(
                    "You must be in the same voice channel as me first before you can use this command"
                );
            return message.reply({ embeds: [SameEmbed], ephemeral: true });
        }

        if (player.queue.length === "0" || !player.queue.length) {
            let song = player.queue.current;
            const embed = new MessageEmbed()
                .setColor(client.config.embedColor)
                .setDescription(`Now playing:** [${song.title}](${song.uri})`)
                .addFields(
                    {
                        name: "Duration",
                        value: `\`${pms(player.position, { colonNotation: true })} / ${pms(
                            player.queue.current.duration,
                            { colonNotation: true }
                        )}\``,
                        inline: true,
                    },
                    {
                        name: "Volume",
                        value: `\`${player.volume}\``,
                        inline: true,
                    },
                    {
                        name: "Total Tracks",
                        value: `\`${player.queue.totalSize - 1}\``,
                        colonNotation: true,
                        inline: true,
                    }
                );
            await message.channel.send({
                embeds: [embed]
            }).catch(() => { });
        } else {
            const queuedSongs = player.queue.map(
                (t, i) => `\` ${++i} \` [${t.title}](${t.uri}) [${t.requester}]`
            );

            const mapping = load.chunk(queuedSongs, 10);
            const pages = mapping.map((s) => s.join("\n"));
            let page = 0;

            if (player.queue.size < 11) {
                let song = player.queue.current;
                const embed = new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(
                        `Now playing:** [${song.title}](${song.uri}) [${player.queue.current.requester}]\n\n**Queued Tracks**\n${pages[page]}`
                    )
                    .addFields(
                        {
                            name: "Track Duration",
                            value: `\`${pms(player.position, {
                                colonNotation: true,
                            })} / ${pms(player.queue.current.duration, {
                                colonNotation: true,
                            })}\``,
                            inline: true,
                        },
                        {
                            name: "Total Tracks Duration",
                            value: `\`${pms(player.position, {
                                colonNotation: true,
                            })} / ${pms(player.queue.duration, { colonNotation: true })}\``,
                            inline: true,
                        },
                        {
                            name: "Total Tracks",
                            value: `\`${player.queue.totalSize - 1}\``,
                            colonNotation: true,
                            inline: true,
                        }
                    )
                    .setFooter({
                        text: `Page ${page + 1}/${pages.length}`,
                    });

                await message.channel.send({
                    embeds: [embed]
                })
            } else {
                let song = player.queue.current;
                const embed2 = new MessageEmbed()
                    .setColor(client.config.embedColor)
                    .setDescription(
                        `Now playing:** [${song.title}](${song.uri}) [${player.queue.current.requester}]\n\n**Queued Tracks**\n${pages[page]}`
                    )
                    .addFields(
                        {
                            name: "Track Duration",
                            value: `\`${pms(player.position, {
                                colonNotation: true,
                            })} / ${pms(player.queue.current.duration, {
                                colonNotation: true,
                            })}\``,
                            inline: true,
                        },
                        {
                            name: "Total Tracks Duration",
                            value: `\`${pms(player.position, {
                                colonNotation: true,
                            })} / ${pms(player.queue.duration, { colonNotation: true })}\``,
                            inline: true,
                        },
                        {
                            name: "Total Tracks",
                            value: `\`${player.queue.totalSize - 1}\``,
                            colonNotation: true,
                            inline: true,
                        }
                    )
                    .setFooter({
                        text: `Page ${page + 1}/${pages.length}`,
                    });

                const but1 = new MessageButton()
                    .setCustomId("queue_cmd_but_1")

                    .setEmoji("▶️")
                    .setStyle("PRIMARY")

                const but2 = new MessageButton()
                    .setCustomId("queue_cmd_but_2")
                    .setEmoji("◀️")
                    .setStyle("PRIMARY")

                const row1 = new MessageActionRow().addComponents([
                    but2, but1
                ]);

                const msg = await message.channel.send({
                    embeds: [embed2],
                    components: [row1]
                })

                const collector = message.channel.createMessageComponentCollector({
                    filter: (b) => {
                        if (b.user.id === message.author.id) return true;
                        else {
                            b.reply({
                                ephemeral: true,
                                content:    `Only **${message.author.tag}** can use this button. Run this command if you want to use this button`,
                            });
                            return false;
                        };
                    },
                });

                collector.on("collect", async (button) => {
                    if (button.customId === "queue_cmd_but_1") {
                        await button.deferUpdate().catch(() => { });
                        page = page + 1 < pages.length ? ++page : 0;

                        let song = player.queue.current;
                        const embed3 = new MessageEmbed()
                            .setColor(client.config.embedColor)
                            .setDescription(
                                `Now playing:** [${song.title}](${song.uri}) [${player.queue.current.requester}]\n\n**Queued Tracks**\n${pages[page]}`
                            )
                            .addFields(
                                {
                                    name: "Track Duration",
                                    value: `\`${pms(player.position, {
                                        colonNotation: true,
                                    })} / ${pms(player.queue.current.duration, {
                                        colonNotation: true,
                                    })}\``,
                                    inline: true,
                                },
                                {
                                    name: "Total Tracks Duration",
                                    value: `\`${pms(player.position, {
                                        colonNotation: true,
                                    })} / ${pms(player.queue.duration, { colonNotation: true })}\``,
                                    inline: true,
                                },
                                {
                                    name: "Total Tracks",
                                    value: `\`${player.queue.totalSize - 1}\``,
                                    colonNotation: true,
                                    inline: true,
                                }
                            )
                            .setFooter({
                                text: `Page ${page + 1}/${pages.length}`,
                            });

                        await msg.edit({
                            embeds: [embed3],
                            components: [new MessageActionRow().addComponents(but2, but1)]
                        })
                    } else if (button.customId === "queue_cmd_but_2") {
                        await button.deferUpdate().catch(() => { });
                        page = page > 0 ? --page : pages.length - 1;

                        let song = player.queue.current;
                        const embed4 = new MessageEmbed()
                            .setColor(client.config.embedColor)
                            .setDescription(
                                `Now playing:** [${song.title}](${song.uri}) [${player.queue.current.requester}]\n\n**Queued Tracks**\n${pages[page]}`
                            )
                            .addFields(
                                {
                                    name: "Track Duration",
                                    value: `\`${pms(player.position, {
                                        colonNotation: true,
                                    })} / ${pms(player.queue.current.duration, {
                                        colonNotation: true,
                                    })}\``,
                                    inline: true,
                                },
                                {
                                    name: "Total Tracks Duration",
                                    value: `\`${pms(player.position, {
                                        colonNotation: true,
                                    })} / ${pms(player.queue.duration, { colonNotation: true })}\``,
                                    inline: true,
                                },
                                {
                                    name: "Total Tracks",
                                    value: `\`${player.queue.totalSize - 1}\``,
                                    colonNotation: true,
                                    inline: true,
                                }
                            )
                            .setFooter({
                                text: `Page ${page + 1}/${pages.length}`,
                            });

                        await msg.edit({
                            embeds: [embed4],
                            components: [new MessageActionRow().addComponents(but2, but1)]
                        }).catch(() => { });
                    } else return;
                });
            }
        }
    }
};