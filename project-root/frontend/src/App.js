import React, { useState } from 'react';
import ScenarioForm from './components/ScenarioForm';
import FileUpload from './components/FileUpload';
import './index.css';

function App() {
  const [csvData, setCsvData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [scenarios, setScenarios] = useState([]); // シナリオのリストを保持

  // 複数のCSVファイルをアップロードしたときの処理
  const handleFileUpload = (files) => {
    const fileDataPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ name: file.name, content: reader.result });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
      });
    });

    // 各ファイルを処理してcsvDataに格納
    Promise.all(fileDataPromises).then((fileContents) => {
      const newCsvData = {};
      fileContents.forEach((file) => {
        const rows = file.content.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map((row) => row.split(','));
        newCsvData[file.name] = { headers, data };
      });
      setCsvData(newCsvData);
    });
  };

  // プルダウンでファイル選択時のハンドラー
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.value);
  };

  // シナリオ削除のハンドラー
  const deleteScenario = (id) => {
    setScenarios(scenarios.filter(scenario => scenario.id !== id));
  };

  // 新しいシナリオを追加するハンドラー
  const addScenario = () => {
    const newScenarioId = scenarios.length + 1;
    setScenarios([...scenarios, { id: newScenarioId }]);
  };

  // 設定確定ボタンの処理
  const handleConfirmSettings = () => {
    if (selectedFile) {
      alert(`設定が確定されました。選択されたファイル: ${selectedFile}`);
      // 設定処理をここに追加
    } else {
      alert('ファイルが選択されていません。');
    }
  };

  return (
    <div className="App">
      <h1>シナリオ設定画面</h1>
      
      {/* CSVファイルのアップロード */}
      <FileUpload onFileUpload={handleFileUpload} />

      {/* プルダウンでファイルを選択 */}
      {Object.keys(csvData).length > 0 && (
        <div>
          <label>アップロードしたファイルを選択してください:</label>
          <select onChange={handleFileSelect} value={selectedFile || ''}>
            <option value="" disabled>ファイルを選択</option>
            {Object.keys(csvData).map((fileName) => (
              <option key={fileName} value={fileName}>
                {fileName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 選択されたファイルの内容をシナリオに渡す */}
      {selectedFile && (
        <>
          {scenarios.map((scenario, index) => (
            <ScenarioForm
              key={scenario.id}
              headers={csvData[selectedFile].headers}
              scenarioId={`シナリオ ${index + 1}`}
              deleteScenario={deleteScenario}
            />
          ))}
        </>
      )}

      {/* シナリオ追加ボタン */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={addScenario} className="add-scenario-button">
          新しいシナリオを追加
        </button>
      </div>

      {/* 設定確定ボタン */}
      <div className="form-buttons fixed-buttons">
        <button type="button" onClick={handleConfirmSettings}>設定確定</button>
      </div>
    </div>
  );
}

export default App;
