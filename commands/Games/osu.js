const fetch = require("node-superfetch");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const i18n = require("../../util/i18n");

moment.locale("ru");

module.exports = {
	name: "osu",
	description: i18n.__("osu.description"),
	usage: "[user]",
	emoji: ":poop:",
	async execute(client, message, args) {
		if (!args[0]) return message.lineReply(i18n.__("osu.noArg"));

		try {
			const { body } = await fetch.get("https://osu.ppy.sh/api/get_user").query({
				k: "2f8c377aa72db523edc4165d3d1225bf35199a3e",
				u: args[0],
				type: "string"
			});

			if (!body.length) return message.lineReply(i18n.__("osu.noUser"));

			const data = body[0];

			const embed = new MessageEmbed()
				.setColor(0xFF66AA)
				.setThumbnail(`https://a.ppy.sh/${data.user_id}?1543153924.jpeg`)
				.setAuthor(`${data.username} (https://osu.ppy.sh/users/${data.user_id})`, "https://i.imgur.com/hWrw2Sv.png")

				.addField("ID:", data.user_id)
				.addField("Уровень:", data.level || "???", true)
				.addField("Точность", data.accuracy ? `${Math.round(data.accuracy)}%` : "???", true)
				.addField("Ранг", data.pp_rank ? parseFloat(data.pp_rank) : "???", true)
				.addField("Кол-во игр", data.playcount ? parseFloat(data.playcount) : "???", true)
				.addField("Кол-во PP", data.pp_raw ? Math.round(parseFloat(data.pp_raw)) : "???", true)
				.addField("Рейтинг", data.ranked_score ? parseFloat(data.ranked_score) : "???", true)
				.addField("Общий рейтинг", data.total_score ? parseFloat(data.total_score) : "???")
				.addField("SS", data.count_rank_ss ? parseFloat(data.count_rank_ss) : "???", true)
				.addField("S", data.count_rank_s ? parseFloat(data.count_rank_s) : "???", true)
				.addField("A", data.count_rank_a ? parseFloat(data.count_rank_a) : "???", true)
				.addField("Создан:", data.join_date ? moment.utc(data.join_date).format("LLL") : "???")

				.setTimestamp()
			return message.channel.send(embed);
		} catch (e) {
			return message.channel.send(i18n.__("osu.error"));
		}
	}
}