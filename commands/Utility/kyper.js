module.exports = {
	name: "kyper",
	description: "",
	emoji: ":pleading_face:",
	async execute(client, message) {
		message.lineReply(``, {
			files: ["./kyper.mp4"]
		})
	},
};