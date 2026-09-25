const ActivityLog = require('../models/ActivityLogSchema');

async function addActivity(userId, type, logMessage) {
    try {
        await ActivityLog.create({
            userId,
            type,
            log: logMessage
        });
    } catch (err) {
        console.error("Activity log error:", err);
    }
}

module.exports = addActivity;
