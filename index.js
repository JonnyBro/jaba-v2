const { Client, Collection, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const { TOKEN, PREFIX } = require("./util/util");

const path = require("path");

require("discord-reply");
require("colors");

const client = new Client({
	disableMentions: "everyone",
	restTimeOffset: 0,
	fetchAllMembers: true
});

module.exports.client = client;

client.login(TOKEN);

client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
client.mongoose = require("./util/mongoose");
client.cooldowns = new Collection();
client.helpPages = [];

client.buttons = require("discord-buttons");
client.buttons(client);

/*
 * Client Events
 */
client.on("warn", (warn) => console.log(warn));
client.on("error", console.error);

/*
 * Modules Handler
 */
const modules = fs.readdirSync("./modules").filter(file => file.endsWith(".js"));
for (const file of modules) {
	const module = require(`./modules/${file}`);
	console.log("[INIT]".gray + ` ${module.name} - module loaded`);
};

/*
 * Events Handler
 */
const eventFiles = readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
	const eventName = file.split(".")[0];
	const event = require(`./events/${file}`);
	try {
		client.on(eventName, event.bind(null, client));
		console.log("[INIT]".gray + ` ${eventName} - event loaded`);
	} catch(error) {
		console.error(error);
	};
};

/**
 * Commands Handler
 */
const commandFolders = readdirSync(path.join(__dirname, "commands"));
for (const folder of commandFolders) {
	const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
		console.log("[INIT]".gray + ` ${command.name} - command loaded`);
	};
};

/**
 * Help Pages
 */
const commandFoldersForHelp = readdirSync("./commands");
for (const folder of commandFoldersForHelp) {
	const data = [];
	let embed = new MessageEmbed()
		.setTitle("Список команд")
		.setColor("RANDOM")

	data.push(`**${path.basename(folder)}**`);

	const commandFiles = readdirSync(`./commands/${folder}`);
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		data.push(`${command.emoji || ":package:"} **${command.name} ${command.aliases ? `(${command.aliases.join(", ")})` : ""}** - ${command.description}`);
	};

	embed.setDescription(data);
	client.helpPages.push(embed);
};