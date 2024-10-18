import React, { useState } from 'react';
import Encoding from 'encoding-japanese';

const FileUpload = ({ onFileUpload }) => {
  const [fileList, setFileList] = useState([]);

  // ファイルが選択されたときのハンドラー
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFileList(files);
    files.forEach(file => readFile(file)); // 各ファイルを読み込む
  };

  const readFile = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // JISエンコーディングでCSVデータをUnicodeに変換
      const csvData = Encoding.convert(uint8Array, {
        to: 'UNICODE',  // UTF-16に変換
        from: 'SHIFT_JIS',  // JISエンコーディングを指定
        type: 'string',
      });

      // CSVデータを処理する関数を呼び出す
      processCsvData(csvData, file.name); // ファイル名を渡す
    };

    reader.onerror = (error) => {
      console.error("ファイル読み込みエラー:", error);
    };

    // バイナリ形式でファイルを読み込む
    reader.readAsArrayBuffer(file);
  };

  const processCsvData = (csvData, fileName) => {
    // CSVデータを行ごとに分割
    const rows = csvData.split('\n').map(row => row.split(','));
    const headers = rows[0]; // 最初の行をヘッダーとして取得
    const data = rows.slice(1); // 残りの行をデータとして取得

    // 親コンポーネントにデータを渡す
    onFileUpload({ headers, data, fileName }); // ここでオブジェクトを渡す
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