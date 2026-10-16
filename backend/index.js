const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieparser = require("cookie-parser");
const routes = require('./routes/route')
const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const PORT = process.env.PORT || 3000;

const isLocalOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin === CLIENT_ORIGIN || isLocalOrigin(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookieparser());

require('./Database/dbconnection')

app.use('/', routes)

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err);

    if (err.code === "UNSUPPORTED_FILE_TYPE") {
        return res.status(400).json({ success: false, msg: err.message, message: err.message });
    }

    if (err.name === "MulterError") {
        const msg = err.code === "LIMIT_FILE_SIZE"
            ? "File is too large. Maximum size allowed is 25 MB."
            : err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE"
                ? "You can attach a maximum of 10 files at a time."
                : "File upload failed: " + err.message;
        return res.status(400).json({ success: false, msg, message: msg });
    }

    res.status(err.status || 500).json({ success: false, message: err.message || "Internal server error" });
});

app.listen(PORT, () => {
    console.log("server start at port " + PORT);
})