const { LOCALE } = require("./util");
const { join } = require("path");
const i18n = require("i18n");

i18n.configure({
	locales: ["ru", "uk"],
	directory: join(__dirname, "../locales"),
	defaultLocale: "ru",
	objectNotation: true,
	register: global,

	logWarnFn: function (msg) {
		console.log("warn", msg);
	},

	logErrorFn: function (msg) {
		console.log("error", msg);
	},

	missingKeyFn: function (locale, value) {
		return value;
	},

	mustacheConfig: {
		tags: ["{{", "}}"],
		disable: false
	}
});

i18n.setLocale(LOCALE);

module.exports = i18n;