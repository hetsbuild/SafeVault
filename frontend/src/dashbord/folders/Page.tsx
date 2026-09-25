import { useEffect, useState } from "react";
import FolderCard from "./FolderCard";
import Masonry from "react-masonry-css";
import FolderForm from "./FolderForm";
import AddButton from "../../components/AddButton";
import { Loader2, Folder } from "lucide-react";
import { setFolders } from "../../features/folderSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { request } from "../../api";

export default function Page() {
  const breakpointColumnsObj = { default: 3, 1024: 2, 640: 1 };
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const folders = useAppSelector((state) => state.folder.folders);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    request<typeof folders>("/getfolders/all").then(({ data }) => {
      dispatch(setFolders(data || []));
      setLoading(false);
    });
  }, [isOpen, dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Folders</h2>
        <AddButton text="Add Folder" onClick={() => setIsOpen(true)} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : folders && folders.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4"
          columnClassName="space-y-4"
        >
          {folders.map((folder) => (
            <FolderCard key={folder._id} {...folder} />
          ))}
        </Masonry>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Folder size={40} className="mx-auto mb-3" />
          <p className="text-lg font-medium">No folders yet</p>
          <p className="text-sm mt-1">Create folders to organize your notes.</p>
        </div>
      )}

      {isOpen && <FolderForm onClose={() => setIsOpen(false)} />}
    </div>
  );
}