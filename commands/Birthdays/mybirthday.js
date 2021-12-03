const { MessageEmbed } = require("discord.js");
const ServerRepository = require("../../repositories/server-repository");
const i18n = require("../../util/i18n");

module.exports = {
	name: "mybirthday",
	description: i18n.__("birthdays.mybirthdayDesc"),
	aliases: ["mybd"],
	emoji: ":tada:",
	guildOnly: true,
	async execute(client, message) {
		const dbServer = await ServerRepository.findOrCreate(message.guild);

		let member = dbServer.members.find(m => m.user === message.author.tag);

		if(member) {
			// Обрезаем до окончания года для красоты
			const formattedDate = member.birthday.toString().slice(0, 15);

			var embed = new MessageEmbed()
				.setTitle(i18n.__("birthdays.yourBirthday"))
				.setDescription(i18n.__mf("birthdays.birthdayCreated", { date: formattedDate }))
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()
		} else {
			var embed = new MessageEmbed()
				.setTitle(i18n.__("birthdays.noyourBirthday"))
				.setDescription(i18n.__mf("birthdays.birthdayCreate", { prefix: client.prefix }))
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()
		}

		message.channel.send(embed);
	}
};