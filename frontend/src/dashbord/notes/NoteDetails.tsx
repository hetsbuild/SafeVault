import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import PopupForm from "./PopUPForm";
import FileDisplay from "../../components/FileDisplay";
import Breadcrumbs, { type Crumb } from "../../components/Breadcrumbs";
import type { Note } from "../../types";
import { request } from "../../api";

interface PathFolder {
  _id: string;
  title: string;
  isPrivate: boolean;
}

export default function NoteDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const [path, setPath] = useState<PathFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!id || deleting) return;
    if (!window.confirm("Move this note to trash?")) return;
    setDeleting(true);
    const { data, ok } = await request<{ success: boolean; msg: string }>(
      `/deletenote/${id}`,
      { method: "DELETE" }
    );
    setDeleting(false);
    if (ok && data?.success) {
      toast.success("Note moved to trash");
      navigate("/notes");
    } else {
      toast.error("Could not move the note to trash");
    }
  };

  const loadNote = useCallback(() => {
    if (!id) return;
    setLoading(true);

    request<Note>(`/getnotes/single/${id}`).then(({ data }) => {
      setNote(data);
      setLoading(false);

      if (data?.parentId) {
        request<{ path: PathFolder[] }>(`/folderpath/${data.parentId}`).then(({ data: p }) => {
          setPath(p?.path || []);
        });
      } else {
        setPath([]);
      }
    });
  }, [id]);

  useEffect(() => {
    loadNote();
  }, [loadNote, isOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium">Note not found</p>
        <button onClick={() => navigate("/notes")} className="mt-2 text-indigo-600 hover:underline">
          ← Back to notes
        </button>
      </div>
    );
  }

  const parent = path[path.length - 1];
  const backTarget = parent
    ? parent.isPrivate
      ? `/faceverify/folder/${parent._id}`
      : `/folders/${parent._id}`
    : "/notes";

  const crumbs: Crumb[] = [
    { label: "Home", to: "/home" },
    { label: "Notes", to: "/notes" },
    ...path.map<Crumb>((p) => ({
      label: p.title,
      to: p.isPrivate ? `/faceverify/folder/${p._id}` : `/folders/${p._id}`,
    })),
    { label: note.title },
  ];

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <Breadcrumbs
          items={crumbs}
          onBack={() => navigate(backTarget)}
          backLabel={parent ? `Back to ${parent.title}` : "Back to notes"}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
            {note.isPrivate ? "🔒 Private" : "Public"}
          </span>
        </div>

        <p className="text-gray-700 whitespace-pre-wrap mb-6">
          {note.desc || "No description"}
        </p>

        {note.files_url.length > 0 && <FileDisplay files={note.files_url} />}

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
          >
            <Pencil size={16} /> Update Note
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition"
          >
            <Trash2 size={16} /> {deleting ? "Moving..." : "Delete Note"}
          </button>
        </div>
      </div>

      {isOpen && (
        <PopupForm
          id={note._id}
          upTitle={note.title}
          upDesc={note.desc}
          files_url={note.files_url}
          isPrivate={note.isPrivate}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}