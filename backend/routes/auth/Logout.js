const userSchema = require('../../models/UserSchema');
const addActivity = require('../../utils/ActivityLoger');

const Logout = async (req, res) => {
    try {
        const uid = req.user._id;
        await userSchema.findByIdAndUpdate(uid, { token: null, refreshToken: null });
        addActivity(uid, "logout", "User logged out");

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
}

module.exports = Logout