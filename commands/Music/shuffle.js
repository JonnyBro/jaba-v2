const { canModifyQueue } = require("../../util/util");
const i18n = require("../../util/i18n");

module.exports = {
	name: "shuffle",
	aliases: ["sh"],
	description: i18n.__("shuffle.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message) {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(i18n.__("common.errorNotQueue")).catch(console.error);
		if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

		let songs = queue.songs;
		if (!songs) return queue.textChannel.send(i18n.__("common.errorNotQueue"))

		for (let i = songs.length - 1; i > 1; i--) {
			let j = 1 + Math.floor(Math.random() * i);
			[songs[i], songs[j]] = [songs[j], songs[i]];
		}
		queue.songs = songs;
		client.queue.set(message.guild.id, queue);
		queue.textChannel.send(i18n.__mf("shuffle.result", {author: message.author})).catch(console.error);
	}
};
