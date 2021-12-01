const { readdirSync } = require("fs");
const i18n = require("../../util/i18n");

module.exports = {
	name: "reload",
	description: i18n.__("reload.description"),
	emoji: ":pleading_face:",
	async execute(client, message, args) {
		if (!args || args.length < 1) return message.lineReply(i18n.__("reload.noCommand"));

		const commandName = args[0];
		if (!client.commands.has(commandName)) {
			return message.lineReply(i18n.__("common.noCommandExists"));
		}

		const commandsFolders = readdirSync("./commands");

		for (const folder of commandsFolders) {
			const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));

			for (const file of commandFiles) {
				const fileName = file.split(".")[0];

				if (fileName === commandName) {
					delete require.cache[require.resolve(`../${folder}/${commandName}.js`)];
					client.commands.delete(commandName);

					const command = require(`../${folder}/${file}`);
					client.commands.set(command.name, command);

					message.lineReply(i18n.__mf("reload.reloaded", { command: commandName }));
					console.log(`Command ${commandName} reloaded!`)
				}
			}
		}
	},
};