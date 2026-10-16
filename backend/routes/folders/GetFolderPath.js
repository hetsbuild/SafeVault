const FolderSchema = require("../../models/FolderSchema");

const GetFolderPath = async (req, res) => {
    try {
        const uid = req.user._id;
        const trail = [];
        const seen = new Set();
        let currentId = req.params.id;

        while (currentId) {
            if (seen.has(String(currentId))) break;
            seen.add(String(currentId));

            const folder = await FolderSchema
                .findOne({ _id: currentId, userId: uid })
                .select("_id title parentId isPrivate");

            if (!folder) break;

            trail.unshift({
                _id: folder._id,
                title: folder.title,
                isPrivate: folder.isPrivate
            });

            currentId = folder.parentId;
        }

        return res.status(200).json({ success: true, path: trail });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
}

module.exports = GetFolderPath;