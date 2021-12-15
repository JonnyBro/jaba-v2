let config;

try {
	config = require("../config.json");
} catch (error) {
	config = null;
};

exports.TOKEN = config ? config.TOKEN : process.env.TOKEN;
exports.YOUTUBE_API_KEY = config ? config.YOUTUBE_API_KEY : process.env.YOUTUBE_API_KEY;
exports.DBURL = config ? config.DBURL : process.env.DBURL;
exports.BIRTHDAYCHANNEL = config ? config.BIRTHDAYCHANNEL : process.env.BIRTHDAYCHANNEL;
exports.PREFIX = config ? config.PREFIX : process.env.PREFIX;
exports.LOCALE = config ? config.LOCALE : process.env.LOCALE;
exports.BOTOWNER = config ? config.BOTOWNER : process.env.BOTOWNER;