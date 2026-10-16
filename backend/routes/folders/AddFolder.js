const FolderSchema = require("../../models/FolderSchema");
const addActivity = require("../../utils/ActivityLoger");
const AddinsideFolder = require("./AddInsideFolder");
const { uploadFiles, cleanupFiles } = require("../../utils/uploadFiles");

const AddFolder = async (req, res) => {
  const { title, desc, isPrivate, folderId } = req.body;
  const uid = req.user._id;
  try {
    const files_url = req.files && req.files.length > 0
      ? await uploadFiles(req.files)
      : [];

    const newFolder = await FolderSchema.create({
      userId: uid,
      title,
      desc: desc || "",
      isPrivate: isPrivate === true || isPrivate === "true",
      files_url,
    });

    addActivity(uid, "create", "create folder successfully")

    if (folderId && folderId !== "null") {
      req.body.folderId = folderId;
      req.body.uploadId = newFolder._id;
      req.body.type = "folders";
      await AddinsideFolder(req, res);
      return;
    }

    return res.status(200).json({ msg: "folder created", success: true, folder: newFolder });
  } catch (e) {
    cleanupFiles(req.files);
    return res.status(400).json({ msg: e.message, success: false });
  }
}
module.exports = AddFolder;