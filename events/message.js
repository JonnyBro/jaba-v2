const { Collection } = require("discord.js");
const { BOTOWNER } = require("../util/util");
const i18n = require("../util/i18n");
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = async (client, message) => {
	if (message.author.bot) return;

	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(client.prefix)})\\s*`);
	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);

	const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === "dm") return message.lineReply(i18n.__("common.guildOnly"));

	if (command.ownerOnly && message.author.id != BOTOWNER) return message.lineReply(i18n.__("common.ownerOnly"));

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.lineReply(i18n.__("common.noPermissions"));
		};
	};

	if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Collection());

	const now = Date.now();
	const timestamps = client.cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 1) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.lineReply(i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: command.name }));
		};
	};

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(client, message, args);
	} catch (error) {
		console.error(error);
		message.lineReply(i18n.__("common.errorCommend")).catch(console.error);
	};
};