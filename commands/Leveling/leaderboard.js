const { MessageEmbed } = require("discord.js");
const { Levels, enabled } = require("../../modules/leveling");
const i18n = require("../../util/i18n");

module.exports = {
	name: "leaderboard",
	description: i18n.__("leveling.leaderboard"),
	emoji: ":gem:",
	aliases: ["levels", "leaders", "top"],
	guildOnly: true,
	async execute(client, message) {
		if (!enabled) return message.channel.send(i18n.__("leveling.disabled"));

		const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10);
		if (rawLeaderboard.length < 1) return message.channel.send(i18n.__("leveling.noBoard"));
		const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
		const lb = leaderboard.map(e => `**${e.position}.** \`${e.username}#${e.discriminator}\` - **Уровень:** **${e.level}** - **Опыт: ${e.xp.toLocaleString()}**`);

		const embed = new MessageEmbed()
			.setTitle("top spammers")
			.setColor("RANDOM")
			.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
			.setTimestamp()
			.setDescription(lb.join("\n"))
		message.channel.send(embed);
	}
};
