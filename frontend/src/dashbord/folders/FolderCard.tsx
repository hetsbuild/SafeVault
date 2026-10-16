import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import type { Folder } from "../../types";
import DropDown from "../../components/DropDown";

export default function FolderCard({ _id, title, desc, isPrivate }: Folder) {
  return (
    <Link to={isPrivate ? `/faceverify/folder/${_id}` : `/folders/${_id}`} className="block group">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-5 text-white transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 relative">
        <div className="flex justify-between items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20">
            {isPrivate ? "🔒 Private" : "Public"}
          </span>
          <DropDown type="folder" _id={_id} isPrivate={isPrivate} />
        </div>

        <div className="mb-3 flex items-center gap-3">
          <FolderOpen className="text-white/80" size={22} />
          <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
        </div>
        <p className="text-white/80 text-sm line-clamp-2">
          {isPrivate ? "🔒 Face verification required to open" : desc || "No description"}
        </p>
      </div>
    </Link>
  );
}