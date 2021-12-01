const { canModifyQueue } = require("../../util/Util");
const i18n = require("../../util/i18n");

module.exports = {
	name: "resume",
	aliases: ["r"],
	description: i18n.__("resume.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message) {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.lineReply(i18n.__("common.errorNotQueue")).catch(console.error);
		if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

		if (!queue.playing) {
			queue.playing = true;
			queue.connection.dispatcher.resume();
			return queue.textChannel
				.send(i18n.__mf("resume.resultNotPlaying", { author: message.author }))
				.catch(console.error);
		}

		return message.lineReply(i18n.__("resume.errorPlaying")).catch(console.error);
	}
};
