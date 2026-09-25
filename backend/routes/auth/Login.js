const userSchema = require('../../models/UserSchema');
const bcrypt = require('bcrypt');
const addActivity = require('../../utils/ActivityLoger');
const generateToken = require('../../utils/GenrateToken');

const Login = async (req, res) => {
    try {
        let ExistingUser = await userSchema.findOne({ email: res.locals.data.email });

        if (!ExistingUser) {
            return res.status(400).send({ success: false, message: 'User does not exist' });
        }

        const match = await bcrypt.compare(res.locals.data.password, ExistingUser.password);
        if (!match) {
            return res.status(400).send({ success: false, message: "Password is wrong" });
        }

        addActivity(ExistingUser._id, "login", "User logged in successfully")
        const tokens = await generateToken(ExistingUser._id, res.locals.data.remember);
        res.cookie("token", tokens.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        if (tokens.refreshToken) {
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
        }

        return res.status(200).send({
            success: true,
            message: "login successful",
            name: ExistingUser.firstName + " " + ExistingUser.lastName,
            _id: ExistingUser._id,
            email: ExistingUser.email,
            hasFace: (ExistingUser.faceDescriptor && ExistingUser.faceDescriptor.length > 0)
        });
    } catch (err) {
        return res.status(500).send({ success: false, message: "Server error", error: err.message });
    }
}

module.exports = Login