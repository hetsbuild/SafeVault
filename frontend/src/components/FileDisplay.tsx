type props ={files:{file_type:string,url:string,name?:string}[],handleDeleteFile?:(index:number)=>void}

const isImage = (type:string)=>type === "image" || type.startsWith("image/");
const isVideo = (type:string)=>type === "video" || type.startsWith("video/");
const isPdf = (type:string)=>type === "pdf" || type.startsWith("application/pdf");

export default function FileDisplay({files,handleDeleteFile}:props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
              {files && files.map((file, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow border relative">
                  {handleDeleteFile && (
                  <button
                    type="button"
                    onClick={() => handleDeleteFile(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold"
                    title="Delete file"
                  >
                    &times;
                  </button>
                  )}
                  <p className="text-sm text-gray-600 mb-2 truncate">{file.name || file.file_type}</p>

                  {isImage(file.file_type) && (
                    <img src={file.url} alt="Preview" className="w-full h-48 object-cover rounded" />
                  )}
                  {isVideo(file.file_type) && (
                    <video controls className="w-full h-48 object-cover rounded">
                      <source src={file.url} type={file.file_type} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {isPdf(file.file_type) && (
                    <iframe src={file.url} className="w-full h-48 rounded" title="PDF preview" />
                  )}
                  {!isImage(file.file_type) && !isVideo(file.file_type) && !isPdf(file.file_type) && (
                    <div className="w-full h-48 rounded bg-gray-100 flex items-center justify-center text-4xl">
                      📄
                    </div>
                  )}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Open file
                  </a>
                </div>
              ))}
            </div>
  )
}