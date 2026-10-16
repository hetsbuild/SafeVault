const mongoose = require('mongoose')
require("dotenv").config();

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

let retries = 0;

mongoose.connection.on('connected', () => {
    retries = 0;
    console.log("connected");
});

mongoose.connection.on('disconnected', () => {
    console.warn("mongodb disconnected");
});

mongoose.connection.on('error', (err) => {
    console.error("mongodb error:", err.message);
});

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000
        });
    } catch (err) {
        retries += 1;
        console.error(`mongodb connection failed (attempt ${retries}/${MAX_RETRIES}): ${err.message}`);

        if (retries >= MAX_RETRIES) {
            console.error("giving up on mongodb connection. Exiting so the issue is visible.");
            process.exit(1);
        }

        setTimeout(connect, RETRY_DELAY_MS);
    }
}

connect();

module.exports = mongoose;