const canvacord = require("canvacord");
const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "delete",
	description: i18n.__("delete.description"),
	usage: "[@user (Возвращает ваш аватар если не указан)]",
	alias: ["trash"],
	async execute(client, message) {
			const user = message.mentions.users.first() || message.author;
			const avatar = user.displayAvatarURL({ format: "png", size: 1024, dynamic: true });
			const image = await canvacord.Canvas.delete(avatar, false);

			const embed = new MessageEmbed()
				.attachFiles({ attachment: image, name: "delete.png" })
				.setImage("attachment://delete.png")
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()
			message.channel.send(embed);
	}
};