const folderSchema = require("../../models/FolderSchema")
const notesSchema = require("../../models/NotesSchema")


const getRecent = async (req, res) => {
  try {
    const uid = req.user._id;
    const folders = await folderSchema.find({ userId: uid, isDeleted: false }).sort({ updatedAt: -1 }).limit(5);
    const notes = await notesSchema.find({ userId: uid, isDeleted: false }).sort({ updatedAt: -1 }).limit(5);
    return res.status(200).json({ notes, folders });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

module.exports = getRecent;