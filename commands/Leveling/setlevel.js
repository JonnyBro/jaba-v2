const { Levels, enabled } = require("../../modules/leveling");
const i18n = require("../../util/i18n");

module.exports = {
	name: "setlevel",
	description: i18n.__("leveling.setlevel"),
	aliases: ["sl"],
	usage: "[@user] [level]",
	emoji: ":gem:",
	permissions: "ADMINISTRATOR",
	guildOnly: true,
	async execute(client, message, args) {
		if (!enabled) return message.channel.send(i18n.__("leveling.disabled"));
		if (!message.mentions.members.first()) return message.channel.send(i18n.__("common.noMention"));

		Levels.setLevel(message.mentions.members.first().id, message.guild.id, args[1]);
		message.channel.send(i18n.__mf("leveling.newlevel", {name: message.mentions.members.first(), value: args[1]}));
	}
};