import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Masonry from "react-masonry-css";
import {
  Trash2,
  RotateCcw,
  XCircle,
  Loader2,
  Folder as FolderIcon,
  FileText,
} from "lucide-react";
import NoteCard from "../notes/Note";
import FolderCard from "../folders/FolderCard";
import type { Folder, Note } from "../../types";
import { request } from "../../api";

export default function TrashPage() {
  const breakpointColumnsObj = { default: 3, 1024: 2, 640: 1 };
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrash = () => {
    setLoading(true);
    request<{ notes: Note[]; folders: Folder[] }>("/trash").then(({ data }) => {
      setNotes(data?.notes || []);
      setFolders(data?.folders || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const restore = async (type: "notes" | "folders", id: string) => {
    const { data, ok } = await request<{ success: boolean; message: string }>(
      `/restore/${type}/${id}`,
      { method: "POST" }
    );
    if (ok && data?.success) {
      toast.success(data.message);
      loadTrash();
    }
  };

  const deleteForever = async (type: "notes" | "folders", id: string) => {
    if (!window.confirm("Delete permanently? This cannot be undone.")) return;
    const { data, ok } = await request<{ success: boolean; message: string }>(
      `/deleteforever/${type}/${id}`,
      { method: "DELETE" }
    );
    if (ok && data?.success) {
      toast.success(data.message);
      loadTrash();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  const isEmpty = notes.length === 0 && folders.length === 0;

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trash2 className="text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900">Trash</h2>
        <span className="text-sm text-gray-500 ml-2">
          Items here can be restored or deleted permanently.
        </span>
      </div>

      {isEmpty ? (
        <div className="text-center py-20 text-gray-400">
          <Trash2 size={40} className="mx-auto mb-3" />
          <p className="text-lg font-medium">Trash is empty</p>
        </div>
      ) : (
        <>
          {folders.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <FolderIcon size={18} className="text-amber-600" />
                <h3 className="font-semibold text-gray-800">Folders</h3>
              </div>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex gap-4"
                columnClassName="space-y-4"
              >
                {folders.map((folder) => (
                  <div key={folder._id} className="relative">
                    <FolderCard {...folder} />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => restore("folders", folder._id)}
                        className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded"
                      >
                        <RotateCcw size={12} /> Restore
                      </button>
                      <button
                        onClick={() => deleteForever("folders", folder._id)}
                        className="flex items-center gap-1 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded"
                      >
                        <XCircle size={12} /> Delete forever
                      </button>
                    </div>
                  </div>
                ))}
              </Masonry>
            </>
          )}

          {notes.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3 mt-6">
                <FileText size={18} className="text-amber-600" />
                <h3 className="font-semibold text-gray-800">Notes</h3>
              </div>
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex gap-4"
                columnClassName="space-y-4"
              >
                {notes.map((note) => (
                  <div key={note._id} className="relative">
                    <NoteCard
                      isPrivate={note.isPrivate}
                      _id={note._id}
                      title={note.title}
                      desc={note.desc}
                      files_url={note.files_url}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => restore("notes", note._id)}
                        className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded"
                      >
                        <RotateCcw size={12} /> Restore
                      </button>
                      <button
                        onClick={() => deleteForever("notes", note._id)}
                        className="flex items-center gap-1 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded"
                      >
                        <XCircle size={12} /> Delete forever
                      </button>
                    </div>
                  </div>
                ))}
              </Masonry>
            </>
          )}
        </>
      )}

      <div className="mt-6">
        <Link to="/home" className="text-sm text-indigo-600 hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}