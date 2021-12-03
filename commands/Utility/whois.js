const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const i18n = require("../../util/i18n");

module.exports = {
	name: "whois",
	description: i18n.__("whois.description"),
	aliases: ["ip", "who"],
	usage: "[ip address]",
	emoji: ":pager:",
	async execute(client, message, args) {
		const whois = await fetch(`http://ip-api.com/json/${args[0]}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,timezone,currency,isp,org,as,mobile,proxy,hosting,query`).then(response => response.json());

		if (whois.status == "fail") {
				const embed = new MessageEmbed()
						.setColor("RED")
						.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
						.setTimestamp()
						.setTitle(`Произошла ошибка при получении данных о ${args[0]}`)
						.setDescription(whois.message)
				return message.channel.send(embed);
		};

		const embed = new MessageEmbed()
				.setTitle("Результаты")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setColor("RANDOM")
				.addFields(
					{ name: "IP", value: whois.query, inline: true },
					{ name: "Страна", value: `${whois.country || "Неизвестно"} (${whois.countryCode || "Неизвестно"})`, inline: true },
					{ name: "Регион", value: `${whois.regionName || "Неизвестно"} (${whois.region || "Неизвестно"})`, inline: true },
					{ name: "Город", value: `${whois.city || "Неизвестно"}`, inline: true },
					{ name: "Почтовый индекс", value: `${whois.zip || "Неизвестно"}`, inline: true },
					{ name: "Часовой пояс", value: `${whois.timezone || "Неизвестно"}`, inline: true },
						{ name: "Континент", value: `${whois.continent || "Неизвестно"} (${whois.continentCode || "Неизвестно"})`, inline: true },
						{ name: "Валюта", value: `${whois.currency || "Неизвестно"}`, inline: true },
						{ name: "Провайдер", value: `${whois.isp || "Неизвестно"}`, inline: true }
				)
				.setTimestamp()

				if (whois.proxy == true) {
					embed.addFields({ name: "Дополнительная информация", value: "Этот IP принадлежит Tor/VPN/Proxy" });
				} else if (whois.mobile == true) {
					embed.addFields({ name: "Дополнительная информация", value: "Этот IP используется для мобильных данных" });
				} else if (whois.hosting == true) {
					embed.addFields({ name: "Дополнительная информация", value: "Это IP принадлежит хостингу/датацентру" });
				};
		const button = new client.buttons.MessageButton()
			.setStyle("url")
			.setURL(`https://iknowwhatyoudownload.com/en/peer/?ip=${whois.query}`)
			.setLabel("История Torrent загрузок");
		message.channel.send({ buttons: [ button ], embed: embed });
	},
};