const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "youtube",
	description: i18n.__("discordtogether.youtube"),
	emoji: ":eyes:",
	aliases: ["yt"],
	guildOnly: true,
	async execute(client, message) {
		if (require("../../include/activities.js").enabled == false) return message.channel.send(i18n.__("discordtogether.disabled"));
			if (!message.member.voice.channel) return message.channel.send(i18n.__("common.errorNotChannel"));

			client.discordTogether.createTogetherCode(message.member.voice.channelID, "youtube").then(async invite => {
				const embed = new MessageEmbed()
					.setTitle("YouTube Together")
					.setColor("RANDOM")
					.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
					.setDescription(`**[${i18n.__("discordtogether.clickHere")}](${invite.code})**`)
					.setTimestamp()
				return message.channel.send(embed);
			});
		},
};