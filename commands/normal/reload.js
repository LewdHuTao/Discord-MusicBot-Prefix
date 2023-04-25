const { MessageEmbed, message } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "reload",
  category: "Util",
  description: "Reload all commands",
  args: false,
  usage: "",
  permission: [],
  aliases: ["rel"],

  run: async (message, args, client, prefix) => {
    if (message.author.id === client.config.adminId) {
      try {
        let ContextCommandsDirectory = path.join(__dirname, "..", "context");
        fs.readdir(ContextCommandsDirectory, (err, files) => {
          files.forEach((file) => {
            delete require.cache[
              require.resolve(ContextCommandsDirectory + "/" + file)
            ];
            let cmd = require(ContextCommandsDirectory + "/" + file);
            if (!cmd.command || !cmd.run) {
              return this.warn(
                "❌ Unable to load Command: " +
                  file.split(".")[0] +
                  ", File doesn't have either command/run"
              );
            }
            client.contextCommands.set(file.split(".")[0].toLowerCase(), cmd);
          });
        });

        let SlashCommandsDirectory = path.join(__dirname, "..", "slash");
        fs.readdir(SlashCommandsDirectory, (err, files) => {
          files.forEach((file) => {
            delete require.cache[
              require.resolve(SlashCommandsDirectory + "/" + file)
            ];
            let cmd = require(SlashCommandsDirectory + "/" + file);

            if (!cmd || !cmd.run) {
              return client.warn(
                "❌ Unable to load Command: " +
                  file.split(".")[0] +
                  ", File doesn't have a valid command with run function"
              );
            }
            client.slashCommands.set(file.split(".")[0].toLowerCase(), cmd);
          });
        });

        const totalCmds =
          client.slashCommands.size + client.contextCommands.size;
        client.log(`Reloaded ${totalCmds} commands!`);
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor(client.config.embedColor)
              .setDescription(`Sucessfully Reloaded \`${totalCmds}\` Commands!`)
              .setFooter({
                text: `${client.user.username} was reloaded by ${message.user.username}`,
              })
              .setTimestamp(),
          ],
          ephemeral: true,
        });
      } catch (err) {
        console.log(err);
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor(client.config.embedColor)
              .setDescription(
                "An error has occured. For more details please check console."
              ),
          ],
          ephemeral: true,
        });
      }
    } else {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(client.config.embedColor)
            .setDescription("You are not authorized to use this command!"),
        ],
      });
    }
  },
};
