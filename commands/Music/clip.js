const i18n = require("../../util/i18n");
const { existsSync } = require("fs");

module.exports = {
	name: "clip",
	description: i18n.__("clip.description"),
	aliases: ["c"],
	emoji: ":musical_note:",
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		if (!args.length) return message.lineReply(i18n.__("clip.usagesReply")).catch(console.error);
		if (!existsSync(`./clips/${args[0]}.mp3`)) return message.lineReply(i18n.__("clip.noFile")).catch(console.error);
		if (client.player.isPlaying()) return message.lineReply(i18n.__("clip.errorQueue"));
		if (!channel) return message.lineReply(i18n.__("common.errorNotChannel")).catch(console.error);

		try {
			const connection = await channel.join();
			await connection.voice.setSelfDeaf(true);

			connection
				.play(`./clips/${args[0]}.mp3`)
				.on("finish", () => {
					channel.leave();
				})
				.on("error", err => {
					channel.leave();
					console.error(err);
				});
		} catch (error) {
			console.error(error);
		};
	}
};