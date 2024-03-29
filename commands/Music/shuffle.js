const { enabled } = require("../../modules/music_system");
const i18n = require("../../util/i18n");

module.exports = {
	name: "shuffle",
	description: i18n.__("shuffle.description"),
	guildOnly: true,
	emoji: ":transgender_flag:",
	async execute(client, message, args) {
		if (!enabled) return message.lineReply(i18n.__("play.disabled"));
		if (!message.member.voice.channel) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (!client.player.getQueue(message)) return message.lineReply(i18n.__("common.errorNotQueue"));

		client.player.shuffle(message);
		message.channel.send(i18n.__mf("shuffle.result", { author: message.author }));
	}
};