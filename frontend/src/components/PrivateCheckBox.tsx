export default function PrivateCheckBox({
  privateNote,
  setPrivateNote,
}: {
  privateNote: boolean;
  setPrivateNote: (value: boolean) => void;
}) {
  return (
    <div className="mb-4 flex items-center">
      <label className="flex items-center cursor-pointer gap-2">
        <input
          type="checkbox"
          checked={privateNote}
          onChange={(e) => setPrivateNote(e.target.checked)}
          className="form-checkbox h-5 w-5 text-indigo-600 rounded"
        />
        <span className="text-sm font-medium text-gray-700">Set Private (requires face verify to open)</span>
      </label>
    </div>
  );
}