const { canModifyQueue } = require("../../util/util");
const i18n = require("../../util/i18n");

module.exports = {
	name: "skip",
	aliases: ["s"],
	description: i18n.__("skip.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message) {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.lineReply(i18n.__("common.errorNotQueue")).catch(console.error);
		if (!canModifyQueue(message.member)) return message.lineReply(i18n.__("common.errorNotChannel"));

		queue.loopSong = false;
		queue.playing = true;
		queue.connection.dispatcher.end();
		queue.textChannel.send(i18n.__mf("skip.result", { author: message.author })).catch(console.error);
	}
};