const { MessageEmbed } = require("discord.js");
const { enabled } = require("../../modules/music_system");

module.exports = {
	name: "queue",
	aliases: ["q"],
	description: "Displays the queue.",
	guildOnly: true,
	emoji: ":notepad_spiral:",
	async execute(client, message, args) {
		if (!enabled) return message.channel.send(require("../../messages.json").music_disabled);
		if (!message.member.voice.channel) return message.channel.send(require("../../messages.json").music_notconnected);
		if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(require("../../messages.json").music_notsamevc);
		if (!client.player.getQueue(message)) return message.channel.send(require("../../messages.json").music_queueempty);

		let queue = client.player.getQueue(message).tracks.map((tracks, i) => {
			return `${i === 0 ? "**Current:**" : `**${i+1}.**`} **\`${tracks.title}\`** : ${tracks.author}`
		}).join("\n");

		const embed = new MessageEmbed()
			.setTitle(`Queue`)
			.setColor(require("../../messages.json").embed_color)
			.setTimestamp()
			.setFooter(require("../../messages.json").embed_footer.replace("(NAME)", message.author.username), message.author.avatarURL())
			.setDescription(queue)
		message.channel.send(embed);
	},
};
