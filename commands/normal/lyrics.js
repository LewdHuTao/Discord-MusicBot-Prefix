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
		const args = args.join(" ");

		if (!args)
			return message.reply({
				embeds: [client.ErrorEmbed("**There's nothing playing**")],
			});

		await message.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("🔎 | **Searching...**"),
			],
		});

		let player;
		if (client.manager) {
			player = client.manager.players.get(message.guild.id);
		} else {
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("Lavalink node is not connected"),
				],
			});
		}

		let currentTitle = ``;
		const phrasesToRemove = [
			"Full Video",
			"Full Audio",
			"Official Music Video",
			"Lyrics",
			"Lyrical Video",
			"Feat.",
			"Ft.",
			"Official",
			"Audio",
			"Video",
			"HD",
			"4K",
			"Remix",
			"Extended",
			"DJ Edit",
			"with Lyrics",
			"Lyrics",
			"Karaoke",
			"Instrumental",
			"Live",
			"Acoustic",
			"Cover",
			"\\(feat\\. .*\\)",
		];
		if (!args) {
			currentTitle = player.queue.current.title;
			currentTitle = currentTitle
				.replace(new RegExp(phrasesToRemove.join("|"), "gi"), "")
				.replace(/\s*([\[\(].*?[\]\)])?\s*(\|.*)?\s*(\*.*)?$/, "");
		}
		let query = args ? args : currentTitle;
		let lyricsResults = [];

		lyricsApi
			.search(query)
			.then(async (lyricsData) => {
				if (lyricsData.length !== 0) {
					for (let i = 0; i < client.config.lyricsMaxResults; i++) {
						if (lyricsData[i]) {
							lyricsResults.push({
								label: `${lyricsData[i].title}`,
								description: `${lyricsData[i].artist}`,
								value: i.toString(),
							});
						} else {
							break;
						}
					}

					const menu = new MessageActionRow().addComponents(
						new MessageSelectMenu()
							.setCustomId("choose-lyrics")
							.setPlaceholder("Choose a song")
							.addOptions(lyricsResults)
					);

					let selectedLyrics = await message.reply({
						embeds: [
							new MessageEmbed()
								.setColor(client.config.embedColor)
								.setDescription(
									`Here are some of the results I found for \`${query}\`. Please choose a song to display lyrics within \`30 seconds\`.`
								),
						],
						components: [menu],
					});

					const filter = (button) =>
						button.user.id === message.author.id;

					const collector =
						selectedLyrics.createMessageComponentCollector({
							filter,
							time: 30000,
						});

					collector.on("collect", async (message) => {
						if (message.isSelectMenu()) {
							await message.deferUpdate();
							const url =
								lyricsData[
									parseInt(message.values[0])
								].url;

							lyricsApi.find(url).then((lyrics) => {
								let lyricsText = lyrics.lyrics;

								const button =
									new MessageActionRow().addComponents(
										new MessageButton()
											.setCustomId(
												"tipsbutton"
											)
											.setLabel(
												"Tips"
											)
											.setEmoji(
												`📌`
											)
											.setStyle(
												"SECONDARY"
											),
										new MessageButton()
											.setLabel(
												"Source"
											)
											.setURL(url)
											.setStyle(
												"LINK"
											)
									);

								const musixmatch_icon =
									"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Musixmatch_logo_icon_only.svg/480px-Musixmatch_logo_icon_only.svg.png";
								let lyricsEmbed = new MessageEmbed()
									.setColor(
										client.config
											.embedColor
									)
									.setTitle(`${lyrics.name}`)
									.setURL(url)
									.setThumbnail(lyrics.icon)
									.setFooter({
										text: "Lyrics provided by MusixMatch.",
										iconURL: musixmatch_icon,
									})
									.setDescription(lyricsText);

								if (lyricsText.length === 0) {
									lyricsEmbed
										.setDescription(
											`**Unfortunately we're not authorized to show these lyrics.**`
										)
										.setFooter({
											text: "Lyrics is restricted by MusixMatch.",
											iconURL: musixmatch_icon,
										});
								}

								if (lyricsText.length > 4096) {
									lyricsText =
										lyricsText.substring(
											0,
											4050
										) + "\n\n[...]";
									lyricsEmbed.setDescription(
										lyricsText +
											`\nTruncated, the lyrics were too long.`
									);
								}

								return message.reply({
									embeds: [lyricsEmbed],
									components: [button],
								});
							});
						}
					});

					collector.on("end", async (i) => {
						if (i.size == 0) {
							selectedLyrics.edit({
								content: null,
								embeds: [
									new MessageEmbed()
										.setDescription(
											`No song is selected. You took too long to select a track.`
										)
										.setColor(
											client
												.config
												.embedColor
										),
								],
								components: [],
							});
						}
					});
				} else {
					const button = new MessageActionRow().addComponents(
						new MessageButton()
							.setEmoji(`📌`)
							.setCustomId("tipsbutton")
							.setLabel("Tips")
							.setStyle("SECONDARY")
					);
					return message.reply({
						embeds: [
							new MessageEmbed()
								.setColor("RED")
								.setDescription(
									`No results found for \`${query}\`!\nMake sure you typed in your search correctly.`
								),
						],
						components: [button],
					});
				}
			})
			.catch((err) => {
				console.error(err);
				return message.reply({
					embeds: [
						new MessageEmbed()
							.setColor("RED")
							.setDescription(
								`An unknown error has occured, please check your console.`
							),
					],
				});
			});

		const collector = message.channel.createMessageComponentCollector({
			time: 1000 * 3600,
		});

		collector.on("collect", async (message) => {
			if (message.customId === "tipsbutton") {
				await message.deferUpdate();
				await message.reply({
					embeds: [
						new MessageEmbed()
							.setTitle(`Lyrics Tips`)
							.setColor(client.config.embedColor)
							.setDescription(
								`Here is some tips to get your song lyrics correctly \n\n\
									1. Try to add the artist's name in front of the song name.\n\
									2. Try to search the lyrics manually by providing the song query using your keyboard.\n\
									3. Avoid searching lyrics in languages other than English.`
							),
					],
					components: [],
				});
			}
		});
	},
};
