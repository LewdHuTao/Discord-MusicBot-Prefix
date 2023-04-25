const { MessageEmbed, message } = require("discord.js");

module.exports = {
  name: "clean",
  category: "Util",
  description: "Delete message.",
  args: false,
  usage: "",
  permission: [],
  aliases: ["purge"],

  run: async (message, args, client, prefix) => {
    const number = args.join(" ");

    if (isNaN(number)) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(":x: | Please put a valid number to set"),
        ],
      });
    }

    number = number && number < 100 ? ++number : 100;

    message.channel.messages
      .fetch({
        limit: number,
      })
      .then((messages) => {
        const botMessages = [];
        messages
          .filter((m) => m.author.id === client.user.id)
          .forEach((msg) => botMessages.push(msg));

        botMessages.shift();
        message.channel
          .bulkDelete(botMessages, true)
          .then(async (deletedMessages) => {
            //Filtering out messages that did not get deleted.
            messages = messages.filter((msg) => {
              !deletedMessages.some((deletedMsg) => deletedMsg == msg);
            });
            if (messages.size > 0) {
              client.log(
                `Deleting [${messages.size}] messages older than 14 days.`
              );
              for (const msg of messages) {
                await msg.delete();
              }
            }

            await message.reply({
              embeds: [
                client.Embed(
                  `:white_check_mark: | Deleted ${botMessages.length} bot messages`
                ),
              ],
            });
            setTimeout(() => {
              message.delete();
            }, 5000);
          });
      });
  },
};
