const i18n = require("../../util/i18n");

module.exports = {
	name: "say",
	description: i18n.__("say.description"),
	guildOnly: true,
	ownerOnly: true,
	async execute(client, message, args) {
		// Разделение аргументов
		let split = "++";
		args = args.join(" ").split(split);
		for (var i = 0; i < args.length; i++) args[i] = args[i].trim();

		if (!args[0]) return message.lineReply(i18n.__("common.noMessage").then(msg => msg.delete(2000)));

		await message.delete();

		if (args[1] == "g") {
			const saychannel = message.guild.channels.cache.find(channel => (channel.name.includes("основной") || channel.name.includes("general")))
			saychannel.startTyping();

			setTimeout(function() {
				saychannel.send(args[0]);
				saychannel.stopTyping();
			}, 2000);
		} else if (args[1]) {
			const saychannel = message.guild.channels.cache.find(channel => channel.name == args[1]) || message.guild.channels.cache.find(channel => channel.id == args[1]);
			saychannel.startTyping();

			setTimeout(function() {
				saychannel.send(args[0]);
				saychannel.stopTyping();
			}, 2000);
		} else {
			const saychannel = message.channel;
			saychannel.startTyping();

			setTimeout(function() {
				saychannel.send(args[0]);
				saychannel.stopTyping();
			}, 2000);
		};
	}
};