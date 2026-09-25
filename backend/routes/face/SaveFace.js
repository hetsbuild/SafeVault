const UserSchema = require('../../models/UserSchema');
const addActivity = require('../../utils/ActivityLoger');

const SaveFace = async (req, res) => {
    try {
        const descriptor = req.body?.descriptor;
        if (!Array.isArray(descriptor) || descriptor.length !== 128) {
            return res.status(400).json({ success: false, message: "Invalid face descriptor. Expected an array of 128 numbers." });
        }
        const numericDescriptor = descriptor.slice(0, 128).map(Number);
        if (numericDescriptor.some(isNaN)) {
            return res.status(400).json({ success: false, message: "Face descriptor contains invalid values." });
        }

        await UserSchema.findByIdAndUpdate(req.user._id, { faceDescriptor: numericDescriptor });
        addActivity(req.user._id, "verification", "Face registered");

        return res.status(200).json({ success: true, message: "Face saved successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

module.exports = SaveFace;