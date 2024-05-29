const SlashCommand = require("../../lib/SlashCommand");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { find } = require("llyrics");

const command = new SlashCommand()
  .setName("lyrics")
  .setDescription("Get the lyrics of a song")
  .addStringOption((option) =>
    option
      .setName("song")
      .setDescription("The song to get lyrics for")
      .setRequired(false)
  )
  .setRun(async (client, interaction, options) => {
    await interaction.deferReply();

    let player;
    if (client.manager) {
      player = client.manager.players.get(interaction.guild.id);
    } else {
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("Lavalink node is not connected"),
        ],
      });
    }

    const args = interaction.options.getString("song");
    if (!args && !player) {
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("There's nothing playing"),
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
      "Lyric Video",
      "Lyrics Video",
      "8K",
      "High Quality",
      "Animation Video",
      "\\(Official Video\\. .*\\)",
      "\\(Music Video\\. .*\\)",
      "\\[NCS Release\\]",
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

    function splitText(text, maxChunkLength) {
      const chunks = [];
      for (let i = 0; i < text.length; i += maxChunkLength) {
        chunks.push(text.slice(i, i + maxChunkLength));
      }
      return chunks;
    }

    let apiKey = client.config.geniusAPIKey;
    let songName = query;
    let lyrics, trackArtist, trackName, artworkURL;

    const response = await find({
      song: songName,
      forceSearch: true,
      geniusApiKey: apiKey,
    });

    if (response) {
      if (response.lyrics === undefined) {
        return interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(client.config.embedColor)
              .setDescription(":x: | No lyrics were found."),
          ],
        });
      } else {
        lyrics = response.lyrics;
        trackName = response.title;
        trackArtist = response.artist;
        artworkURL = response.artworkURL;
      }
    }

    const pageLength = 2000;
    const pages = splitText(lyrics, pageLength);
    let currentPage = 0;

    const embed = new MessageEmbed()
      .setColor(client.config.embedColor)
      .setTitle(`${trackName} - ${trackArtist}`)
      .setThumbnail(artworkURL)
      .setDescription(pages[currentPage])
      .setFooter({ text: `Page: ${currentPage + 1}/${pages.length}` });

    const but1 = new MessageButton()
      .setCustomId("prev_interaction")
      .setEmoji("◀️")
      .setStyle("PRIMARY")
      .setDisabled(currentPage === 0);

    const but2 = new MessageButton()
      .setCustomId("next_interaction")
      .setEmoji("▶️")
      .setStyle("PRIMARY")
      .setDisabled(currentPage === pages.length - 1);

    const but3 = new MessageButton()
      .setEmoji({ id: "948552310504701982" })
      .setCustomId("delete_interaction")
      .setStyle("DANGER");

    const row = new MessageActionRow().addComponents(but1, but2, but3);

    const msg = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    const filter = async (button) => {
      if (button.user.id === interaction.user.id) return true;
      else {
        return button.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.config.embedColor)
              .setDescription(
                `${client.e.crossMark} | This interaction button is only for <@${interaction.user.id}>.`
              ),
          ],
        });
      }
    };

    const collector = msg.createMessageComponentCollector({ filter });

    collector.on("collect", async (i) => {
      if (i.customId === "delete_interaction") {
        await i.deferUpdate();
        i.deleteReply().catch((err) => {
          return;
        });
        msg.delete().catch((err) => {
          return;
        });
      }
      if (i.customId === "next_interaction") {
        currentPage++;
        if (currentPage < pages.length) {
          const newEmbed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`${trackName} - ${trackArtist}`)
            .setDescription(pages[currentPage])
            .setFooter({
              text: `Page: ${currentPage + 1}/${pages.length}`,
            });

          const newBut1 = new MessageButton()
            .setCustomId("prev_interaction")
            .setEmoji("◀️")
            .setStyle("PRIMARY")
            .setDisabled(currentPage === 0);

          const newBut2 = new MessageButton()
            .setCustomId("next_interaction")
            .setEmoji("▶️")
            .setStyle("PRIMARY")
            .setDisabled(currentPage === pages.length - 1);

          const newRow = new MessageActionRow().addComponents(
            newBut1,
            newBut2,
            but3
          );

          await i.update({
            embeds: [newEmbed],
            components: [newRow],
          });
        }
      } else if (i.customId === "prev_interaction") {
        currentPage--;
        if (currentPage >= 0) {
          const newEmbed = new MessageEmbed()
            .setColor(client.config.embedColor)
            .setTitle(`${trackName} - ${trackArtist}`)
            .setDescription(pages[currentPage])
            .setFooter({
              text: `Page: ${currentPage + 1}/${pages.length}`,
            });

          const newBut1 = new MessageButton()
            .setCustomId("prev_interaction")
            .setEmoji("◀️")
            .setStyle("PRIMARY")
            .setDisabled(currentPage === 0);

          const newBut2 = new MessageButton()
            .setCustomId("next_interaction")
            .setEmoji("▶️")
            .setStyle("PRIMARY")
            .setDisabled(currentPage === pages.length - 1);

          const newRow = new MessageActionRow().addComponents(
            newBut1,
            newBut2,
            but3
          );

          await i.update({
            embeds: [newEmbed],
            components: [newRow],
          });
        }
      }
    });
  });

module.exports = command;
