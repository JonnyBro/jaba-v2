module.exports.name = "Discord Music System";

// Disable music system if this is false
const enabled = true;

// Do not touch anything
module.exports.enabled = enabled;

if (!enabled) return console.log("[INFO]".blue + " Discord Music System is " + "DISABLED".red);
if (enabled) console.log("[INFO]".blue + " Discord Music System is " + "ENABLED".green);

const client = require("../index.js").client;
const { MessageEmbed } = require("discord.js");
const { Player } = require("discord-player");
const i18n = require("../util/i18n");

const player = new Player(client);
client.player = player;

client.player.enableLive = true;

// Music system messages
client.player
.on("trackStart", (message, track) => {
	message.channel.send(i18n.__mf("play.startedPlaying", { title: track.title, url: track.url }));
	/*
	try {
		var playingMessage = await message.channel.send(i18n.__mf("play.startedPlaying", { title: track.title, url: track.url }));

		await playingMessage.react("⏭");
		await playingMessage.react("⏯");
		await playingMessage.react("🔇");
		await playingMessage.react("🔉");
		await playingMessage.react("🔊");
		await playingMessage.react("🔁");
		await playingMessage.react("🔂");
		await playingMessage.react("🔀");
		await playingMessage.react("⏹");
	} catch (error) {
		console.error(error);
	};

	const filter = (reaction, user) => user.id !== message.client.user.id;
	var collector = playingMessage.createReactionCollector(filter, {
		time: song.duration > 0 ? song.duration * 1000 : 600000
	});

	collector.on("collect", (reaction, user) => {
		if (!queue) return;
		const member = message.guild.members.cache.get(user.id);

		switch (reaction.emoji.name) {
			case "⏭":
				queue.playing = true;
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return queue.textChannel.send({ content: i18n.__("common.errorNotChannel") });
				queue.connection.dispatcher.end();
				queue.textChannel.send({ content: i18n.__mf("play.skipSong", { author: user }) }).catch(console.error);

				collector.stop();
				break;

			case "⏯":
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return queue.textChannel.send({ content: i18n.__("common.errorNotChannel") });
				if (queue.playing) {
					queue.playing = !queue.playing;
					queue.connection.dispatcher.pause(true);
					queue.textChannel.send({ content: i18n.__mf("play.pauseSong", { author: user }) }).catch(console.error);
				} else {
					queue.playing = !queue.playing;
					queue.connection.dispatcher.resume();
					queue.textChannel.send({ content: i18n.__mf("play.resumeSong", { author: user }) }).catch(console.error);
				}
				break;

			case "🔇":
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return queue.textChannel.send({ content: i18n.__("common.errorNotChannel") });
				if (queue.volume <= 0) {
					queue.volume = 100;
					queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
					queue.textChannel.send({ content: i18n.__mf("play.unmutedSong", { author: user }) }).catch(console.error);
				} else {
					queue.volume = 0;
					queue.connection.dispatcher.setVolumeLogarithmic(0);
					queue.textChannel.send({ content: i18n.__mf("play.mutedSong", { author: user }) }).catch(console.error);
				}
				break;

			case "🔉":
				reaction.users.remove(user).catch(console.error);
				if (queue.volume == 0) return;
				if (!canModifyQueue(member)) return queue.textChannel.send({ content: i18n.__("common.errorNotChannel") });
				if (queue.volume - 10 <= 0) queue.volume = 0;
				else queue.volume = queue.volume - 10;
				queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
				queue.textChannel.send({ content: i18n.__mf("play.decreasedVolume", { author: user, volume: queue.volume }) }).catch(console.error);
				break;

			case "🔊":
				reaction.users.remove(user).catch(console.error);
				if (queue.volume == 100) return;
				if (!canModifyQueue(member)) return queue.textChannel.send({ content: i18n.__("common.errorNotChannel") });
				if (queue.volume + 10 >= 100) queue.volume = 100;
				else queue.volume = queue.volume + 10;
				queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
				queue.textChannel.send({ content: i18n.__mf("play.increasedVolume", { author: user, volume: queue.volume }) }).catch(console.error);
				break;

			case "🔁":
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return queue.textChannel.send({ content: i18n.__("common.errorNotChannel") });
				queue.loopSong = false;
				queue.loop = !queue.loop;
				queue.textChannel.send(i18n.__mf("play.loopSong", { author: user, loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") })).catch(console.error);
				break;

			case "🔂":
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return queue.textChannel.send({ content: i18n.__("common.errorNotChannel") });
				queue.loop = false;
				queue.loopSong = !queue.loopSong;
				queue.textChannel.send({ content: i18n.__mf("play.loopSong", { author: user, loop: queue.loopSong ? i18n.__("common.on") : i18n.__("common.off")}) }).catch(console.error);
				break;

			case "🔀":
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return queue.textChannel.send({ content: i18n.__("common.errorNotChannel") });

				let songs = queue.songs;
				if (!songs) return queue.textChannel.send({ content: i18n.__("common.errorNotQueue") })

				for (let i = songs.length - 1; i > 1; i--) {
					let j = 1 + Math.floor(Math.random() * i);
					[songs[i], songs[j]] = [songs[j], songs[i]];
				}

				queue.songs = songs;

				queue.textChannel.send({ content: i18n.__mf("shuffle.result", {author: user}) }).catch(console.error);
				break;

			case "⏹":
				reaction.users.remove(user).catch(console.error);
				if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
				queue.songs = [];
				queue.textChannel.send({ content: i18n.__mf("play.stopSong", { author: user }) }).catch(console.error);
				try {
					queue.connection.dispatcher.end();
				} catch (error) {
					console.error(error);
					queue.connection.disconnect();
				}

				collector.stop();
				break;

			default:
				reaction.users.remove(user).catch(console.error);
				break;
		}
	});

	collector.on("end", () => {
		if (playingMessage && !playingMessage.deleted) {
			playingMessage.reactions.removeAll().catch(console.error);
			playingMessage.delete({ timeout: 4000 }).catch(console.error);
		};
	});
	*/
})
.on("trackAdd", (message, queue, track) => message.channel.send(i18n.__mf("play.queueAdded", { author: message.author, title: track.title })))
.on("playlistAdd", (message, queue, playlist) => message.channel.send(i18n.__mf("playlist.startedPlaylist", { author: message.author, tracks: playlist.track.length, title: playlist.title })))
.on("searchResults", (message, query, tracks) => {
	const embed = new MessageEmbed()
		.setTitle(`${i18n.__mf("search.searchDesc", { search: query })}\n${i18n.__("search.searchDesc2")}`)
		.setColor("RANDOM")
		.setTimestamp()
		.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
		.setDescription(tracks.map((track, i) => `**${i + 1}. \`${track.title}\`**`))
	message.channel.send(embed);
})
.on("searchInvalidResponse", (message, query, tracks, content, collector) => {
	if (content === "cancel") {
		collector.stop();
		return message.lineReply(i18n.__("search.searchCancel"));
	};

	message.channel.send(i18n.__mf("search.noSearch", { number: tracks.length}));
})
.on("searchCancel", (message, query, tracks) => message.channel.send(i18n.__("search.searchCancel")))
.on("noResults", (message, query) => message.channel.send(i18n.__mf("search.noResults", { search: query })))
.on("queueEnd", (message, queue) => message.channel.send(i18n.__("play.queueEnded")))
.on("channelEmpty", (message, queue) => message.channel.send(i18n.__("play.everyoneLeft")))
.on("botDisconnect", (message) => message.channel.send(i18n.__("play.leaveChannel")))
.on("error", (error, message) => {
	switch(error) {
		case "NotPlaying":
			message.channel.send(i18n.__("common.errorNotQueue"));
		break;

		case "NotConnected":
			message.channel.send(i18n.__("common.errorNotChannel"));
		break;

		case "UnableToJoin":
			message.channel.send(i18n.__("play.missingPermissionConnect"));
		break;

		case "LiveVideo":
			message.channel.send(i18n.__("play.noLive"));
		break;

		case "VideoUnavailable":
			message.channel.send(i18n.__("play.unavailable"));
		break;

		default:
			message.channel.send(i18n.__mf("common.error", { error: error }));
	};
});