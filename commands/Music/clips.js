const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");
const { readdir } = require("fs");

module.exports = {
	name: "clips",
	description: i18n.__("clips.description"),
	usage: "[clip]",
	aliases: ["cs"],
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message) {
		readdir("./clips", function(err, files) {
			if (err) return console.log("Unable to read directory: " + err);

			let clips = [];

			files.forEach(function(file) {
				clips.push(file.substring(0, file.length - 4));
			});

			const embed = new MessageEmbed()
				.setTitle("**Список клипов:**")
				.setDescription(clips.join("\n"))
				.setColor("RANDOM")
				.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
				.setTimestamp()
			message.channel.send(embed);
		});
	}
};