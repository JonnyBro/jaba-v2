const canvacord = require("canvacord");
const Discord = require("discord.js");
const i18n = require("../../util/i18n");


module.exports = {
	name: "affect",
	description: i18n.__("affect.description"),
	usage: "[@user (Возвращает ваш аватар если не указан)]",
	aliases: ["drink"],
	async execute(client, message) {
			const user = message.mentions.users.first() || message.author;
			const avatar = user.displayAvatarURL({ format: "png", size: 1024, dynamic: true });
			const image = await canvacord.Canvas.affect(avatar);
			const embed = new Discord.MessageEmbed()
				.attachFiles({ attachment: image, name: "affect.png" })
				.setImage("attachment://affect.png")
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()
			message.channel.send(embed);
	},
};