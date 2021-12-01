const Discord = require("discord.js");
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
			// Dates will all come back with the same character count so slicing up to the end of the year seems simplest
			const formattedDate = member.birthday.toString().slice(0, 15);

			var embed = new Discord.MessageEmbed()
				.setTitle(i18n.__("birthdays.yourBirthday"))
				.setDescription(i18n.__mf("birthdays.birthdayCreated", { date: formattedDate }))
				.setColor("RANDOM")
				.setTimestamp()
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
		} else {
			var embed = new Discord.MessageEmbed()
				.setTitle(i18n.__("birthdays.noyourBirthday"))
				.setDescription(i18n.__mf("birthdays.birthdayCreate", { prefix: client.prefix }))
				.setColor("RANDOM")
				.setTimestamp()
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
		}

		message.channel.send(embed);
	}
};