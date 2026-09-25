import { useEffect, useState } from "react";
import FolderCard from "../folders/FolderCard";
import Masonry from "react-masonry-css";
import AddButton from "../../components/AddButton";
import { Loader2, FileText, Folder as FolderIcon } from "lucide-react";
import type { Folder, Note } from "../../types";
import NoteCard from "../notes/Note";
import FolderForm from "../folders/FolderForm";
import PopupForm from "../notes/PopUPForm";
import { request } from "../../api";

export default function Page() {
  const breakpointColumnsObj = { default: 3, 1024: 2, 640: 1 };
  const [isOpenFolder, setIsOpenFolder] = useState(false);
  const [isOpenNote, setIsOpenNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ notes: Note[]; folders: Folder[] } | null>(null);

  useEffect(() => {
    setLoading(true);
    request<{ notes: Note[]; folders: Folder[] }>("/getrecent").then(({ data }) => {
      setData(data || { notes: [], folders: [] });
      setLoading(false);
    });
  }, [isOpenFolder, isOpenNote]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent</h2>
        <div className="flex gap-3">
          <AddButton text="Add Note" onClick={() => setIsOpenNote(true)} />
          <AddButton text="Add Folder" onClick={() => setIsOpenFolder(true)} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={18} className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Notes</h3>
          </div>
          {data?.notes && data.notes.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex gap-4"
              columnClassName="space-y-4"
            >
              {data.notes.map((note) => (
                <NoteCard
                  key={note._id}
                  _id={note._id}
                  title={note.title}
                  isPrivate={note.isPrivate}
                  files_url={note.files_url}
                  desc={note.desc}
                />
              ))}
            </Masonry>
          ) : (
            <p className="text-gray-400 text-sm mb-6">No recent notes.</p>
          )}

          <div className="flex items-center gap-2 mb-3 mt-8">
            <FolderIcon size={18} className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">Folders</h3>
          </div>
          {data?.folders && data.folders.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex gap-4"
              columnClassName="space-y-4"
            >
              {data.folders.map((folder) => (
                <FolderCard key={folder._id} {...folder} />
              ))}
            </Masonry>
          ) : (
            <p className="text-gray-400 text-sm">No recent folders.</p>
          )}
        </>
      )}

      {isOpenFolder && <FolderForm onClose={() => setIsOpenFolder(false)} />}
      {isOpenNote && <PopupForm onClose={() => setIsOpenNote(false)} />}
    </div>
  );
}