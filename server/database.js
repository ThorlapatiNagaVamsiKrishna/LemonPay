const mongoose = require('mongoose')
const createDatabaseConnection = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/TaskManger')
        console.log('Connected to Mongo DB')
    }
    catch (e) {
        console.log(e.massage)
        process.exit(1)
    }
}

module.exports = { createDatabaseConnection }