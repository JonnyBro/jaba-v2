let config;

try {
	config = require("../config.json");
} catch (error) {
	config = null;
};

exports.TOKEN = config ? config.TOKEN : process.env.TOKEN;
exports.YOUTUBE_TOKEN = config ? config.YOUTUBE_TOKEN : process.env.YOUTUBE_TOKEN;
exports.DBURL = config ? config.DBURL : process.env.DBURL;
exports.BIRTHDAYCHANNEL = config ? config.BIRTHDAYCHANNEL : process.env.BIRTHDAYCHANNEL;
exports.PREFIX = config ? config.PREFIX : process.env.PREFIX;
exports.LOCALE = config ? config.LOCALE : process.env.LOCALE;
exports.BOTOWNER = config ? config.BOTOWNER : process.env.BOTOWNER;