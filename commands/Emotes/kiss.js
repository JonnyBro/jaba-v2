const Discord = require("discord.js");
const fetch = require("node-fetch");
const i18n = require("../../util/i18n");

module.exports = {
	name: "kiss",
	description: i18n.__("kiss.description"),
	usage: "[@user]",
	emoji: ":kiss_woman_man:",
	guildOnly: true,
	async execute(client, message, args) {
		if (message.mentions.users.first() == message.author) return message.channel.send(i18n.__("kiss.yourself"));
		if (!message.mentions.users.first()) return message.channel.send(i18n.__("common.noMention"));
		const gif = await fetch("https://nekos.life/api/v2/img/kiss").then(response => response.json());
		const embed = new Discord.MessageEmbed()
			.setTitle(`${message.author.username} ${i18n.__("kiss.kiss")} ${message.mentions.users.first().username}`)
			.setDescription(args.slice(1, args.length).join(" ") || i18n.__("kiss.default"))
			.setColor("RANDOM")
			.setTimestamp()
			.setImage(gif.url)
			.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
		message.channel.send(embed);
	},
};