const Discord = require("discord.js");
const canvacord = require("canvacord");
const { Levels, enabled } = require("../../include/leveling.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "rank",
	description: i18n.__("leveling.rank"),
	aliases: ["level", "r", "l"],
	usage: "[@user (опционально)]",
	emoji: ":gem:",
	guildOnly: true,
	async execute(client, message) {
		if (!enabled) return message.channel.send(i18n.__("leveling.disabled"));

		const target = message.mentions.users.first() || message.author;
		const user = await Levels.fetch(target.id, message.guild.id);
		if (!user) return message.channel.send(i18n.__("leveling.noXP"));

		const rank = new canvacord.Rank()
			.setAvatar(target.displayAvatarURL({ size: 1024, format: "png", dynamic: true }))
			.setCurrentXP(user.xp)
			.setRequiredXP(Levels.xpFor(user.level + 1))
			.setLevel(user.level)
			.setRank(0, "", false)
			.setProgressBar("#FF0000", "COLOR")
			.setStatus(target.presence.status)
			.setUsername(target.username)
			.renderEmojis(true)
			.setDiscriminator(target.discriminator);
		rank.build().then(data => {
			const embed = new Discord.MessageEmbed()
				.attachFiles({ attachment: data, name: "attachment://rankcard.png" })
				.setImage("attachment://rankcard.png")
				.setColor("RANDOM")
			message.channel.send(embed);
		});
	},
};