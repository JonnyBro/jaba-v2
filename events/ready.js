const { BIRTHDAYCHANNEL } = require("../util/util");
const cron = require("node-cron");
const ServerRepository = require("../repositories/server-repository.js");

module.exports = async (client) => {
	await client.mongoose.init();

	console.log(`\nLoaded a total of ${client.commands.size} command(s)`)
	console.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.filter(guild => guild.id != 892727526911258654).size} servers`);
	client.generateInvite({ permissions: ["ADMINISTRATOR"] }).then(link => console.log(`Invite Link: ${link}`));
	client.user.setPresence({ activity: { name: `${client.prefix}help и ${client.prefix}play`, type: "WATCHING" }, status: "online" });

	let i = 0;
	setInterval(() => {
		const servers = client.guilds.cache.filter(guild => guild.id != 892727526911258654).size;

		const statuses = [
			`${client.prefix}help и ${client.prefix}play, WATCHING`,
			`${servers} сервер(а/ов), WATCHING`
		];
		const status = statuses[i].split(", "); // name = [0], type = [1]
		i = (i + 1) % statuses.length;

		client.user.setPresence({ activity: { name: status[0], type: status[1] }, status: "online" });
	}, 30000); // 1 * 30 * 1000 (m, s, ms)

	cron.schedule("0 10 * * *", () => {
		const date = new Date();
		const currentMonth = date.getMonth() + 1;
		const currentDay = date.getDate();

		client.guilds.cache.forEach(async (guild) => {
			const dbServer = await ServerRepository.findOrCreate(guild);
			let flag = false;
			let birthdayChannel = null;
			guild.channels.cache.forEach(channel => {
				if (channel.name.includes(BIRTHDAYCHANNEL)) {
					flag = true;
					birthdayChannel = channel;
				};
			});

			if (!flag) birthdayChannel = await guild.channels.create(BIRTHDAYCHANNEL, "text/voice");

			dbServer.members.forEach(member => {
				const month = member.birthday.getUTCMonth() + 1;
				const day = member.birthday.getUTCDate();
				if (month === currentMonth && day === currentDay) {
					birthdayChannel.send(`||@everyone|| Сегодня день рождения <@${member.discord_id}>!`, {
						files: ["./birthday.png"]
					});
				};
			});
		});
	}, {
		scheduled: true,
		timezone: "Europe/Moscow"
	});
};