const ytdl = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader").default;
const { canModifyQueue, STAY_TIME } = require("../util/Util");
const i18n = require("../util/i18n");

module.exports = {
	async play(song, message) {
		const { SOUNDCLOUD_CLIENT_ID } = require("../util/Util");

		const queue = message.client.queue.get(message.guild.id);

		if (!song) {
			setTimeout(function () {
				if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
				queue.channel.leave();
				queue.textChannel.send(i18n.__("play.leaveChannel"));
			}, STAY_TIME * 1000);
			queue.textChannel.send(i18n.__("play.queueEnded")).catch(console.error);
			return message.client.queue.delete(message.guild.id);
		}

		let stream = null;
		let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

		try {
			if (song.url.includes("youtube.com")) {
				stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
			} else if (song.url.includes("soundcloud.com")) {
				try {
					stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID);
				} catch (error) {
					stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);
					streamType = "unknown";
				}
			}
		} catch (error) {
			if (queue) {
				queue.songs.shift();
				module.exports.play(queue.songs[0], message);
			}

			console.error(error);
			return message.channel.send(
				i18n.__mf("play.queueError", { error: error.message ? error.message : error })
			);
		}

		queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

		const dispatcher = queue.connection
			.play(stream, { type: streamType })
			.on("finish", () => {
				if (queue.loop) {
					// if loop is on, push the song back at the end of the queue
					// so it can repeat endlessly
					let lastSong = queue.songs.shift();
					queue.songs.push(lastSong);
					module.exports.play(queue.songs[0], message);
				} else if (queue.loopSong) {
					// repeat the current song endlessly
					module.exports.play(queue.songs[0], message);
				} else {
					// Recursively play the next song
					queue.songs.shift();
					module.exports.play(queue.songs[0], message);
				}
			})
			.on("error", (err) => {
				console.error(err);
				queue.songs.shift();
				module.exports.play(queue.songs[0], message);
			});
		dispatcher.setVolumeLogarithmic(queue.volume / 100);

		try {
			const skip = new message.client.buttons.MessageButton()
				.setStyle("green")
				.setEmoji("⏭")
				.setLabel(i18n.__("buttons.skip_button"))
				.setID("skip_button")
			const loop = new message.client.buttons.MessageButton()
				.setStyle("green")
				.setEmoji("🔁")
				.setLabel(i18n.__("buttons.loop_button"))
				.setID("loop_button")
			const loopSong = new message.client.buttons.MessageButton()
				.setStyle("green")
				.setEmoji("🔂")
				.setLabel(i18n.__("buttons.loopSong_button"))
				.setID("loopSong_button")
			const stop = new message.client.buttons.MessageButton()
				.setStyle("green")
				.setEmoji("⏹")
				.setLabel(i18n.__("buttons.stop_button"))
				.setID("stop_button")

			var buttons = [skip, loop, loopSong, stop];

			await queue.textChannel.send(
				i18n.__mf("play.startedPlaying", { title: song.title, url: song.url }), {
					buttons: buttons
				}
			);

			message.client.once("clickButton", async (button) => {
				const member = button.clicker.member;
				const user = button.clicker.user;

				switch (button.id) {
					case "skip_button":
						queue.playing = true;
						if (!canModifyQueue(member)) return button.reply.send(i18n.__("common.errorNotChannel"), true);
						queue.connection.dispatcher.end();
						button.reply.send(i18n.__mf("play.skipSong", { author: user })).catch(console.error);
						setTimeout(() => {
							if (button.message) {
								button.message.delete();
							};
						}, 2000);
					break;

					case "loop_button":
						if (!canModifyQueue(member)) return button.reply.send(i18n.__("common.errorNotChannel"), true);
						queue.loopSong = false;
						queue.loop = !queue.loop;
						button.reply.send(i18n.__mf("play.loopSong", { author: user, loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") }), true).catch(console.error);
					break;

					case "loopSong_button":
						if (!canModifyQueue(member)) return button.reply.send(i18n.__("common.errorNotChannel"), true);
						queue.loop = false;
						queue.loopSong = !queue.loopSong;
						button.reply.send(i18n.__mf("play.loopSong", { author: user, loop: queue.loopSong ? i18n.__("common.on") : i18n.__("common.off")})).catch(console.error);
					break;

					case "stop_button":
						if (!canModifyQueue(member)) return button.reply.send(i18n.__("common.errorNotChannel"), true);
						queue.songs = [];
						button.reply.send(i18n.__mf("play.stopSong", { author: user })).catch(console.error);
						try {
							queue.connection.dispatcher.end();
						} catch (error) {
							console.error(error);
							queue.connection.disconnect();
						};
						setTimeout(() => {
							if (button.message) {
								button.message.delete();
							};
						}, 2000);
					break;
				}
			});
		} catch (error) {
			console.error(error);
		}
	}
};