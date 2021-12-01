const i18n = require("../../util/i18n");

module.exports = {
	name: "ping",
	cooldown: 10,
	description: i18n.__("ping.description"),
	guildOnly: true,
	execute(client, message) {
		message.lineReply(i18n.__mf("ping.result", { ping: Math.round(client.ws.ping) })).catch(console.error);
	}
};