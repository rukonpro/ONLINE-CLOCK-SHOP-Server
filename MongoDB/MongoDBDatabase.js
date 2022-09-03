const client = require("./MongoDBClient");

const databases = client.db('PremierPotteryRetailer');

module.exports = databases;