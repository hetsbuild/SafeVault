const noteSchema = require("../../models/NotesSchema");
const addActivity = require("../../utils/ActivityLoger");

const DeleteNote = async function (req, res) {
  const { id } = req.params;
  const uid = req.user._id;
  try {
    const note = await noteSchema.findOne({ _id: id, userId: uid });
    if (!note) {
      return res.status(404).json({ msg: "Note not found", success: false });
    }
    note.isDeleted = true;
    note.deletedAt = new Date();
    await note.save();
    addActivity(uid, "delete", `moved note ${note.title} to trash`);
    return res.status(200).json({ msg: "Note moved to trash", success: true });
  } catch (e) {
    return res.status(400).json({ msg: e.message, success: false });
  }
}
module.exports = DeleteNote