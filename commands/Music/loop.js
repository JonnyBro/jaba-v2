const { canModifyQueue } = require("../../util/util");
const i18n = require("../../util/i18n");

module.exports = {
	name: "loop",
	aliases: ["l"],
	description: i18n.__("loop.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message) {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.lineReply(i18n.__("common.errorNotQueue")).catch(console.error);
		if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

		queue.loopSong = false;
		queue.loop = !queue.loop;
		return queue.textChannel
			.send(i18n.__mf("loop.result", { loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") }))
			.catch(console.error);
	}
};