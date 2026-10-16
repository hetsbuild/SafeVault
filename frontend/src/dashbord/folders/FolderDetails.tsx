import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Paperclip, Pencil, Trash2, Loader2 } from "lucide-react";
import FolderForm from "./FolderForm";
import Masonry from "react-masonry-css";
import NoteCard from "../notes/Note";
import FolderCard from "./FolderCard";
import FileDisplay from "../../components/FileDisplay";
import type { Folder, Note } from "../../types";
import { request } from "../../api";

export default function FolderDetails() {
  const breakpointColumnsObj = { default: 3, 1024: 2, 640: 1 };
  const navigate = useNavigate();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [removingFile, setRemovingFile] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!id || deleting) return;
    if (!window.confirm("Move this folder (and its contents) to trash?")) return;
    setDeleting(true);
    const { data, ok } = await request<{ success: boolean; msg: string }>(
      `/deletefolder/${id}`,
      { method: "DELETE" }
    );
    setDeleting(false);
    if (ok && data?.success) {
      toast.success("Folder moved to trash");
    }
    navigate("/folders");
  };

  const loadFolder = useCallback(() => {
    if (!id) return;
    setLoading(true);
    request<Folder>(`/getfolders/single/${id}`).then(({ data }) => {
      setFolder(data);
      setLoading(false);
    });
  }, [id]);

  const handleDeleteFile = async (index: number) => {
    if (!id || removingFile !== null) return;
    if (!window.confirm("Remove this file from the folder?")) return;
    setRemovingFile(index);
    const { data, ok } = await request<{
      success: boolean;
      msg: string;
      files_url: Folder["files_url"];
    }>(`/deletefolderfile/${id}/${index}`, { method: "DELETE" });
    setRemovingFile(null);

    if (ok && data?.success) {
      setFolder((prev) => (prev ? { ...prev, files_url: data.files_url } : prev));
      toast.success("File removed");
    } else {
      toast.error(data?.msg || "Could not remove the file");
    }
  };

  useEffect(() => {
    loadFolder();
  }, [loadFolder, isOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium">Folder not found</p>
        <button onClick={() => navigate("/folders")} className="mt-2 text-indigo-600">
          ← Back to folders
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{folder.title}</h1>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
            {folder.isPrivate ? "🔒 Private" : "Public"}
          </span>
        </div>

        <p className="text-gray-700 whitespace-pre-wrap mb-4">
          {folder.desc || "No description"}
        </p>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Paperclip size={18} /> Attachments
            </h2>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            >
              <Paperclip size={14} /> Choose Files
            </button>
          </div>
          {folder.files_url && folder.files_url.length > 0 ? (
            <FileDisplay
              files={folder.files_url}
              handleDeleteFile={handleDeleteFile}
            />
          ) : (
            <p className="text-gray-400 text-sm">No files attached to this folder.</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Notes</h2>
          {folder.notes && folder.notes.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex gap-4"
              columnClassName="space-y-4"
            >
              {folder.notes.map((note: Note) => (
                <NoteCard
                  key={note._id}
                  _id={note._id}
                  title={note.title}
                  desc={note.desc}
                  isPrivate={note.isPrivate}
                  files_url={note.files_url}
                />
              ))}
            </Masonry>
          ) : (
            <p className="text-gray-400 text-sm">No notes in this folder.</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Subfolders</h2>
          {folder.folders && folder.folders.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex gap-4"
              columnClassName="space-y-4"
            >
              {folder.folders.map((f) => (
                <FolderCard key={f._id} {...f} />
              ))}
            </Masonry>
          ) : (
            <p className="text-gray-400 text-sm">No subfolders.</p>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
          >
            <Pencil size={16} /> Update Folder
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition"
          >
            <Trash2 size={16} /> {deleting ? "Moving..." : "Delete Folder"}
          </button>
        </div>
      </div>

      {isOpen && (
        <FolderForm
          id={folder._id}
          isPrivate={folder.isPrivate}
          upDesc={folder.desc}
          upTitle={folder.title}
          files_url={folder.files_url}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}