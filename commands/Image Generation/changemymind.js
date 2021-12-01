const canvacord = require("canvacord");
const Discord = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "changemymind",
	description: i18n.__("changemymind.description"),
	aliases: ["cmm"],
	usage: "[текст]",
	async execute(client, message, args) {
			const image = await canvacord.Canvas.changemymind(args.join(" ") || "Жизнь боль");
			const embed = new Discord.MessageEmbed()
				.attachFiles({ attachment: image, name: "changemymind.png" })
				.setImage("attachment://changemymind.png")
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()
			message.channel.send(embed);
	},
};