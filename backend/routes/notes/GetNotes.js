const noteSchme = require("../../models/NotesSchema");

const getNotes = async (req, res) => {
  try {
    const { id, type } = req.params
    const uid = req.user._id;
    if (type === "all") {
      const notes = await noteSchme.find({ userId: uid, parentId: null, isDeleted: false }).sort({ updatedAt: -1 });
      return res.status(200).json(notes);
    }

    const note = await noteSchme.findOne({ _id: id, userId: uid, isDeleted: false });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    return res.status(200).json(note);
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}

module.exports = getNotes