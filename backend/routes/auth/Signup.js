const userSchema = require('../../models/UserSchema');
const bcrypt = require('bcrypt');
const addActivity = require('../../utils/ActivityLoger');
const generateToken = require('../../utils/GenrateToken');

const Signup = async (req, res) => {
    try {
        const existing = await userSchema.findOne({ email: res.locals.data.email });

        if (existing) {
            return res.status(400).send({ success: false, message: 'User already exists' });
        }

        const hash = await bcrypt.hash(res.locals.data.password, 10);
        const data = { ...res.locals.data, password: hash };

        const user = await userSchema.create(data);

        addActivity(user._id, "login", "created account");
        const tokens = await generateToken(user._id, res.locals.data.remember);
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
            message: "Sign up successful",
            name: user.firstName + " " + user.lastName,
            _id: user._id,
            email: user.email,
            hasFace: false
        });
    } catch (err) {
        return res.status(500).send({ success: false, message: "Server error", error: err.message });
    }
}

module.exports = Signup