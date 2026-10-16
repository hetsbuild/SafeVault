const path = require("path");

const ALLOWED_MIME_TYPES = [
    "image/",
    "video/",
    "audio/",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/json",
    "text/plain",
    "text/csv",
];

const ALLOWED_EXTENSIONS = [
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp",
    ".mp4", ".mov", ".avi", ".mkv", ".webm",
    ".mp3", ".wav", ".ogg", ".m4a",
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".txt", ".csv", ".json", ".zip", ".rar", ".7z",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const isAllowedFile = (file) => {
    const mimetype = (file.mimetype || "").toLowerCase();
    const ext = path.extname(file.originalname || "").toLowerCase();

    const mimeAllowed = ALLOWED_MIME_TYPES.some((type) =>
        type.endsWith("/") ? mimetype.startsWith(type) : mimetype === type
    );

    return mimeAllowed || ALLOWED_EXTENSIONS.includes(ext);
};

module.exports = { isAllowedFile, MAX_FILE_SIZE };