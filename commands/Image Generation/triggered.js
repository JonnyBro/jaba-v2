const canvacord = require("canvacord");
const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "triggered",
	description: i18n.__("triggered.description"),
	usage: "[@user (Возвращает ваш аватар если не указан)]",
	async execute(client, message) {
			const user = message.mentions.users.first() || message.author;
			const avatar = user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 });
			const image = await canvacord.Canvas.trigger(avatar);

			const embed = new MessageEmbed()
				.attachFiles({ attachment: image, name: "triggered.gif" })
				.setImage("attachment://triggered.gif")
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()
			message.channel.send(embed);
	},
};