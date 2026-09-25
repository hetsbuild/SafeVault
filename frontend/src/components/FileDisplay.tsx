
type props ={files:{file_type:string,url:string}[],handleDeleteFile?:(index:number)=>void}

export default function FileDisplay({files,handleDeleteFile}:props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
              {files && files.map((file, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border relative">
                  <button
                    type="button"
                    onClick={() => handleDeleteFile && handleDeleteFile(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold"
                    title="Delete file"
                  >
                    &times;
                  </button>
                  <p className="text-sm text-gray-600 mb-2 truncate">{file.file_type}</p>

                  {(file.file_type === "image" || file.file_type === "image/jpeg") && (
                    <img src={file.url} alt="Preview" className="w-full h-48 object-cover rounded" />
                  )}
                  {(file.file_type === "video" || file.file_type === "video/mp4") && (
                    <video controls className="w-full h-48 object-cover rounded">
                      <source src={file.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {(file.file_type === "pdf" || file.file_type === "application/pdf") && (
                    <iframe src={file.url} className="w-full h-48 rounded" title="PDF preview" />
                  )}
                  {file.file_type === "other" && (
                    <p className="text-red-500">Unsupported file type</p>
                  )}
                </div>
              ))}
            </div>
  )
}
