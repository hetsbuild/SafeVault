interface Props {
  htmlFor: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  showPassword?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
}
export default function FormInput({
  htmlFor,
  label,
  type,
  placeholder,
  value,
  showPassword,
  onChange,
  onClick,
}: Props) {
  return (
    <div className="relative">
      <label htmlFor={htmlFor} className="block mb-1 font-medium text-sm">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={htmlFor}
          className={`w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            htmlFor === "password" ? "pr-16" : ""
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {htmlFor === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
            onClick={onClick}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}