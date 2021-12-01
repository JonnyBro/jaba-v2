const { Levels, enabled } = require("../../include/leveling.js");
const mee6levels = require("mee6-levels-api");
const i18n = require("../../util/i18n");

module.exports = {
	name: "sync",
	description: "Синхронизировать уровни текущего сервера с уровнями Mee6",
	guildOnly: true,
	async execute(client, message) {
		if (!enabled) return message.channel.send(i18n.__("leveling.disabled"));

		mee6levels.getUserXp(message.guild.id, message.author.id).then(user => {
			Levels.setLevel(message.author.id, message.guild.id, user.level);
			message.lineReply(`Ваш уровень Mee6 синхронизирован! Текущий уровень - ${user.level}`);
		});
	}
};