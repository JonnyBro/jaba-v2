const serverInfo = require("minecraft-server-status-improved");
const playerInfo = require("mc-player-api");
const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");
const moment = require("moment");

moment.locale("ru");

module.exports = {
	name: "minecraft",
	description: i18n.__("minecraft.description"),
	aliases: ["mine"],
	usage: "[(type) опционально]",
	emoji: ":bricks:",
	async execute(client, message, args) {
		if (!args[0]) {
			const embed = new MessageEmbed()
				.setTitle(i18n.__("minecraft.awailableCategories"))
				.setColor("RANDOM")
				.setDescription(i18n.__("minecraft.categories"))
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()
			return message.lineReply(embed);
		};

		if (args[0] === "user") {
			if (!args[1]) return message.lineReply(i18n.__("minecraft.noArg"));

			const data = await playerInfo.getUser(args[1]);
			if (data.status === "failed") return message.lineReply(i18n.__mf("minecraft.error", { error: data.why }));

			const names = data.username_history.map(function(item) {
				return `${item.username} ${item.changed_at ? `(изменён ${item.changed_at})` : "" }`;
			});

			const embed = new MessageEmbed()
				.setColor("RANDOM")
				.setThumbnail(data.skin.avatar)
				.setAuthor(`${data.username} (https://namemc.com/profile/${args[1]})`)

				.addField("Ник", data.username, true)
				.addField("UUID", data.uuid, true)
				.addField("Скин", `Изменён: ${data.skin_info.custom ? i18n.__("common.yes") : i18n.__("common.no")}\nСтройный: ${data.skin_info.slim ? i18n.__("common.yes") : i18n.__("common.no")}`)
				.addField("История ников", names)
				.addField("Файл скина", data.skin.skin_url)

				.setImage(data.skin_renders.body_render)
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()

				return message.channel.send(embed);
		} else if (args[0] === "server") {
			if (!args[1]) return message.lineReply(i18n.__("minecraft.noArg"));
			serverInfo(args[1]).then(data => {
				if (data.status === "error") return message.lineReply(i18n.__mf("minecraft.error", {error: data.error }));

				const embed = new MessageEmbed()
					.setColor("RANDOM")
					.setThumbnail(data.servericon)
					.setAuthor(`${args[1]} (${data.version})`)

					.addField("IP", data.server.name, true)
					.addField("Описание", data.motd)
					.addField("Онлайн", data.online ? i18n.__("common.yes") : i18n.__("common.no"))
					.addField("Игроки", `${data.players.now}/${data.players.max}`)
					.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
					.setTimestamp()

				return message.channel.send(embed);
			});
		};
	}
}