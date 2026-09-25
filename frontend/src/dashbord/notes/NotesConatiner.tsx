import { useEffect, useState } from "react";
import Note from "./Note";
import Masonry from "react-masonry-css";
import PopupForm from "./PopUPForm";
import AddButton from "../../components/AddButton";
import { Loader2, FileText } from "lucide-react";
import type { Note as NoteType } from "../../types";
import { request } from "../../api";

export default function NotesConatiner() {
  const breakpointColumnsObj = { default: 3, 1024: 2, 640: 1 };
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<NoteType[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    request<NoteType[]>("/getnotes/all").then(({ data }) => {
      setNotes(data || []);
      setLoading(false);
    });
  }, [isOpen]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>
        <AddButton onClick={() => setIsOpen(true)} text="Add Note" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : notes && notes.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4"
          columnClassName="space-y-4"
        >
          {notes.map((note) => (
            <Note
              key={note._id}
              title={note.title}
              desc={note.desc}
              files_url={note.files_url}
              isPrivate={note.isPrivate}
              _id={note._id}
            />
          ))}
        </Masonry>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <FileText size={40} className="mx-auto mb-3" />
          <p className="text-lg font-medium">No notes yet</p>
          <p className="text-sm mt-1">Click "Add Note" to create your first one.</p>
        </div>
      )}

      {isOpen && <PopupForm onClose={() => setIsOpen(false)} />}
    </div>
  );
}