const { enabled } = require("../../modules/music_system");
const i18n = require("../../util/i18n");

module.exports = {
	name: "skip",
	description: i18n.__("skip.description"),
	guildOnly: true,
	emoji: ":middle_finger:",
	async execute(client, message, args) {
		if (!enabled) return message.lineReply(i18n.__("play.disabled"));
		if (!message.member.voice.channel) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (!client.player.getQueue(message)) return message.lineReply(i18n.__("common.errorNotQueue"));

		client.player.skip(message);
		message.channel.send(i18n.__mf("play.skipSong", { author: message.author }));
	}
};