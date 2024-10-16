import React, { useState } from 'react';
import Encoding from 'encoding-japanese';

const FileUpload = ({ onFileUpload }) => {
  const [fileNames, setFileNames] = useState([]); // アップロードされたファイル名を管理

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // 複数のファイルを配列として取得

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const uint8Array = new Uint8Array(event.target.result);

        // バイナリデータが正しく読み込まれているか確認
        console.log("バイナリデータ:", uint8Array);

        const csvData = Encoding.convert(uint8Array, {
          to: 'UNICODE',  // JavaScriptの内部形式（UTF-16）に変換
          from: 'SJIS',   // Shift_JISで変換
          type: 'string',
        });

        // 変換されたCSVデータが正しく取得できているか確認
        console.log("変換されたCSVデータ:", csvData);

        onFileUpload(file.name, csvData); // 親コンポーネントにファイル名とデータを渡す

        // ファイル名のリストを更新
        setFileNames((prevNames) => [...prevNames, file.name]);
      };

      reader.onerror = (error) => {
        console.error(`ファイル「${file.name}」の読み込みエラー:`, error);
      };

      reader.readAsArrayBuffer(file); // ファイルをバイナリ形式で読み込む
    });
  };

  return (
    <div className="file-upload">
      <label htmlFor="file-upload" className="custom-file-upload">
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          multiple // 複数ファイルのアップロードを許可
          onChange={handleFileChange}
        />
        <span>CSVファイルをアップロードしてください [複数可]</span>
      </label>
    </div>
  );
};

export default FileUpload;
