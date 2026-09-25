export default function TextAreaInput({desc,setDesc}:{desc:string,setDesc:(val:string)=>void}) {
  return (
     <div>
            <label className="block text-lg font-medium mb-2" >Description *</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows={4}
            />
          </div>
  )
}
