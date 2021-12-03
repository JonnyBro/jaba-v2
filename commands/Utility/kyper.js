module.exports = {
	name: "kyper",
	description: "kyper is gay",
	emoji: ":pleading_face:",
	async execute(client, message) {
		message.lineReply(`<3`, {
			files: ["./kyper.mp4"]
		});
	}
};