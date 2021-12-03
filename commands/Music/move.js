const move = require("array-move");
const { canModifyQueue } = require("../../util/util");
const i18n = require("../../util/i18n");

module.exports = {
	name: "move",
	aliases: ["mv"],
	description: i18n.__("move.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message, args) {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.lineReply(i18n.__("common.errorNotQueue")).catch(console.error);
		if (!canModifyQueue(message.member)) return message.lineReply(i18n.__("common.errorNotChannel"));

		if (!args.length) return message.lineReply(i18n.__mf("move.usagesReply", { prefix: client.prefix }));
		if (isNaN(args[0]) || args[0] <= 1) return message.lineReply(i18n.__mf("move.usagesReply", { prefix: client.prefix }));

		let song = queue.songs[args[0] - 1];

		queue.songs = move(queue.songs, args[0] - 1, args[1] == 1 ? 1 : args[1] - 1);
		queue.textChannel.send(
			i18n.__mf("move.result", {
				author: message.author,
				title: song.title,
				index: args[1] == 1 ? 1 : args[1]
			})
		);
	}
};