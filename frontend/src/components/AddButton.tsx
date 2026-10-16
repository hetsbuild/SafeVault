export default function AddButton({text,onClick}:{text:string,onClick:()=>void}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
            {text}
        </button>
    )
}