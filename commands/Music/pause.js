const { canModifyQueue } = require("../../util/util");
const i18n = require("../../util/i18n");

module.exports = {
	name: "pause",
	description: i18n.__("pause.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message) {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.lineReply(i18n.__("common.errorNotQueue")).catch(console.error);
		if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

		if (queue.playing) {
			queue.playing = false;
			queue.connection.dispatcher.pause(true);
			return queue.textChannel
				.send(i18n.__mf("pause.result", { author: message.author }))
				.catch(console.error);
		}
	}
};