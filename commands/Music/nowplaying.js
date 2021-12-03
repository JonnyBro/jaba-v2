const { splitBar } = require("string-progressbar");
const { MessageEmbed } = require("discord.js");

const i18n = require("../../util/i18n");

module.exports = {
	name: "nowplaying",
	description: i18n.__("nowplaying.description"),
	aliases: ["np"],
	emoji: ":musical_note:",
	guildOnly: true,
	execute(client, message) {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.lineReply(i18n.__("common.errorNotQueue")).catch(console.error);

		const song = queue.songs[0];
		const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
		const left = song.duration - seek;

		let nowPlaying = new MessageEmbed()
			.setTitle(i18n.__("nowplaying.embedTitle"))
			.setDescription(`${song.title}\n${song.url}`)
			.setColor("#F8AA2A")
			.setAuthor(client.user.username);

		if (song.duration > 0) {
			nowPlaying.addField(
				"\n",
				new Date(seek * 1000).toISOString().substr(11, 8) +
					"[" +
					splitBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
					"]" +
					(song.duration == 0 ? i18n.__(nowplaying.live) : new Date(song.duration * 1000).toISOString().substr(11, 8)),
				false
			);
			nowPlaying.setFooter(i18n.__mf("nowplaying.timeRemaining", { time: new Date(left * 1000).toISOString().substr(11, 8) }));
		}

		return message.channel.send(nowPlaying);
	}
};