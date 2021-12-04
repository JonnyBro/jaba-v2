const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "hentai",
	description: i18n.__("hentai.description"),
	usage: "[категория (опционально)/help]",
	emoji: ":smiling_imp:",
	cooldown: 1,
	guildOnly: true,
	async execute(client, message, args) {
		if (!message.channel.nsfw) return message.lineReply(i18n.__("hentai.nsfwOnly"));

		var gif = null;
		const embed = new MessageEmbed()
				.setTitle(i18n.__mf("hentai.here", { name: message.author.tag }))
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()

		switch(args[0]) {
			case "neko":
				gif = await fetch("https://nekos.life/api/v2/img/nsfw_neko_gif").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "cum":
				gif = await fetch("https://nekos.life/api/v2/img/cum").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "solo":
				gif = await fetch("https://nekos.life/api/v2/img/solo").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "anal":
				gif = await fetch("https://nekos.life/api/v2/img/anal").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "yuri":
				gif = await fetch("https://nekos.life/api/v2/img/yuri").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "blowjob":
				gif = await fetch("https://nekos.life/api/v2/img/bj").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "bj":
				gif = await fetch("https://nekos.life/api/v2/img/bj").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "pussy":
				gif = await fetch("https://nekos.life/api/v2/img/pussy").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "classic":
				gif = await fetch("https://nekos.life/api/v2/img/hentai").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "futa":
				gif = await fetch("https://nekos.life/api/v2/img/futanari").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "futanari":
				gif = await fetch("https://nekos.life/api/v2/img/futanari").then(response => response.json());
				embed.setImage(gif.url)
			break;

			case "help":
				embed.setTitle(i18n.__("hentai.awailableCategories"))
				embed.setDescription(i18n.__("hentai.categories"))
			break;

			default:
				gif = await fetch("https://nekos.life/api/v2/img/Random_hentai_gif").then(response => response.json());
				embed.setImage(gif.url)
				embed.setDescription(i18n.__mf("hentai.noCategory", { prefix: client.prefix }))
		}

		return message.channel.send(embed);
	}
};