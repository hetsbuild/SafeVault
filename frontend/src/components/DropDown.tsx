import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DropDown({ type, _id }: { type: string; _id: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
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
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="p-2 rounded-full hover:bg-gray-200 transition"
        onClick={handleMenuClick}
        aria-label="Actions"
      >
        <i className="fa-solid fa-ellipsis-vertical text-lg"></i>
      </button>

      {menuOpen && (
        <div
          className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50 py-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" onClick={open}>
            Open
          </button>
          <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" onClick={copyLink}>
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}