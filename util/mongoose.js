const mongoose = require("mongoose");
const { DBURL } = require("./Util");

mongoose.Promise = global.Promise;

mongoose.connection.on("connected", () => {
	console.log("Mongoose has suceesfully connected.");
})

mongoose.connection.on("err", () => {
	console.error(`Mongoose connection error: \n${err.stack}.`);
})

mongoose.connection.on("disconected", () => {
	console.warn("Mongoose has disconnected.");
})

module.exports = {
	init: async () => {
		const dbOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: false,
			connectTimeoutMS: 10000,
			family: 4,
		};

		await mongoose.connect(DBURL, dbOptions);

		return mongoose.connection
	},
	close: () => {
		mongoose.connection.close();
	}
}