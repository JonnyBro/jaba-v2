const Discord = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "doodlecrew",
	description: i18n.__("discordtogether.doodlecrew"),
	emoji: ":paintbrush:",
	guildOnly: true,
	async execute(client, message) {
		if (require("../../include/activities.js").enabled == false) return message.channel.send(i18n.__("discordtogether.disabled"));
			if (!message.member.voice.channel) return message.channel.send(i18n.__("common.errorNotChannel"));

			client.discordTogether.createTogetherCode(message.member.voice.channelID, "doodlecrew").then(async invite => {
				const embed = new Discord.MessageEmbed()
					.setTitle("Doodle Crew")
					.setColor("RANDOM")
					.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
					.setTimestamp()
					.setDescription(`**[${i18n.__("discordtogether.clickHere")}](${invite.code})**`)
				return message.channel.send(embed);
			});
		},
};