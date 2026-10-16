const FolderSchema = require("../../models/FolderSchema");
const addActivity = require("../../utils/ActivityLoger");

const DeleteFolderFile = async (req, res) => {
    const { id, index } = req.params;
    const uid = req.user._id;

    try {
        const folder = await FolderSchema.findOne({ _id: id, userId: uid, isDeleted: false });
        if (!folder) {
            return res.status(404).json({ msg: "Folder not found", success: false });
        }

        const fileIndex = Number(index);
        if (!Number.isInteger(fileIndex) || fileIndex < 0 || fileIndex >= folder.files_url.length) {
            return res.status(404).json({ msg: "File not found in this folder", success: false });
        }

        const removed = folder.files_url[fileIndex];
        folder.files_url.splice(fileIndex, 1);
        await folder.save();

        addActivity(uid, "delete", `removed file ${removed.name || ""} from folder ${folder.title}`.trim());

        return res.status(200).json({
            msg: "File removed",
            success: true,
            files_url: folder.files_url
        });
    } catch (e) {
        return res.status(400).json({ msg: e.message, success: false });
    }
}
module.exports = DeleteFolderFile;