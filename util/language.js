const ServerRepository = require("../repositories/server-repository");
const lang = require("../locales/languages.json");

const guildLanguages = {};

const loadLanguages = async (client) => {
	try {
		// console.log("loading!");
		for (const guild of client.guilds.cache) {
			const dbServer = await ServerRepository.findOrCreate(guild);

			guildLanguages[guild.id] = dbServer ? dbServer.language : "ru";
		}
	} catch (e) {
		console.error(e);
	};
}

const setLanguage = (guild, language) => {
	guildLanguages[guild.id] = language.toLowerCase();
}

const getLocale = async (guild, phrase) => {
	const selectedLanguage = guildLanguages[guild.id].toLowerCase();
	// const selectedLanguage = "ru";
	const args = phrase.split(".");
	console.log(args)

	if (!lang[selectedLanguage][args[0]][args[1]]) {
		throw new Error(`Неизвестный ID локализации "${phrase}"`);
	};

	return lang[selectedLanguage][args[0]][args[1]];
}

module.exports.getLocale = getLocale;
module.exports.loadLanguages = loadLanguages;
module.exports.setLanguage = setLanguage;