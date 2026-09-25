const NoteSchema = require('../../models/NotesSchema');
const FolderSchema = require('../../models/FolderSchema');

const Search = async (req, res) => {
    try {
        const q = (req.query.q || "").trim();
        const uid = req.user._id;

        if (!q) {
            return res.status(200).json({ success: true, notes: [], folders: [] });
        }

        const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

        const [notes, folders] = await Promise.all([
            NoteSchema.find({ userId: uid, isDeleted: false, $or: [{ title: regex }, { desc: regex }] }).sort({ updatedAt: -1 }),
            FolderSchema.find({ userId: uid, isDeleted: false, $or: [{ title: regex }, { desc: regex }] }).sort({ updatedAt: -1 }),
        ]);

        return res.status(200).json({ success: true, notes, folders });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

module.exports = Search;