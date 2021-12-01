const { canModifyQueue } = require("../../util/Util");
const i18n = require("../../util/i18n");

module.exports = {
	name: "stop",
	description: i18n.__("stop.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message) {
		const queue = client.queue.get(message.guild.id);

		if (!queue) return message.lineReply(i18n.__("common.errorNotQueue")).catch(console.error);
		if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

		queue.songs = [];
		queue.connection.dispatcher.end();
		queue.textChannel.send(i18n.__mf("stop.result", { author: message.author })).catch(console.error);
	}
};
