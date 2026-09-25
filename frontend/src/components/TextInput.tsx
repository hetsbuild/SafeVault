
export default function TextInput({title,setTitle}:{title:string,setTitle:(val:string)=>void}) {
  return (
    <div>
            <label className="block text-lg font-medium mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            
    </div>
  )
}
