const { MessageEmbed } = require("discord.js");
const i18n = require("../../util/i18n");

module.exports = {
	name: "queue",
	cooldown: 5,
	aliases: ["q"],
	description: i18n.__("queue.description"),
	emoji: ":musical_note:",
	guildOnly: true,
	async execute(client, message) {
		const permissions = message.channel.permissionsFor(client.user);
		if (!permissions.has(["MANAGE_MESSAGES"]))
			return message.lineReply(i18n.__("queue.missingPermissionMessage"));

		const queue = client.queue.get(message.guild.id);
		if (!queue) return message.channel.send(i18n.__("common.errorNotQueue"));

		let currentPage = 0;

		try {
			var embeds = generateQueueEmbed(message, queue.songs);

			var left = new message.client.buttons.MessageButton()
				.setStyle("blurple")
				.setEmoji("⬅️")
				.setID("left_button")
			var right = new message.client.buttons.MessageButton()
				.setStyle("blurple")
				.setEmoji("➡️")
				.setID("right_button")

			var queueEmbed = await message.channel.send(`**${i18n.__("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`, {
				embed: embeds[currentPage],
				buttons: [ left, right ]
			});

			message.client.once("clickButton", async (button) => {
				switch (button.id) {
					case "left_button":
						if (currentPage !== 0) {
							--currentPage;
							queueEmbed.edit(i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }), {
								embed: embeds[currentPage],
								buttons: [ left, right ]
							});
						}
					break;

					case "right_button":
						if (currentPage < embeds.length - 1) {
							currentPage++;
							queueEmbed.edit(i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }), {
								embed: embeds[currentPage],
								buttons: [ left, right ]
							});
						}
					break;
				}
			});
		} catch (error) {
			console.error(error);
			message.channel.send(error.message).catch(console.error);
		}
	}
};

function generateQueueEmbed(message, queue) {
	let embeds = [];
	let k = 10;

	for (let i = 0; i < queue.length; i += 10) {
		const current = queue.slice(i, k);
		let j = i;
		k += 10;

		const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");

		const embed = new MessageEmbed()
			.setTitle(i18n.__("queue.embedTitle"))
			.setThumbnail(message.guild.iconURL())
			.setColor("#F8AA2A")
			.setDescription(
				i18n.__mf("queue.embedCurrentSong", { title: queue[0].title, url: queue[0].url, info: info })
			)
			.setTimestamp();
		embeds.push(embed);
	}

	return embeds;
}
