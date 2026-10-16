import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { request } from "../api";

const itemName = (type: string) => (type === "note" ? "note" : "folder");
const listPath = (type: string) => `/${type}s`;
const deletePath = (type: string, _id: string) => `/${type === "note" ? "deletenote" : "deletefolder"}/${_id}`;

const menuItemClass =
  "block w-full text-left px-4 py-2 text-sm focus:outline-none focus-visible:bg-gray-100";

export default function DropDown({
  type,
  _id,
  isPrivate,
}: {
  type: string;
  _id: string;
  isPrivate?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    navigate(`/${type}s/${_id}`);
  };

  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${type}s/${_id}`);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const remove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);

    const name = itemName(type);

    // Private items must be unlocked before they can be removed.
    if (isPrivate) {
      navigate(`/faceverify/delete/${type}s/${_id}`);
      return;
    }

    if (deleting) return;
    if (!window.confirm(`Move this ${name} to trash?`)) return;

    setDeleting(true);
    const { data, ok } = await request<{ success: boolean; msg?: string }>(deletePath(type, _id), {
      method: "DELETE",
    });
    setDeleting(false);

    if (ok && data?.success) {
      toast.success(data.msg || `Moved to trash`);
      navigate(listPath(type));
    } else {
      toast.error(data?.msg || `Could not delete this ${name}`);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="p-2 rounded-full hover:bg-gray-200 transition"
        onClick={handleMenuClick}
        aria-label={`Actions for this ${itemName(type)}`}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <i className="fa-solid fa-ellipsis-vertical text-lg" aria-hidden="true"></i>
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-40 bg-white text-gray-900 border rounded-lg shadow-lg z-50 py-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button role="menuitem" type="button" className={`${menuItemClass} text-gray-900 hover:bg-gray-100`} onClick={open}>
            Open
          </button>
          <button role="menuitem" type="button" className={`${menuItemClass} text-gray-900 hover:bg-gray-100`} onClick={copyLink}>
            Copy link
          </button>
          <button
            role="menuitem"
            type="button"
            className={`${menuItemClass} text-red-600 hover:bg-red-50`}
            onClick={remove}
          >
            {isPrivate ? "Unlock & delete" : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}