const { MessageEmbed } = require("discord.js");
const { enabled } = require("../../modules/music_system");
const i18n = require("../../util/i18n");

module.exports = {
	name: "queue",
	description: i18n.__("queue.description"),
	aliases: ["q"],
	guildOnly: true,
	emoji: ":notepad_spiral:",
	async execute(client, message, args) {
		if (!enabled) return message.lineReply(i18n.__("play.disabled"));
		if (!message.member.voice.channel) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));
		if (!client.player.getQueue(message)) return message.lineReply(i18n.__("common.errorNotQueue"));

		let queue = client.player.getQueue(message).tracks.map((tracks, i) => {
			return `${i === 0 ? `**${i18n.__("queue.embedCurrentSong")}:**` : `**${i + 1}.**`} **\`${tracks.title}\`** : ${tracks.author}`
		}).join("\n");

		const embed = new MessageEmbed()
			.setTitle(i18n.__("queue.embedTitle"))
			.setColor("RANDOM")
			.setDescription(queue)
			.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
			.setTimestamp()
		message.channel.send(embed);
	},
};
