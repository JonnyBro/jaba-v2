const canvacord = require("canvacord");
const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "clyde",
	description: i18n.__("clyde.description"),
	usage: "[текст]",
	async execute(client, message, args) {
			const image = await canvacord.Canvas.clyde(args.join(" ") || "Ваше сообщение не может быть доставлено. Обычно это связано с тем, что у Вас нет общих серверов с получателем, или если получатель принимает сообщения только от друзей.");

			const embed = new MessageEmbed()
				.attachFiles({ attachment: image, name: "clyde.png" })
				.setImage("attachment://clyde.png")
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()
			message.channel.send(embed);
	}
};