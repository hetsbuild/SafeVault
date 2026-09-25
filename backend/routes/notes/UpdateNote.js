const NoteSchema = require("../../models/NotesSchema");
const FolderSchema = require("../../models/FolderSchema");
const addactivity = require("../../utils/ActivityLoger");
const addInsideFolder = require("../folders/AddInsideFolder");
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const UpdateNote = async (req, res) => {
  const { title, desc, isPrivate, folderId } = req.body;
  const { id } = req.params;
  const uid = req.user._id;
  try {
    const existing = await NoteSchema.findOne({ _id: id, userId: uid });
    if (!existing) {
      return res.status(404).json({ msg: "Note not found", success: false });
    }

    let newFiles = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
        newFiles.push({ url: result.secure_url, file_type: file.mimetype });
        fs.unlinkSync(file.path);
      });
      await Promise.all(uploadPromises);
    }

    let existingFiles = existing.files_url;
    if (req.body.existingFiles) {
      try {
        existingFiles = JSON.parse(req.body.existingFiles);
      } catch (e) {
        existingFiles = existing.files_url;
      }
    }

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

    await NoteSchema.findByIdAndUpdate(id, updateData, { new: true });

    if (folderId && folderId !== "null" && !existing.parentId) {
      req.body.folderId = folderId;
      req.body.uploadId = existing._id;
      req.body.type = "notes";
      await addInsideFolder(req, res);
      return;
    }

    addactivity(uid, "update", `updated note ${existing.title}`)
    return res.status(200).json({ msg: "updated successfully", success: true });
  } catch (e) {
    if (req.files) {
      req.files.forEach(file => {
        if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    return res.status(400).json({ msg: e.message, success: false });
  }
}
module.exports = UpdateNote;