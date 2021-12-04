const { Levels, enabled } = require("../../modules/leveling");
const i18n = require("../../util/i18n");

module.exports = {
	name: "deluser",
	description: i18n.__("leveling.deluser"),
	aliases: ["du"],
	usage: "[@user]",
	emoji: ":gem:",
	permissions: "ADMINISTRATOR",
	guildOnly: true,
	async execute(client, message) {
		if (!enabled) return message.channel.send(i18n.__("leveling.disabled"));
		if (!message.mentions.members.first()) return message.channel.send(i18n.__("common.noMention"));

		Levels.deleteUser(message.mentions.members.first().id, message.guild.id);
		message.channel.send(i18n.__mf("leveling.deleted", {name: message.mentions.members.first()}));
	}
};