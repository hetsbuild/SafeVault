const NoteSchema = require('../../models/NotesSchema');
const FolderSchema = require('../../models/FolderSchema');

const GetTrash = async (req, res) => {
    try {
        const uid = req.user._id;
        const notes = await NoteSchema.find({ userId: uid, isDeleted: true }).sort({ deletedAt: -1 });
        const folders = await FolderSchema.find({ userId: uid, isDeleted: true }).sort({ deletedAt: -1 });
        return res.status(200).json({ success: true, notes, folders });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

module.exports = GetTrash;