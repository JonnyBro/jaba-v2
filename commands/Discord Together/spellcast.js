const Discord = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "spellcast",
	description: i18n.__("discordtogether.spellcast"),
	emoji: ":magic_wand:",
	guildOnly: true,
	async execute(client, message) {
		if (require("../../include/activities.js").enabled == false) return message.channel.send(i18n.__("discordtogether.disabled"));
			if (!message.member.voice.channel) return message.channel.send(i18n.__("common.errorNotChannel"));

			client.discordTogether.createTogetherCode(message.member.voice.channelID, "spellcast").then(async invite => {
				const embed = new Discord.MessageEmbed()
					.setTitle("SpellCast")
					.setColor("RANDOM")
					.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
					.setTimestamp()
					.setDescription(`**[${i18n.__("discordtogether.clickHere")}](${invite.code})**`)
				return message.channel.send(embed);
			});
		},
};