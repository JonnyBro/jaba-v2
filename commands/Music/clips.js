const i18n = require("../../util/i18n");
const fs = require("fs");

module.exports = {
	name: "clips",
	description: i18n.__("clips.description"),
	usage: "[clip]",
	aliases: ["cs"],
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message) {
		fs.readdir("./clips", function(err, files) {
			if (err) return console.log("Unable to read directory: " + err);

			let clips = [];

			files.forEach(function(file) {
				clips.push(file.substring(0, file.length - 4));
			});

			message.lineReply(`**Список клипов:**\n${clips.join(", ")}`).catch(console.error);
		});
	}
};