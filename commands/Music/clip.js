const i18n = require("../../util/i18n");
const { DEFAULT_VOLUME } = require("../../util/util");
const { existsSync } = require("fs");

module.exports = {
	name: "clip",
	description: i18n.__("clip.description"),
	aliases: ["c"],
	emoji: ":musical_note:",
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;
		const queue = client.queue.get(message.guild.id);

		if (!args.length) return message.lineReply(i18n.__("clip.usagesReply")).catch(console.error);
		if (!existsSync(`./clips/${args[0]}.mp3`)) return message.lineReply(i18n.__("clip.noFile")).catch(console.error);
		if (queue) return message.lineReply(i18n.__("clip.errorQueue"));
		if (!channel) return message.lineReply(i18n.__("common.errorNotChannel")).catch(console.error);

		const queueConstruct = {
			textChannel: message.channel,
			channel,
			connection: null,
			songs: [],
			loop: false,
			loopSong: false,
			volume: DEFAULT_VOLUME || 100,
			playing: true
		};

		client.queue.set(message.guild.id, queueConstruct);

		try {
			queueConstruct.connection = await channel.join();
			await queueConstruct.connection.voice.setSelfDeaf(true);

			const dispatcher = queueConstruct.connection
				.play(`./clips/${args[0]}.mp3`)
				.on("finish", () => {
					client.queue.delete(message.guild.id);
					channel.leave();
				})
				.on("error", err => {
					client.queue.delete(message.guild.id);
					channel.leave();
					console.error(err);
				});
		} catch (error) {
			console.error(error);
		}
	}
};
