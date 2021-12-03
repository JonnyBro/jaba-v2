const { canModifyQueue } = require("../../util/util");
const i18n = require("../../util/i18n");

module.exports = {
	name: "volume",
	aliases: ["v"],
	description: i18n.__("volume.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message, args) {
		const queue = client.queue.get(message.guild.id);

		if (!queue) return message.lineReply(i18n.__("common.errorNotQueue")).catch(console.error);
		if (!canModifyQueue(message.member)) return message.lineReply(i18n.__("common.errorNotChannel")).catch(console.error);

		if (!args[0]) return message.lineReply(i18n.__mf("volume.currentVolume", { volume: queue.volume })).catch(console.error);
		if (isNaN(args[0])) return message.lineReply(i18n.__("volume.errorNotNumber")).catch(console.error);
		if (Number(args[0]) > 100 || Number(args[0]) < 0) return message.lineReply(i18n.__("volume.errorNotValid")).catch(console.error);

		queue.volume = args[0];
		queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
		return queue.textChannel.send(i18n.__mf("volume.result", { arg: args[0] })).catch(console.error);
	}
};