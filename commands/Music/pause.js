const { enabled } = require("../../modules/music_system");

module.exports = {
	name: "pause",
	description: "Pauses the current song (if playing).",
	guildOnly: true,
	emoji: ":play_pause:",
	async execute(client, message, args) {
		if (!enabled) return message.channel.send(require("../../messages.json").music_disabled);

		if (args[0].toLowerCase() == "on") {
			client.player.pause(message);
		} else if (args[0].toLowerCase() == "off") {
			client.player.resume(message);
		};
	}
};