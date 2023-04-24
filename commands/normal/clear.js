const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "clear",
    category: "Music",
    description: "Clear all queued songs from queue",
    args: false,
    usage: "",
    permission: [],
    aliases: ["cl"],

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
						.setDescription("Nothing is playing right now."),
				],
				ephemeral: true,
			});
		}
		
		if (!player.queue || !player.queue.length || player.queue.length === 0) {
			let cembed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription("❌ | **Invalid, Not enough track to be cleared.**");
			
			return message.reply({ embeds: [cembed], ephemeral: true });
		}
		
		player.queue.clear();
		
		let clearEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription(`✅ | **Cleared the queue!**`);
		
		return message.reply({ embeds: [clearEmbed] });
    }
}