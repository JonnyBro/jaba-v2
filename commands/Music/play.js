const { enabled } = require("../../modules/music_system");
const i18n = require("../../util/i18n");

module.exports = {
	name: "play",
	description: i18n.__("play.description"),
	usage: "[search query]",
	aliases: ["add", "push", "p"],
	emoji: ":play_pause:",
	guildOnly: true,
	async execute(client, message, args) {
		if (!enabled) return message.channel.send(i18n.__("play.disabled"));
		if (!message.member.voice.channel) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));

		client.player.play(message, args.join(" "));
	}
};