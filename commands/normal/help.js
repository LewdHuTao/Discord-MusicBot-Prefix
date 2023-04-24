const { MessageEmbed } = require("discord.js");
const LoadCommands = require("../../util/loadCommands");

module.exports = {
    name: "help",
    category: "Util",
    description: "Shows all available commands",
    args: false,
    usage: "",
    permission: [],
    aliases: ["cmd", "cmds"],

    run: async (message, args, client, prefix) => {

        // map the commands name and description to the embed
        const commands = await LoadCommands().then((cmds) => {
            return [].concat(cmds.slash).concat(cmds.context);
        });
        // from commands remove the ones that hae no description
        const filteredCommands = commands.filter((cmd) => cmd.description);

        // create the embed
        const helpEmbed = new MessageEmbed()
            .setAuthor({
                name: `Commands of ${client.user.username}`,
                iconURL: client.config.iconURL,
                url: client.config.website,
            })
            .setColor(client.config.embedColor)
            .setDescription(
                filteredCommands
                    .map((cmd) => {
                        return `\`${prefix}${cmd.name}\` - ${cmd.description}`;
                    })
                    .join("\n") +
                "\n\n" +
                `Discord Music Bot Version: v${require("../../package.json").version
                };` +
                "\n" +
                `[✨ Support Server](${ client.config.supportServer }) | [Issues](${ client.config.Issues }) | [Source](https://github.com/SudhanPlayz/Discord-MusicBot/tree/v5) | [Invite Me](https://discord.com/oauth2/authorize?client_id=${ client.config.clientId }&permissions=${ client.config.permissions }&scope=bot%20applications.commands)`
            );
        // Do not change the Source code link.
        return message.reply({ embeds: [helpEmbed], ephemeral: true });
    }
}