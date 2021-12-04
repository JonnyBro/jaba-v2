let config;

try {
	config = require("../config.json");
} catch (error) {
	config = null;
};

exports.TOKEN = config ? config.TOKEN : process.env.TOKEN;
exports.YOUTUBE_API_KEY = config ? config.YOUTUBE_API_KEY : process.env.YOUTUBE_API_KEY;
exports.SOUNDCLOUD_CLIENT_ID = config ? config.SOUNDCLOUD_CLIENT_ID : process.env.SOUNDCLOUD_CLIENT_ID;
exports.DBURL = config ? config.DBURL : process.env.DBURL;
exports.BIRTHDAYCHANNEL = config ? config.BIRTHDAYCHANNEL : process.env.BIRTHDAYCHANNEL;
exports.MAX_PLAYLIST_SIZE = (config ? config.MAX_PLAYLIST_SIZE : parseInt(process.env.MAX_PLAYLIST_SIZE)) || 10;
exports.PREFIX = config ? config.PREFIX : process.env.PREFIX;
exports.LOCALE = config ? config.LOCALE : process.env.LOCALE;
exports.STAY_TIME = (config ? config.STAY_TIME : parseInt(process.env.STAY_TIME)) || 30;
exports.DEFAULT_VOLUME = (config ? config.DEFAULT_VOLUME : parseInt(process.env.DEFAULT_VOLUME)) || 100;
exports.BOTOWNER = config ? config.BOTOWNER : process.env.BOTOWNER;