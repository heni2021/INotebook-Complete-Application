const mongoose = require('mongoose');
const mongoUri = "mongodb://localhost:27017/learn_MERN_database"

const connectToMongo = async() => {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB!");
}
module.exports = connectToMongo;