import { Link } from "react-router-dom";
import type { Note } from "../../types";
import DropDown from "../../components/DropDown";

export default function Note({
  _id,
  title,
  desc,
  files_url,
  isPrivate,
}: Note) {
  const mediaCounts = files_url.reduce(
    (acc, file) => {
      if (file.file_type.includes("image")) acc.images += 1;
      else if (file.file_type.includes("video")) acc.videos += 1;
      else if (file.file_type.includes("pdf")) acc.pdfs += 1;
      else acc.others += 1;
      return acc;
    },
    { images: 0, videos: 0, pdfs: 0, others: 0 }
  );

  const hasMedia = mediaCounts.images + mediaCounts.videos + mediaCounts.pdfs + mediaCounts.others > 0;

  return (
    <Link
      to={isPrivate ? `/faceverify/notes/${_id}` : `/notes/${_id}`}
      className="block group"
    >
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition-all duration-200 hover:shadow-lg hover:border-indigo-200 relative">
        <div className="flex justify-between items-center gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              isPrivate
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isPrivate ? "🔒 Private" : "Public"}
          </span>
          <DropDown type="note" _id={_id} isPrivate={isPrivate} />
        </div>

        {hasMedia && files_url[0]?.url && (
          <div className="mb-3 rounded-lg overflow-hidden h-36 bg-gray-100">
            {files_url[0].file_type.includes("image") ? (
              <img
                src={files_url[0].url}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : files_url[0].file_type.includes("video") ? (
              <video className="w-full h-full object-cover" muted>
                <source src={files_url[0].url} />
              </video>
            ) : files_url[0].file_type.includes("pdf") ? (
              <iframe src={files_url[0].url} title={title} className="w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full text-4xl">📄</div>
            )}
          </div>
        )}

        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {isPrivate ? "🔒 Face verification required to open" : desc || "No description"}
        </p>

        {hasMedia && (
          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
            {mediaCounts.images > 0 && <span>📷 {mediaCounts.images}</span>}
            {mediaCounts.videos > 0 && <span>🎬 {mediaCounts.videos}</span>}
            {mediaCounts.pdfs > 0 && <span>📄 {mediaCounts.pdfs}</span>}
            {mediaCounts.others > 0 && <span>❓ {mediaCounts.others}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}