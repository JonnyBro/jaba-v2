const paginationEmbed = require("discord.js-pagination-fork");
const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "help",
	description: i18n.__("help.description"),
	usage: "[опционально (команда)]",
	async execute(client, message, args) {
		if (!args.length) return paginationEmbed(message, client.helpPages);

		const data = [];
		const { commands } = client;
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) return message.channel.send(i18n.__("common.noCommandExists"));

		data.push(`${command.emoji || ":package:"} **${command.name}**`);
		if (command.aliases) data.push(`**${i18n.__("help.aliases")}:** ${command.aliases.join(", ")}`);
		if (command.description) data.push(`**${i18n.__("help.cmdDesc")}:** ${command.description}`);
		if (command.usage) data.push(`**${i18n.__("help.usage")}:** **\`${client.prefix}${command.name} ${command.usage}\`**`);

		data.push(`**${i18n.__("help.cooldown")}:** ${command.cooldown || ""} сек`);

		const comembed = new MessageEmbed()
			.setColor("RANDOM")
			.setTimestamp()
			.setFooter(i18n.__mf("common.executedBy", { name: message.author.username }), message.author.avatarURL())
			.setDescription(data.join("\n"))
		return message.channel.send(comembed);
	}
};