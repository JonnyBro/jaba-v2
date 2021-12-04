const { enabled } = require("../../modules/music_system");
const i18n = require("../../util/i18n");

module.exports = {
	name: "seek",
	description: i18n.__("seek.description"),
	usage: "[время в секундах]",
	guildOnly: true,
	emoji: ":see_no_evil:",
	async execute(client, message, args) {
		if (!enabled) return message.lineReply(i18n.__("play.disabled"));
		if (!message.member.voice.channel) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (!client.player.getQueue(message)) return message.lineReply(i18n.__("common.errorNotQueue"));

		client.player.seek(message, args[0]);
		message.channel.send(i18n.__mf("seek.result", { author: message.author, seconds: args[0] }))
	}
};