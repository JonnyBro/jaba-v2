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
const { YOUTUBE_TOKEN } = require("../util/util");

const player = new Player(client, {
	ytdlDownloadOptions: {
		requestOptions: {
			headers: {
				cookie: YOUTUBE_TOKEN
			}
		}
	},
	leaveOnEmpty: false,
	enableLive: true
});
client.player = player;

// Music system messages
client.player
.on("trackStart", async (message, track) => {
	try {
		var playingMessage = await message.channel.send(i18n.__mf("play.startedPlaying", { title: track.title, url: track.url }));

		await playingMessage.react("⏭");
		await playingMessage.react("⏯");
		await playingMessage.react("🔁");
		await playingMessage.react("🔂");
		await playingMessage.react("🔀");
		await playingMessage.react("⏏️");
		await playingMessage.react("⏹");
	} catch (error) {
		console.error(error);
	};

	const filter = (reaction, user) => user.id !== message.client.user.id;
	var collector = playingMessage.createReactionCollector(filter, {
		time: track.duration > 0 ? track.duration * 1000 : 600000
	});

	collector.on("collect", (reaction, user) => {
		switch (reaction.emoji.name) {
			case "⏭":
				reaction.users.remove(user).catch(console.error);

				if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));
				client.player.skip(message);
				message.channel.send(i18n.__mf("play.skipSong", { author: user }));

				collector.stop();
			break;

			case "⏯":
				reaction.users.remove(user).catch(console.error);

				if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));

				if (!client.player.getQueue(message).paused) {
					client.player.pause(message);
					message.channel.send(i18n.__mf("play.pauseSong", { author: user }));
				} else {
					client.player.resume(message);
					message.channel.send(i18n.__mf("play.resumeSong", { author: user }));
				};
			break;

			case "🔁":
				reaction.users.remove(user).catch(console.error);

				if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));

				if (!client.player.getQueue(message).loopMode) {
					client.player.setLoopMode(message, true);
					message.channel.send(i18n.__mf("play.loopQueue", { author: user, loop: client.player.getQueue(message).loopMode ? i18n.__("common.on") : i18n.__("common.off") }));
				} else {
					client.player.setLoopMode(message, false);
					message.channel.send(i18n.__mf("play.loopQueue", { author: user, loop: client.player.getQueue(message).loopMode ? i18n.__("common.on") : i18n.__("common.off") }));
				};

			break;

			case "🔂":
				reaction.users.remove(user).catch(console.error);

				if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));

				if (!client.player.getQueue(message).repeatMode) {
					client.player.setRepeatMode(message, true);
					message.channel.send(i18n.__mf("play.loopSong", { author: user, loop: client.player.getQueue(message).repeatMode ? i18n.__("common.on") : i18n.__("common.off") }));
				} else {
					client.player.setRepeatMode(message, false);
					message.channel.send(i18n.__mf("play.loopSong", { author: user, loop: client.player.getQueue(message).repeatMode ? i18n.__("common.on") : i18n.__("common.off") }));
				};
			break;

			case "🔀":
				reaction.users.remove(user).catch(console.error);
				if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));

				client.player.shuffle(message);
				message.channel.send(i18n.__mf("shuffle.result", { author: user }));
			break;

			case "⏏️":
				reaction.users.remove(user).catch(console.error);
				if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));

				client.player.clearQueue(message);
				message.channel.send(i18n.__mf("play.queueClear", { author: user }));
			break;

			case "⏹":
				reaction.users.remove(user).catch(console.error);
				if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.lineReply(i18n.__("common.errorNotChannel"));

				client.player.stop(message);
				message.channel.send(i18n.__mf("play.stopSong", { author: user }));

				collector.stop();
			break;

			default:
				reaction.users.remove(user).catch(console.error);
			break;
		};
	});

	collector.on("end", () => {
		if (playingMessage && !playingMessage.deleted) {
			playingMessage.delete({ timeout: 3000 }).catch(console.error);
		};
	});
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
.on("channelEmpty", (message, queue) => {
	message.channel.send(i18n.__("play.everyoneLeft"));
	if (playingMessage) {
		playingMessage.delete({ timeout: 3000 }).catch(console.error);
	};
})
.on("botDisconnect", (message) => {
	message.channel.send(i18n.__("play.leaveChannel"));
	if (playingMessage) {
		playingMessage.delete({ timeout: 3000 }).catch(console.error);
	};
})
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