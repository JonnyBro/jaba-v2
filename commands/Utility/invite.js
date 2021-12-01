const i18n = require("../../util/i18n");

module.exports = {
	name: "invite",
	description: i18n.__("invite.description"),
	execute(client, message) {
		client.generateInvite({ permissions: ["ADMINISTRATOR"] }).then(link => message.lineReply(`${link}`));
	}
};