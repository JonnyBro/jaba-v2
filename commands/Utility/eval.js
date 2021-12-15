const i18n = require("../../util/i18n");
const util = require("util");

module.exports = {
	name: "eval",
	description: i18n.__("eval.description"),
	emoji: ":computer:",
	aliases: ["dingus"],
	ownerOnly: true,
	async execute(client, message, args) {
		await message.react("🍔");

		try {
			function clean(text) {
				if (typeof(text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
				else return text;
			};

			const code = args.join(" ");
			let evaled = eval(code);

			if (typeof evaled !== "string") evaled = util.inspect(evaled);

			message.channel.send(clean(evaled), { code:"xl" });
		} catch (err) {
			await message.channel.send(`Ошибка в коде!\n\n${err}`);
			await message.react("🛑");
		};
	}
};