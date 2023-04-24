const { MessageEmbed } = require("discord.js");
const colors = require("colors");

module.exports = {
    name: "autoqueue",
    category: "Music",
    description: "Auto add song to the queue",
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
						.setDescription("There's nothing playing in the queue"),
				],
				ephemeral: true,
			});
		}
		
		let autoQueueEmbed = new MessageEmbed().setColor(client.config.embedColor);
		const autoQueue = player.get("autoQueue");
		player.set("requester", message.guild.members.me);
		
		if (!autoQueue || autoQueue === false) {
			player.set("autoQueue", true);
		} else {
			player.set("autoQueue", false);
		}
		autoQueueEmbed
		  .setDescription(`**Auto Queue is** \`${!autoQueue ? "ON" : "OFF"}\``)
		  .setFooter({
		    text: `Related music will ${!autoQueue ? "now be automatically" : "no longer be"} added to the queue.`
      });
		client.warn(
			`Player: ${ player.options.guild } | [${ colors.blue(
				"AUTOQUEUE",
			) }] has been [${ colors.blue(!autoQueue? "ENABLED" : "DISABLED") }] in ${
				client.guilds.cache.get(player.options.guild)
					? client.guilds.cache.get(player.options.guild).name
					: "a guild"
			}`,
		);
		
		return message.reply({ embeds: [autoQueueEmbed] });
    }
}
