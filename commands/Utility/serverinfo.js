const i18n = require("../../util/i18n");
const moment = require("moment")
const Discord = require("discord.js")
const ms = require("ms")

moment.locale("ru");

module.exports = {
	name: "serverinfo",
	description: i18n.__("serverinfo.description"),
	aliases: ["guild", "si"],
	guildOnly: true,
	async execute(client, message) {
		var owner = null;
		await message.guild.members.fetch(message.guild.ownerID).then(guildMember => owner = guildMember);

		const siembed = new Discord.MessageEmbed()
			.setAuthor(`Информация о сервере`, client.user.avatarURL())
			.setColor("RANDOM")
			.setThumbnail(message.guild.iconURL())

			.addField(`Дата создания сервера: `, `${moment.utc(message.guild.createdAt).format("LLL")} (${ms(Date.now() - message.guild.createdAt)})`)
			.addField(`Вы вступили:`, `${moment.utc(message.member.joinedAt).format("LLL")} (${ms(Date.now() - message.member.joinedAt)})`)
			.addField(`Владелец сервера:`, `${owner}`)
			.addField(`Участники`, `Общее количество: ${message.guild.memberCount}`)
			.addField(`Количество ролей:`, message.guild.roles.cache.size)
			.addField(`Количество текстовых каналов:`, message.guild.channels.cache.filter(channel => channel.type != "category" && channel.type != "voice").size, true)
			.addField(`Количество голосовых каналов:`, message.guild.channels.cache.filter(channel => channel.type === "voice").size, true)

			.setTimestamp()
		message.channel.send(siembed);
	}
};