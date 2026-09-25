const ActivityLogSchema = require("../../models/ActivityLogSchema");

const getAcitity = async (req, res) => {
  try {
    const userid = req.user._id;
    const data = await ActivityLogSchema.find({ userId: userid }).sort({ createdAt: -1 }).limit(50);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, data: "something went wrong" });
  }
}

module.exports = getAcitity