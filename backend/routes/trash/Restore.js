const NoteSchema = require('../../models/NotesSchema');
const FolderSchema = require('../../models/FolderSchema');
const addActivity = require('../../utils/ActivityLoger');

const Restore = async (req, res) => {
    try {
        const { type, id } = req.params;
        const uid = req.user._id;

        if (type === "notes") {
            const updated = await NoteSchema.findOneAndUpdate(
                { _id: id, userId: uid },
                { isDeleted: false, deletedAt: null },
                { new: true }
            );
            if (!updated) return res.status(404).json({ success: false, message: "Note not found" });
            addActivity(uid, "update", `restored note ${updated.title}`);
            return res.status(200).json({ success: true, message: "Note restored" });
        }

        if (type === "folders") {
            const updated = await FolderSchema.findOneAndUpdate(
                { _id: id, userId: uid },
                { isDeleted: false, deletedAt: null },
                { new: true }
            );
            if (!updated) return res.status(404).json({ success: false, message: "Folder not found" });
            await NoteSchema.updateMany({ parentId: id, userId: uid, isDeleted: true }, { isDeleted: false, deletedAt: null });
            await FolderSchema.updateMany({ parentId: id, userId: uid, isDeleted: true }, { isDeleted: false, deletedAt: null });
            addActivity(uid, "update", `restored folder ${updated.title}`);
            return res.status(200).json({ success: true, message: "Folder restored" });
        }

        return res.status(400).json({ success: false, message: "Invalid type" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

module.exports = Restore;