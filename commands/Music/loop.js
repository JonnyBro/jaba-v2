const { enabled } = require("../../modules/music_system");
const i18n = require("../../util/i18n");

module.exports = {
	name: "loop",
	description: i18n.__("loop.description"),
	usage: "[queue/song]",
	guildOnly: true,
	async execute(client, message, args) {
		if (!enabled) return message.lineReply(i18n.__("play.disabled"));
		if (!args[0]) return;
		if (!message.member.voice.channel) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (!client.player.getQueue(message)) return message.lineReply(i18n.__("common.errorNotQueue"));

		if (args[0].toLowerCase() == "queue") {
			if (!client.player.getQueue(message).loopMode) {
				client.player.setLoopMode(message, true);
				message.channel.send(i18n.__mf("play.loopQueue", { author: message.author, loop: client.player.getQueue(message).loopMode ? i18n.__("common.on") : i18n.__("common.off") }));
			} else {
				client.player.setLoopMode(message, false);
				message.channel.send(i18n.__mf("play.loopQueue", { author: message.author, loop: client.player.getQueue(message).loopMode ? i18n.__("common.on") : i18n.__("common.off") }));
			};
		} else if (args[0].toLowerCase() == "song") {
			if (!client.player.getQueue(message).repeatMode) {
				client.player.setRepeatMode(message, true);
				message.channel.send(i18n.__mf("play.loopSong", { author: message.author, loop: client.player.getQueue(message).repeatMode ? i18n.__("common.on") : i18n.__("common.off") }));
			} else if (args[1].toLowerCase() == "off") {
				client.player.setRepeatMode(message, false);
				message.channel.send(i18n.__mf("play.loopSong", { author: message.author, loop: client.player.getQueue(message).repeatMode ? i18n.__("common.on") : i18n.__("common.off") }));
			};
		};
	}
};