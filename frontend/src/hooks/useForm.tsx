import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { request } from "../api";
import { clearUser } from "../lib/auth";

interface PopupFormProps {
  id?: string;
  upDesc?: string;
  upTitle?: string;
  isPrivate?: boolean;
  files_url?: { file_type: string; url: string }[];
  type: string;
  upfolderId?: string;
  onClose: () => void;
}

interface DisplayFile {
  url: string;
  file_type: string;
  origin: "existing" | "new";
  file?: File;
}

export default function useForm({
  id,
  upDesc,
  upTitle,
  isPrivate,
  files_url,
  onClose,
  type,
  upfolderId,
}: PopupFormProps) {
  const [title, setTitle] = useState(upTitle ?? "");
  const [folderId, setFolderId] = useState<string | null>(upfolderId ?? null);
  const [desc, setDesc] = useState(upDesc ?? "");
  const [privateNote, setPrivateNote] = useState(isPrivate ?? false);
  const [files, setFiles] = useState<DisplayFile[]>(
    (files_url ?? []).map((f) => ({ ...f, origin: "existing" }))
  );
  const [submitting, setSubmitting] = useState(false);
  const resetRef = useRef<HTMLInputElement | null>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const previews: DisplayFile[] = selectedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      let file_type = "other";
      if (file.type.startsWith("image/")) file_type = "image";
      else if (file.type.startsWith("video/")) file_type = "video";
      else if (file.type === "application/pdf") file_type = "pdf";
      return { url, file_type, origin: "new", file };
    });
    setFiles((prev) => [...prev, ...previews]);
    if (resetRef.current) resetRef.current.value = "";
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (submitting) return;
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("isPrivate", String(privateNote));

    const existing = files
      .filter((f) => f.origin === "existing")
      .map((f) => ({ url: f.url, file_type: f.file_type }));
    formData.append("existingFiles", JSON.stringify(existing));

    if (folderId) {
      formData.append("folderId", folderId);
    }

    files
      .filter((f) => f.origin === "new" && f.file)
      .forEach((f) => formData.append("files", f.file!));

    const { data, ok, status } = await request<{
      success?: boolean;
      msg?: string;
      message?: string | string[];
    }>(`${id ? `update${type}/` + id : `add${type}`}`, {
      method: "POST",
      body: formData,
    }, false);

    setSubmitting(false);

    if (ok && data) {
      toast.success(id ? `${type === "note" ? "Note" : "Folder"} updated` : `${type === "note" ? "Note" : "Folder"} added`);
      onClose();
      return;
    }

    if (status === 401) {
      toast.error("Your session expired. Please log in again.");
      clearUser();
      window.location.href = "/login";
      return;
    }

    const msg =
      (data && (data.msg || data.message)) ||
      (status === 0
        ? "Cannot reach the server. Is the backend running?"
        : `Request failed (${status})`);
    if (Array.isArray(msg)) {
      msg.forEach((m) => toast.error(m));
    } else {
      toast.error(msg);
    }
  };

  return {
    title, setTitle,
    desc, setDesc,
    folderId, setFolderId,
    privateNote, setPrivateNote,
    files,
    submitting,
    resetRef,
    handleFilesChange,
    handleDeleteFile,
    handleSubmit,
  };
}