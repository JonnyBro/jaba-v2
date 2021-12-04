const { enabled } = require("../../modules/music_system");

module.exports = {
	name: "stop",
	description: "Clears the queue.",
	guildOnly: true,
	async execute(client, message, args) {
		if (!enabled) return message.lineReply(require("../../messages.json").music_disabled);
		client.player.clearQueue(message);
		message.channel.send(require("../../messages.json").music_queueclear);
	}
};