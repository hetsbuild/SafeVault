

export default function FormSubmitButton({isDisabled,text}:{isDisabled:boolean,text:string}) {
  return (
       <button
            type="submit"
            className={`w-full py-2 rounded font-medium transition ${isDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            disabled={isDisabled}
          >
            {text}
          </button>
  )
}
