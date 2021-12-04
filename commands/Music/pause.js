const { enabled } = require("../../modules/music_system");
const i18n = require("../../util/i18n");

module.exports = {
	name: "pause",
	description: i18n.__("pause.description"),
	guildOnly: true,
	emoji: ":play_pause:",
	async execute(client, message, args) {
		if (!enabled) return message.channel.send(i18n.__("play.disabled"));
		if (!message.member.voice.channel) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (!client.player.getQueue(message)) return message.lineReply(i18n.__("common.errorNotQueue"));

		if (!client.player.getQueue(message).paused) {
			client.player.pause(message);
		} else {
			client.player.resume(message);
		};
	}
};