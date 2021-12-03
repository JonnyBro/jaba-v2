const { MessageEmbed } = require("discord.js");
const { version } = require("../../package.json");
const { BOTOWNER } = require("../../util/util");
const moment = require("moment");
const ms = require("ms");
const i18n = require("../../util/i18n");

moment.locale("ru");

module.exports = {
	name: "botinfo",
	description: i18n.__("botinfo.description"),
	aliases: ["bi"],
	guildOnly: true,
	async execute(client, message) {
		let uptime = client.uptime;
		let seconds = Math.floor(uptime / 1000);
		let minutes = Math.floor(seconds / 60);
		let hours = Math.floor(minutes / 60);
		let days = Math.floor(hours / 24);

		seconds %= 60;
		minutes %= 60;
		hours %= 24;

		const embed = new MessageEmbed()
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
			.addField("Время работы", `${days} день(дня/дней), ${hours} ч, ${minutes} м, ${seconds} сек`)

			.setTimestamp()
		message.channel.send(embed);
	}
};