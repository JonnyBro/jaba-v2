const canvacord = require("canvacord");
const Discord = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "hitler",
	description: i18n.__("hitler.description"),
	usage: "[@user (Возвращает ваш аватар если не указан)]",
	async execute(client, message) {
			const user = message.mentions.users.first() || message.author;
			const avatar = user.displayAvatarURL({ format: "png", size: 1024, dynamic: true });
			const image = await canvacord.Canvas.hitler(avatar);
			const embed = new Discord.MessageEmbed()
				.attachFiles({ attachment: image, name: "hitler.png" })
				.setImage("attachment://hitler.png")
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()
			message.channel.send(embed);
	},
};