const { MessageEmbed } = require("discord.js");
const colors = require("colors");

module.exports = {
    name: "247",
    category: "Music",
    description: "247 toggle",
    args: false,
    usage: "",
    permission: [],
    aliases: [],

    run: async (message, args, client, prefix) => {

        let channel = await client.getChannel(client, message);
		if (!channel) {
			return;
		}
		
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
		
		if (!player) {
			return message.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription("There's nothing to play 24/7."),
				],
				ephemeral: true,
			});
		}
		
		let twentyFourSevenEmbed = new MessageEmbed().setColor(
			client.config.embedColor,
		);
		const twentyFourSeven = player.get("twentyFourSeven");
		
		if (!twentyFourSeven || twentyFourSeven === false) {
			player.set("twentyFourSeven", true);
		} else {
			player.set("twentyFourSeven", false);
		}
		twentyFourSevenEmbed
		  .setDescription(`**24/7 mode is** \`${!twentyFourSeven ? "ON" : "OFF"}\``)
		  .setFooter({
		    text: `The bot will ${!twentyFourSeven ? "now" : "no longer"} stay connected to the voice channel 24/7.`
      });
		client.warn(
			`Player: ${ player.options.guild } | [${ colors.blue(
				"24/7",
			) }] has been [${ colors.blue(
				!twentyFourSeven? "ENABLED" : "DISABLED",
			) }] in ${
				client.guilds.cache.get(player.options.guild)
					? client.guilds.cache.get(player.options.guild).name
					: "a guild"
			}`,
		);
		
		if (!player.playing && player.queue.totalSize === 0 && twentyFourSeven) {
			player.destroy();
		}
		
		return message.reply({ embeds: [twentyFourSevenEmbed] });
    }
}