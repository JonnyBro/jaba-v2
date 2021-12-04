const { MessageEmbed } = require("discord.js");
const { enabled } = require("../../modules/music_system");
const i18n = require("../../util/i18n");

module.exports = {
	name: "nowplaying",
	aliases: ["np"],
	description: i18n.__("nowplaying.description"),
	guildOnly: true,
	emoji: ":notepad_spiral:",
	async execute(client, message, args) {
		if (!enabled) return message.lineReply(i18n.__("play.disabled"));
		if (!message.member.voice.channel) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (!client.player.getQueue(message)) return message.lineReply(i18n.__("common.errorNotQueue"));

		const track = client.player.nowPlaying(message);
		const filters = [];
		Object.keys(client.player.getQueue(message).filters).forEach((filterName) => client.player.getQueue(message).filters[filterName]) ? filters.push(filterName) : false;
		const embed = new MessageEmbed()
			.setTitle(i18n.__("nowplaying.embedTitle"))
			.setColor("RANDOM")
			.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
			.setDescription(`**${i18n.__("nowplaying.trackTitle")}:** ${track.title}\n**${i18n.__("nowplaying.trackChannel")}:** ${track.author}\n**${i18n.__("nowplaying.requestedBy")}:** ${track.requestedBy.tag}\n**${i18n.__("nowplaying.fromPlaylist")}:** ${track.fromPlaylist ? i18n.__("common.yes") : i18n.__("common.no")}\n**${i18n.__("nowplaying.trackViews")}:** ${track.views}\n**${i18n.__("nowplaying.trackDuration")}:** ${track.duration}\n**${i18n.__("nowplaying.repeatMode")}:** ${client.player.getQueue(message).repeatMode ? i18n.__("common.yes") : i18n.__("common.no")}\n${client.player.createProgressBar(message, { timecodes: true })}`)
			.setThumbnail(track.thumbnail)
			.setTimestamp()
		message.channel.send(embed);
	}
};