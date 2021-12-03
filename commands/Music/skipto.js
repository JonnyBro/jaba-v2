const { canModifyQueue } = require("../../util/util");
const i18n = require("../../util/i18n");

module.exports = {
	name: "skipto",
	aliases: ["st"],
	description: i18n.__("skipto.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message, args) {
		if (!args.length || isNaN(args[0]))
			return message.lineReply(i18n.__mf("skipto.usageReply", { prefix: client.prefix, name: module.exports.name }))
				.catch(console.error);

		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(i18n.__("common.errorNotQueue")).catch(console.error);
		if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");
		if (args[0] > queue.songs.length)
			return message.lineReply(i18n.__mf("skipto.errorNotValid", { length: queue.songs.length }))
				.catch(console.error);

		queue.playing = true;

		if (queue.loop) {
			for (let i = 0; i < args[0] - 2; i++) {
				queue.songs.push(queue.songs.shift());
			}
		} else {
			queue.songs = queue.songs.slice(args[0] - 2);
		}

		queue.connection.dispatcher.end();
		queue.textChannel
			.send(i18n.__mf("skipto.result", { author: message.author, arg: args[0] - 1 }))
			.catch(console.error);
	}
};
