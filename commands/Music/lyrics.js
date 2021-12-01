const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");
const fetch = require("node-superfetch");

module.exports = {
	name: "lyrics",
	aliases: ["ly"],
	description: i18n.__("lyrics.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	async execute(client, message) {
		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(i18n.__("common.errorNotQueue")).catch(console.error);

		let lyrics = null;
		try {
			await fetch.get(`https://lyrics.flc.bar/search?song=${queue.songs[0].title}`).then(response => {
				lyrics = response.body.lyrics.split("\n");
			});

			if (!lyrics) lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: queue.songs[0].title });
		} catch (error) {
			lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: queue.songs[0].title });
		}

		let lyricsEmbed = new MessageEmbed()
			.setTitle(i18n.__mf("lyrics.embedTitle", { title: queue.songs[0].title }))
			.setDescription(lyrics)
			.setColor("#F8AA2A")
			.setTimestamp();

		if (lyricsEmbed.description.length >= 2048)
			lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
		return message.channel.send(lyricsEmbed).catch(console.error);
	}
};
