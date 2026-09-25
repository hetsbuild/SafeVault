const NoteSchema = require('../../models/NotesSchema')
const folderSchema = require("../../models/FolderSchema");

const getFolders = async (req, res) => {
  try {
    const { id, type } = req.params
    const uid = req.user._id;
    if (type === "all") {
      const folders = await folderSchema.find({ userId: uid, parentId: null, isDeleted: false })
        .populate({ path: "notes", match: { isDeleted: false } })
        .populate({ path: "folders", match: { isDeleted: false } });
      return res.status(200).json(folders);
    }

    const folder = await folderSchema.findOne({ _id: id, userId: uid, isDeleted: false });
    if (!folder) {
      return res.status(404).json({ success: false, message: "Folder not found" });
    }

    const [notes, folders] = await Promise.all([
      NoteSchema.find({ parentId: id, userId: uid, isDeleted: false }),
      folderSchema.find({ parentId: id, userId: uid, isDeleted: false })
    ]);

    return res.status(200).json({
      ...folder.toObject(),
      notes,
      folders,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

module.exports = getFolders