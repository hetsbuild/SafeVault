const fs = require("fs");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFiles = async (files) => {
    const uploaded = [];

    for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
        uploaded.push({
            url: result.secure_url,
            file_type: file.mimetype,
            name: file.originalname
        });
        if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

    return uploaded;
};

const cleanupFiles = (files) => {
    if (!files) return;
    files.forEach((file) => {
        if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
};

const parseExistingFiles = (raw, fallback) => {
    if (!raw) return fallback;
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
};

module.exports = { uploadFiles, cleanupFiles, parseExistingFiles };