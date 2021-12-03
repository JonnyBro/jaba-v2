const { Levels, enabled } = require("../../include/leveling.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "setxp",
	description: i18n.__("leveling.setxp"),
	aliases: ["sx"],
	usage: "[@user] [xp]",
	emoji: ":gem:",
	permissions: "ADMINISTRATOR",
	guildOnly: true,
	async execute(client, message, args) {
		if (!enabled) return message.channel.send(i18n.__("leveling.disabled"));
		if (!message.mentions.members.first()) return message.channel.send(i18n.__("common.noMention"));

		Levels.setXp(message.mentions.members.first().id, message.guild.id, args[1]);
		message.channel.send(i18n.__mf("leveling.newxp", {name: message.mentions.members.first(), value: args[1]}));
	}
};