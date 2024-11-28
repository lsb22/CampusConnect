require("dotenv").config();

const mongo_password = process.env.MONGO_PASSWORD;
const mongo_username = process.env.MONGO_USERNAME;

const connectionString = `mongodb+srv://${mongo_username}:${mongo_password}@cluster1.8nvln.mongodb.net/college?retryWrites=true&w=majority&appName=Cluster1`;

module.exports.str = connectionString;
