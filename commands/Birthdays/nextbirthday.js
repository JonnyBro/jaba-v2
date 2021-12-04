const { MessageEmbed } = require("discord.js");
const ServerRepository = require("../../repositories/server-repository");
const moment = require("moment");
const i18n = require("../../util/i18n");

module.exports = {
	name: "nextbirthday",
	description: i18n.__("birthdays.nextbirthdayDesc"),
	aliases: ["nextbd"],
	emoji: ":tada:",
	guildOnly: true,
	async execute(client, message) {
		const dbServer = await ServerRepository.findOrCreate(message.guild);

		let birthdays = dbServer.members
			.filter((member) => member.birthday != undefined)
			.sort((a, b) => new Date(a.birthday) - new Date(b.birthday))

		let offsets = [...birthdays];

		if (!birthdays) return message.channel.send(i18n.__("birthdays.noBirthdays"));

		let birthdayEntry = find(offsets);
		let birthday = formatUser(birthdays[birthdayEntry]);

		const embed = new MessageEmbed()
			.setTitle(i18n.__("birthdays.nextBirthday"))
			.setDescription(birthday)
			.setColor("RANDOM")
			.setTimestamp()
			.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
		message.channel.send(embed);
	}
};

const formatUser = (member) => {
	const date = moment(member.birthday).format("Do MMMM");
	return `${date} => ${member.user}\n`
};

let find = (birthdays) => {
	let currentTime = new Date();

	let low = 0, high = birthdays.length - 1;
	let res = 0;

	while(low < high){
		let mid = Math.floor((low + high) / 2);

		if (birthdays[mid].birthday>currentTime) {
			res = mid;
			high = mid - 1;
		} else {
			low = mid + 1;
		};
	};

	return res
};