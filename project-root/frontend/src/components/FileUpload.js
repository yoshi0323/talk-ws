import React, { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
  const [fileList, setFileList] = useState([]);

  // ファイルが選択されたときのハンドラー
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFileList(files);
    onFileUpload(files);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept=".csv"
      />
      <div>
        {fileList.length > 0 && (
          <ul>
            {fileList.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
