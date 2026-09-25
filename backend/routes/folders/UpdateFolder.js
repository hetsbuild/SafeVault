const FolderSchema = require("../../models/FolderSchema");
const addActivity = require("../../utils/ActivityLoger");

const UpdateFolder = async (req, res) => {
  const { title, desc, isPrivate, folderId } = req.body;
  const { id } = req.params;
  const uid = req.user._id;
  try {
    const existing = await FolderSchema.findOne({ _id: id, userId: uid });
    if (!existing) {
      return res.status(404).json({ msg: "Folder not found", success: false });
    }

    const updateData = {
      title: title || existing.title,
      desc: desc !== undefined ? desc : existing.desc,
      isPrivate: isPrivate === true || isPrivate === "true"
    };

    if (folderId && folderId !== "null") {
      updateData.parentId = folderId;
    } else if (folderId === "null" || folderId === "") {
      updateData.parentId = null;
    }

    const updated = await FolderSchema.findByIdAndUpdate(id, updateData, { new: true });
    addActivity(uid, "update", `updated folder ${updated.title}`)
    return res.status(200).json({ msg: "updated successfully", success: true });
  } catch (e) {
    return res.status(400).json({ msg: e.message, success: false });
  }
}
module.exports = UpdateFolder;