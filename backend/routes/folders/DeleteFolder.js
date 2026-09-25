const FolderSchema = require("../../models/FolderSchema");
const NoteSchema = require("../../models/NotesSchema");
const addActivity = require("../../utils/ActivityLoger");

const DeleteFolder = async function (req, res) {
  const { id } = req.params;
  const uid = req.user._id;

  try {
    const folder = await FolderSchema.findOne({ _id: id, userId: uid });
    if (!folder) {
      return res.status(404).json({ msg: "Folder not found", success: false });
    }

    folder.isDeleted = true;
    folder.deletedAt = new Date();
    await folder.save();

    await FolderSchema.updateMany(
      { parentId: id, userId: uid },
      { isDeleted: true, deletedAt: new Date() }
    );
    await NoteSchema.updateMany(
      { parentId: id, userId: uid },
      { isDeleted: true, deletedAt: new Date() }
    );

    addActivity(uid, "delete", `moved folder ${folder.title} to trash`);
    return res.status(200).json({ msg: "Folder moved to trash", success: true });
  } catch (e) {
    return res.status(400).json({ msg: e.message, success: false });
  }
}
module.exports = DeleteFolder