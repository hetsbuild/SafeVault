const UserSchema = require('../../models/UserSchema');
const addActivity = require('../../utils/ActivityLoger');

const THRESHOLD = 0.6;

function euclideanDistance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += (a[i] - b[i]) * (a[i] - b[i]);
    }
    return Math.sqrt(sum);
}

const VerifyFace = async (req, res) => {
    try {
        const descriptor = req.body?.descriptor;
        if (!Array.isArray(descriptor) || descriptor.length !== 128) {
            return res.status(400).json({ success: false, message: "Invalid face descriptor. Expected an array of 128 numbers." });
        }
        const numericDescriptor = descriptor.slice(0, 128).map(Number);
        if (numericDescriptor.some(isNaN)) {
            return res.status(400).json({ success: false, message: "Face descriptor contains invalid values." });
        }

        const user = await UserSchema.findById(req.user._id);

        if (!user.faceDescriptor || user.faceDescriptor.length !== 128) {
            return res.status(404).json({ success: false, message: "No face registered for this account. Please register your face first." });
        }

        const distance = euclideanDistance(user.faceDescriptor, numericDescriptor);
        const match = distance < THRESHOLD;

        if (match) {
            addActivity(req.user._id, "verification", "Face verified successfully");
        }

        return res.status(200).json({
            success: true,
            verified: match,
            distance: Math.round(distance * 1000) / 1000,
            message: match ? "Face matched" : "Face did not match"
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

module.exports = VerifyFace;