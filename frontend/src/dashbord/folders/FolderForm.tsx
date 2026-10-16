import FileDisplay from "../../components/FileDisplay";
import PrivateCheckBox from "../../components/PrivateCheckBox";
import TextAreaInput from "../../components/TextAreaInput";
import TextInput from "../../components/TextInput";
import { useAppSelector } from "../../hooks";
import useForm from "../../hooks/useForm";

interface FolderFormProps {
  id?: string;
  upDesc?: string;
  upTitle?: string;
  isPrivate?: boolean;
  files_url?: { file_type: string; url: string; name?: string }[];
  onClose: () => void;
  upfolderId?: string;
}

const ACCEPTED_TYPES =
  "image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.json,.zip,.rar,.7z";

const FolderForm: React.FC<FolderFormProps> = ({
  id, upDesc, upTitle, isPrivate, files_url, onClose, upfolderId,
}) => {
  const type: string = "folder";
  const {
    title, setTitle,
    desc, setDesc,
    privateNote, setPrivateNote,
    files,
    submitting,
    folderId, setFolderId,
    resetRef,
    handleFilesChange, handleDeleteFile, handleSubmit,
  } = useForm({ id, upDesc, upTitle, isPrivate, files_url, onClose, type, upfolderId });
  const folders = useAppSelector((state) => state.folder.folders);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold">
            {!id ? "Add new" : "Update"} folder
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-2xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-auto">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <TextInput title={title} setTitle={setTitle} />
            <TextAreaInput desc={desc} setDesc={setDesc} />

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Add inside folder
              </label>
              <select
                value={folderId ?? "null"}
                onChange={(e) => {
                  const value = e.target.value === "null" ? null : e.target.value;
                  setFolderId(value);
                }}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="null">Select folder / root</option>
                {folders.map((folder) => (
                  <option key={folder._id} value={folder._id}>
                    {folder.title}
                  </option>
                ))}
              </select>
            </div>

            <PrivateCheckBox privateNote={privateNote} setPrivateNote={setPrivateNote} />

            <div>
              <label className="cursor-pointer inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
                Choose files (image, video, PDF, document)
                <input
                  ref={resetRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_TYPES}
                  className="hidden"
                  onChange={handleFilesChange}
                />
              </label>
              <p className="mt-1.5 text-xs text-gray-500">
                Max 10 files, up to 25 MB each.
              </p>
              {files.length > 0 && (
                <div className="mt-4">
                  <FileDisplay files={files} handleDeleteFile={handleDeleteFile} />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition"
              >
                {submitting ? "Saving..." : !id ? "Add folder" : "Update folder"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FolderForm;