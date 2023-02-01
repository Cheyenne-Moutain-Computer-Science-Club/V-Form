import React from 'react'

function FileUpload() {
  const [fileQuery, setFileQuery] = React.useState(null);

  const handleFileChange = (files: FileList | null): void => {
    // setFileQuery(files[0]);
    console.log(files);
  }

  return (
    <div>
      <input type="file" onChange={(e) => handleFileChange(e.target.files)}></input>
    </div>
  )
}

export default FileUpload