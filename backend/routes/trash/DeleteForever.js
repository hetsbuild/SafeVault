const NoteSchema = require('../../models/NotesSchema');
const FolderSchema = require('../../models/FolderSchema');
const addActivity = require('../../utils/ActivityLoger');

async function deleteFolderTree(id, uid) {
    const childFolders = await FolderSchema.find({ parentId: id, userId: uid });
    for (const child of childFolders) {
        await deleteFolderTree(child._id, uid);
        await FolderSchema.findByIdAndDelete(child._id);
    }
    await NoteSchema.deleteMany({ parentId: id, userId: uid });
}

const DeleteForever = async (req, res) => {
    try {
        const { type, id } = req.params;
        const uid = req.user._id;

        if (type === "notes") {
            const found = await NoteSchema.findOneAndDelete({ _id: id, userId: uid });
            if (!found) return res.status(404).json({ success: false, message: "Note not found" });
            addActivity(uid, "delete", `deleted note ${found.title} permanently`);
            return res.status(200).json({ success: true, message: "Note deleted permanently" });
        }

        if (type === "folders") {
            const found = await FolderSchema.findOne({ _id: id, userId: uid });
            if (!found) return res.status(404).json({ success: false, message: "Folder not found" });
            await deleteFolderTree(id, uid);
            await FolderSchema.findByIdAndDelete(id);
            addActivity(uid, "delete", `deleted folder ${found.title} permanently`);
            return res.status(200).json({ success: true, message: "Folder deleted permanently" });
        }

        return res.status(400).json({ success: false, message: "Invalid type" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};

module.exports = DeleteForever;