const FolderSchema = require("../../models/FolderSchema");
const NoteSchema = require("../../models/NotesSchema")

const AddInsideFolder = async (req, res) => {
    const { folderId, uploadId, type } = req.body;
    const uid = req.user._id;

    if (!folderId || !uploadId || !uid) {
        return res.status(400).json({ msg: "data is missing", success: false });
    }
    try {
        const parent = await FolderSchema.findOne({ _id: folderId, userId: uid });
        if (!parent) {
            return res.status(400).json({ msg: "Parent folder not found", success: false });
        }

        if (type === "notes") {
            await NoteSchema.findByIdAndUpdate(uploadId, { parentId: folderId, userId: uid });
            await FolderSchema.findByIdAndUpdate(folderId, {
                $addToSet: { notes: uploadId, folders: [] }
            }, { new: true });
        } else if (type === "folders") {
            await FolderSchema.findByIdAndUpdate(uploadId, { parentId: folderId, userId: uid });
            await FolderSchema.findByIdAndUpdate(folderId, {
                $addToSet: { folders: uploadId, notes: [] }
            }, { new: true });
        } else {
            return res.status(400).json({ msg: "Invalid type", success: false });
        }

        return res.status(200).json({ msg: `${type} added`, success: true });
    } catch (e) {
        return res.status(400).json({ msg: e.message, success: false });
    }
}
module.exports = AddInsideFolder;