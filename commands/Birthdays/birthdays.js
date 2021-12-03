const { MessageEmbed } = require("discord.js");
const ServerRepository = require("../../repositories/server-repository");
const moment = require("moment");
const i18n = require("../../util/i18n");

module.exports = {
	name: "birthdays",
	description: i18n.__("birthdays.birthdaysDesc"),
	aliases: ["bds"],
	emoji: ":tada:",
	guildOnly: true,
	async execute(client, message) {
		const dbServer = await ServerRepository.findOrCreate(message.guild);

		let birthdays = dbServer.members
			.filter((member) => member.birthday != undefined)
			.sort((a, b) => yearless(a.birthday) - yearless(b.birthday))
			.reduce(formatUsers, "")

		if (!birthdays) return message.channel.send(i18n.__("birthdays.noBirthdays"));

		const embed = new MessageEmbed()
			.setTitle(i18n.__("birthdays.allBirthdays"))
			.setDescription(birthdays)
			.setColor("RANDOM")
			.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
			.setTimestamp()
		message.channel.send(embed);
	},
};

const formatUsers = (accumulator, member) => {
	const date = moment(member.birthday).format("Do MMMM");
	return accumulator + `${date} => ${member.user}\n`;
};

const yearless = (aDate) => new Date(1900, aDate.getMonth(), aDate.getDay());