const Member = require("../../models/Member");
const ServerRepository = require("../../repositories/server-repository");
const i18n = require("../../util/i18n");

module.exports = {
	name: "birthday",
	description: i18n.__("birthdays.birthdayDesc"),
	aliases: ["bd"],
	usage: "[ДД ММ ГГГГ]",
	emoji: ":tada:",
	guildOnly: true,
	async execute(client, message, args) {
		let item = "";

		for (let i = 0; i < args.length; i++) {
			item += args[i] + " ";
		};

		if (args === undefined || args.length != 3) {
			return message.lineReply(i18n.__("birthdays.wrongFormat"));
		};

		let dateString = args[1] + " " + args[0] + " " + args[2];
		let date = new Date(dateString);
		let formattedDate = date.toString().slice(0, 15);

		const dbServer = await ServerRepository.findOrCreate(message.guild);

		let member = dbServer.members.find(m => m.user === message.author.tag);

		if (member) {
			let memberIndex = dbServer.members.findIndex(m => m.user === message.author.tag);
			dbServer.members[memberIndex].birthday = date;
			dbServer.members[memberIndex].discord_id = message.author.id;
			dbServer.markModified("members");
			await dbServer.save();
			message.channel.send(i18n.__mf("birthdays.birthdayChanged", { date: formattedDate }));
		} else {
			const newBirthday = new Member({
				user: message.author.tag,
				birthday: date,
				discord_id: message.author.id
			});
			dbServer.members.push(newBirthday);
			dbServer.markModified("members");
			await dbServer.save();
			message.channel.send(i18n.__mf("birthdays.birthdayCreated", { date: formattedDate }));
		}
	},
};