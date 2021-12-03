const moment = require("moment");
const ms = require("ms");
const { version } = require("../../package.json");
const Discord = require("discord.js");
const i18n = require("../../util/i18n");
const { BOTOWNER } = require("../../util/util");

moment.locale("ru");

module.exports = {
	name: "botinfo",
	description: i18n.__("botinfo.description"),
	aliases: ["bi"],
	guildOnly: true,
	async execute(client, message) {
		let uptime = client.uptime;
		let cd = 24 * 60 * 60 * 1000;
		let ch = 60 * 60 * 1000;
		let cm = 60 * 1000;
		let cs = 1000;
		let days = Math.floor(uptime / cd);
		let dms = days * cd;
		let hours = Math.floor((uptime - dms) / ch);
		let hms = hours * ch;
		let minutes = Math.floor((uptime - dms - hms) / cm);
		let mms = minutes * cm;
		let seconds = Math.round((uptime - dms - hms - mms) / cs);

		if (seconds == 60) {
			minutes++
			seconds = 0
		};

		if (minutes == 60) {
			hours++;
			minutes = 0
		};

		if (hours == 24) {
			days++;
			hours = 0
		};

		let dateStrings = []
		if (days == 1) {
			dateStrings.push("**1** день")
		} else if (days > 1) {
			dateStrings.push("**" + String(days) + "** дней(я)")
		};

		if (hours == 1) {
			dateStrings.push("**1** час")
		} else if (hours > 1) {
			dateStrings.push("**" + String(hours) + "** часов(а,ов)")
		};

		if (minutes == 1) {
			dateStrings.push("**1** минута")
		} else if (minutes > 1) {
			dateStrings.push("**" + String(minutes) + "** минут(ы,а)")
		};

		if (seconds == 1) {
			dateStrings.push("**1** секунда")
		} else if (seconds > 1) {
			dateStrings.push("**" + String(seconds) + "** секунд(ы,a)")
		};

		let dateString = "";
		for (var i = 0; i < dateStrings.length - 1; i++) {
			dateString += dateStrings[i];
			dateString += ", ";
		};

		if (dateStrings.length >= 2) {
			dateString = dateString.slice(0, dateString.length - 2) + dateString.slice(dateString.length - 1);
			dateString += "и ";
		};

		dateString += dateStrings[dateStrings.length - 1]

		const embed = new Discord.MessageEmbed()
			.setAuthor(`Информация о боте`)
			.setThumbnail(client.user.avatarURL() || client.user.displayavatarURL())
			.setColor(0x00ff11)

			.addField("Имя", client.user.username, true)
			.addField("Дата создания", `${moment.utc(client.user.createdAt).format("LLL")} (${ms(Date.now() - client.user.createdAt)})`, true)
			.addField("Тэг", client.user.tag, true)
			.addField("ID бота", client.user.id, true)
			.addField("Создатель", `<@${BOTOWNER}>`)
			.addField("Кол-во серверов", client.guilds.cache.filter(guild => guild.id != 892727526911258654).size, true)
			.addField("Кол-во команд", client.commands.size, true)
			.addField("Памяти использовано", `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`)
			.addField("Версия бота", `Версия от ${version}`, true)
			.addField("Версия Node.js", process.version, true)
			.addField("Пинг", `${Math.round(client.ws.ping)} ms`)
			.addField("Время работы", dateString)

			.setTimestamp()
		message.channel.send(embed);
	}
}