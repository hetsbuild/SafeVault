const UserSchema = require('../../models/UserSchema');

const Profile = async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      _id: user._id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      hasFace: Array.isArray(user.faceDescriptor) && user.faceDescriptor.length > 0,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = Profile;