const { MessageEmbed } = require("discord.js");
const { enabled } = require("../../modules/activities");
const i18n = require("../../util/i18n");

module.exports = {
	name: "chess",
	description: i18n.__("discordtogether.chess"),
	emoji: ":chess_pawn:",
	guildOnly: true,
	async execute(client, message) {
		if (!enabled) return message.channel.send(i18n.__("discordtogether.disabled"));
		if (!message.member.voice.channel) return message.lineReply(i18n.__("common.errorNotChannel"));

		client.discordTogether.createTogetherCode(message.member.voice.channelID, "chess").then(async invite => {
			const embed = new MessageEmbed()
				.setTitle("Chess")
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setDescription(`**[${i18n.__("discordtogether.clickHere")}](${invite.code})**`)
				.setTimestamp()
			return message.channel.send(embed);
		});
	}
};