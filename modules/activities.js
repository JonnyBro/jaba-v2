module.exports.name = "Discord VC Activities";

const enabled = true;
module.exports.enabled = enabled;

const client = require("../index.js").client;
const { DiscordTogether } = require("discord-together");
client.discordTogether = new DiscordTogether(client);

console.log("[INFO]".blue + " Discord Activities - Allows people to watch YouTube or play games together");