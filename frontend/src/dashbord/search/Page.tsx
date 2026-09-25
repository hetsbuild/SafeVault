import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Masonry from "react-masonry-css";
import { Loader2, Search, FileText, Folder as FolderIcon } from "lucide-react";
import NoteCard from "../notes/Note";
import FolderCard from "../folders/FolderCard";
import type { Folder, Note } from "../../types";
import { request } from "../../api";

export default function SearchPage() {
  const breakpointColumnsObj = { default: 3, 1024: 2, 640: 1 };
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) {
      setNotes([]);
      setFolders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    request<{ notes: Note[]; folders: Folder[] }>(`/search?q=${encodeURIComponent(q)}`).then(
      ({ data }) => {
        setNotes(data?.notes || []);
        setFolders(data?.folders || []);
        setLoading(false);
      }
    );
  }, [q]);

  const isEmpty = !loading && notes.length === 0 && folders.length === 0;

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Search results {q && <span className="text-gray-400 text-xl">for "{q}"</span>}
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : isEmpty ? (
        <div className="text-center py-20 text-gray-400">
          <Search size={40} className="mx-auto mb-3" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm mt-1">Try different keywords.</p>
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
                  <FolderCard key={folder._id} {...folder} />
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
                  <NoteCard
                    key={note._id}
                    isPrivate={note.isPrivate}
                    _id={note._id}
                    title={note.title}
                    desc={note.desc}
                    files_url={note.files_url}
                  />
                ))}
              </Masonry>
            </>
          )}
        </>
      )}
    </div>
  );
}