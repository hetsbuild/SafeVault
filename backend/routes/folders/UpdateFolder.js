const FolderSchema = require("../../models/FolderSchema");
const addActivity = require("../../utils/ActivityLoger");
const { uploadFiles, cleanupFiles, parseExistingFiles } = require("../../utils/uploadFiles");

const UpdateFolder = async (req, res) => {
  const { title, desc, isPrivate, folderId } = req.body;
  const { id } = req.params;
  const uid = req.user._id;
  try {
    const existing = await FolderSchema.findOne({ _id: id, userId: uid });
    if (!existing) {
      cleanupFiles(req.files);
      return res.status(404).json({ msg: "Folder not found", success: false });
    }

    const newFiles = req.files && req.files.length > 0
      ? await uploadFiles(req.files)
      : [];

    const existingFiles = parseExistingFiles(req.body.existingFiles, existing.files_url);

    const updateData = {
      title: title || existing.title,
      desc: desc !== undefined ? desc : existing.desc,
      isPrivate: isPrivate === true || isPrivate === "true",
      files_url: [...existingFiles, ...newFiles]
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
    cleanupFiles(req.files);
    return res.status(400).json({ msg: e.message, success: false });
  }
}
module.exports = UpdateFolder;