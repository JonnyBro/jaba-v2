const i18n = require("../../util/i18n");
const moment = require("moment")
const { MessageEmbed } = require("discord.js")
const ms = require("ms")
const activities = {
	0: "Играет",
	1: "Стримит",
	2: "Смотрит",
	3: "Слушает"
}

moment.locale("ru");

module.exports = {
	name: "userinfo",
	description: i18n.__("userinfo.description"),
	aliases: ["ui"],
	usage: "[optional (@user)]",
	guildOnly: true,
	async execute(client, message) {
		let iuser = message.guild.member(message.mentions.users.first() || message.author);

		const embed = new MessageEmbed()
			.setAuthor(`Информация о ${iuser.user.tag}`)
			.setThumbnail(iuser.user.avatarURL)
			.setDescription(iuser.user.presence.game ? `${activities[iuser.user.presence.game.type]} **${iuser.user.presence.game.name}**` : "")
			.setColor(iuser.displayHexColor)

			.addField(`Ник`, iuser.user.username, true)
			.addField("Ник на данном сервере", iuser.nickname || iuser.user.username, true)
			.addField(`Дата создания аккаунта`, `${moment.utc(iuser.user.createdAt).format("LLL")} (${ms(Date.now() - iuser.user.createdAt)})`)
			.addField(`Тэг`, iuser.user.tag, true)
			.addField("ID", iuser.user.id, true)
			.addField(`Бот`, iuser.user.bot ? "Да" : "Нет")
			.addField(`Роли на данном сервере [${iuser.roles.cache.filter(rol => rol.name != "@everyone").size != 0 ? iuser.roles.cache.filter(rol => rol.name != "@everyone").size : 0}]`, iuser.roles.cache.filter(rol => rol.name != "@everyone").map(r => r.name) != "" ? iuser.roles.cache.filter(rol => rol.name != "@everyone").map(r => r.name) : "Отсутствуют")
			.addField(`Цвет высшей роли (HEX)`, iuser.roles.highest.hexColor)

			.setTimestamp()
		message.channel.send(embed);
	}
};