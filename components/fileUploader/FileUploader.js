import { useRef } from 'react'

const FileUploader = ({ id, className, icon, placeholder, handleFileUpload }) => {
  const inputFile = useRef(null)

  const handleUploadClick = () => inputFile.current.click()

  return (
    <>
      <div onClick={handleUploadClick} className={`cursor-pointer flex items-center justify-center rounded-xl border border-black bg-white ${className}`}>
        <div className="p-1">
          <img src={icon} alt="upload-icon" />
        </div>
        <div className="p-1 text-sm">{placeholder}</div>
        <input style={{ display: 'none' }} ref={inputFile} id={id} onChange={handleFileUpload} type="file" />
      </div>
    </>
  )
}

export default FileUploader
