const { play } = require("../../include/play");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default
const https = require("https");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, DEFAULT_VOLUME } = require("../../util/util");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const i18n = require("../../util/i18n");

module.exports = {
	name: "play",
	cooldown: 3,
	aliases: ["p"],
	description: i18n.__("play.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	async execute(client, message, args) {
		const { channel } = message.member.voice;

		const serverQueue = client.queue.get(message.guild.id);
		if (!channel) return message.lineReply(i18n.__("common.errorNotChannel")).catch(console.error);
		if (serverQueue && channel !== message.guild.me.voice.channel) return message.lineReply(i18n.__mf("play.errorNotInSameChannel", { user: client.user })).catch(console.error);

		if (!args.length) return message.lineReply(i18n.__mf("play.usageReply", { prefix: client.prefix })).catch(console.error);

		const permissions = channel.permissionsFor(client.user);
		if (!permissions.has("CONNECT")) return message.lineReply(i18n.__("play.missingPermissionConnect"));
		if (!permissions.has("SPEAK")) return message.lineReply(i18n.__("play.missingPermissionSpeak"));

		const search = args.join(" ");
		const videoPattern = /^(https?:\/\/)?(www\.)?(m\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
		const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
		const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
		const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
		const url = args[0];

		// Запуск команды на плейлист если дана ссылка на плейлист
		if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
			return client.commands.get("playlist").execute(message, args);
		} else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
			return client.commands.get("playlist").execute(message, args);
		}

		if (mobileScRegex.test(url)) {
			try {
				https.get(url, function (res) {
					if (res.statusCode == "302") {
						return client.commands.get("play").execute(message, [res.headers.location]);
					} else {
						return message.lineReply("Ничего не найдено.").catch(console.error);
					}
				});
			} catch (error) {
				console.error(error);
				return message.lineReply(error.message).catch(console.error);
			}
			return message.lineReply("Следуем по редиректу ссылки...").catch(console.error);
		}

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

		let songInfo = null;
		let song = null;

		if (videoPattern.test(args[0])) {
			try {
				songInfo = await ytdl.getInfo(url);
				song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
					duration: songInfo.videoDetails.lengthSeconds
				};
			} catch (error) {
				console.error(error);
				return message.lineReply(error.message).catch(console.error);
			}
		} else if (scRegex.test(url)) {
			try {
				const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
				song = {
					title: trackInfo.title,
					url: trackInfo.permalink_url,
					duration: Math.ceil(trackInfo.duration / 1000)
				};
			} catch (error) {
				console.error(error);
				return message.lineReply(error.message).catch(console.error);
			}
		} else {
			try {
				const results = await youtube.searchVideos(search, 1, { part: "id" });
				songInfo = await ytdl.getInfo(results[0].url);
				song = {
					title: songInfo.videoDetails.title,
					url: songInfo.videoDetails.video_url,
					duration: songInfo.videoDetails.lengthSeconds
				};
			} catch (error) {
				console.error(error);
				if (error.message.includes("410")) {
					return message.lineReply("Видео ограничего по возрасту, приватное или недоступно").catch(console.error);
				} else {
					return message.lineReply(error.message).catch(console.error);
				 }
			}
		}

		if (serverQueue) {
			serverQueue.songs.push(song);
			return serverQueue.textChannel.send(i18n.__mf("play.queueAdded", { title: song.title, author: message.author })).catch(console.error);
		}

		queueConstruct.songs.push(song);
		client.queue.set(message.guild.id, queueConstruct);

		try {
			queueConstruct.connection = await channel.join();
			await queueConstruct.connection.voice.setSelfDeaf(true);
			play(queueConstruct.songs[0], message);
		} catch (error) {
			console.error(error);
			client.queue.delete(message.guild.id);
			await channel.leave();
			return message.channel.send(i18n.__("play.cantJoinChannel", {error: error})).catch(console.error);
		}
	}
};