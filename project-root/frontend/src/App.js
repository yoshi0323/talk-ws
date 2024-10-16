import React, { useState } from 'react';
import ScenarioForm from './components/ScenarioForm';
import FileUpload from './components/FileUpload';
import './index.css';

function App() {
  const [csvFiles, setCsvFiles] = useState({}); // アップロードされたファイルとその内容を保持
  const [selectedFile, setSelectedFile] = useState(''); // プルダウンで選択されたファイル名
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [scenarios, setScenarios] = useState([{ id: 1 }]);  // 初期シナリオ

  // ファイルがアップロードされた際に呼び出される
  const handleFileUpload = (fileName, csvContent) => {
    // CSVデータが正しく渡されているか確認
    console.log("アップロードされたCSVファイル名:", fileName);
    console.log("CSV内容:", csvContent);

    if (csvContent) {
      const rows = csvContent.split('\n');
      const headers = rows[0].split(',');  // CSVの1行目をヘッダーと見なす
      const data = rows.slice(1).map(row => row.split(',')); // CSVのデータ部分

      // ファイル名と対応するCSVデータをマップに追加
      setCsvFiles((prevFiles) => ({
        ...prevFiles,
        [fileName]: { headers, data },
      }));

      // 最初のアップロードファイルをデフォルトで選択
      if (!selectedFile) {
        setSelectedFile(fileName);
        setCsvHeaders(headers);
        setCsvData(data);
      }
    } else {
      console.error("csvContentがundefinedです");
    }
  };

  // プルダウンでファイルを選択したときのハンドラー
  const handleFileSelect = (e) => {
    const fileName = e.target.value;
    setSelectedFile(fileName);
    setCsvHeaders(csvFiles[fileName].headers);
    setCsvData(csvFiles[fileName].data);
  };

  // シナリオ追加のハンドラー
  const addScenario = () => {
    const newId = scenarios.length + 1;
    setScenarios([...scenarios, { id: newId }]);
  };

  // シナリオ削除のハンドラー
  const deleteScenario = (id) => {
    setScenarios(scenarios.filter((scenario) => scenario.id !== id));
  };

  return (
    <div className="App">
      <h1>シナリオ設定画面</h1>

      {/* CSVファイルのアップロード */}
      <FileUpload onFileUpload={handleFileUpload} />
      
      {/* アップロードされたファイルをプルダウンで選択 */}
      {Object.keys(csvFiles).length > 0 && (
        <div className="file-select">
          <label htmlFor="file-select">アップロードしたファイルを選択してください:</label>
          <select id="file-select" value={selectedFile} onChange={handleFileSelect}>
            {Object.keys(csvFiles).map((fileName, index) => (
              <option key={index} value={fileName}>
                {fileName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* シナリオフォーム */}
      {scenarios.map((scenario) => (
        <ScenarioForm
          key={scenario.id}
          headers={csvHeaders}
          csvData={csvData}
          scenarioId={scenario.id}
          deleteScenario={deleteScenario}
        />
      ))}

      {/* 最下部にボタンを配置 */}
      <div className="form-buttons fixed-buttons">
        <button type="button" onClick={addScenario}>シナリオ追加</button>
        <button type="submit">設定確定</button>
      </div>
    </div>
  );
}

export default App;
