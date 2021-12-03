const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "wordsnack",
	description: i18n.__("discordtogether.wordsnack"),
	emoji: ":open_mouth:",
	guildOnly: true,
	async execute(client, message) {
		if (require("../../include/activities.js").enabled == false) return message.channel.send(i18n.__("discordtogether.disabled"));
			if (!message.member.voice.channel) return message.channel.send(i18n.__("common.errorNotChannel"));

			client.discordTogether.createTogetherCode(message.member.voice.channelID, "wordsnack").then(async invite => {
				const embed = new MessageEmbed()
					.setTitle("Word Snack")
					.setColor("RANDOM")
					.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
					.setDescription(`**[${i18n.__("discordtogether.clickHere")}](${invite.code})**`)
					.setTimestamp()
				return message.channel.send(embed);
			});
		},
};