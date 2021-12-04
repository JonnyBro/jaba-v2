const { enabled } = require("../../modules/music_system");

module.exports = {
	name: "skip",
	description: "Skips the current song.",
	guildOnly: true,
	emoji: ":middle_finger:",
	async execute(client, message, args) {
		if (!enabled) return message.channel.send(require("../../messages.json").music_disabled);
		client.player.skip(message);
	}
};