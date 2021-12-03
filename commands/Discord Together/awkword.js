const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "awkword",
	description: i18n.__("discordtogether.awkword"),
	emoji: ":clown:",
	guildOnly: true,
	async execute(client, message) {
		if (require("../../include/activities.js").enabled == false) return message.lineReply(i18n.__("discordtogether.disabled"));
			if (!message.member.voice.channel) return message.lineReply(i18n.__("common.errorNotChannel"));

			client.discordTogether.createTogetherCode(message.member.voice.channelID, "awkword").then(async invite => {
				const embed = new MessageEmbed()
					.setTitle("Awkword")
					.setColor("RANDOM")
					.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
					.setDescription(`**[${i18n.__("discordtogether.clickHere")}](${invite.code})**`)
					.setTimestamp()
				return message.channel.send(embed);
			});
		},
};