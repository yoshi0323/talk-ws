import React, { useState } from 'react';
import ScenarioForm from './components/ScenarioForm';
import FileUpload from './components/FileUpload';
import './index.css';

function App() {
  const [csvFilesData, setCsvFilesData] = useState([]); // 複数のCSVファイルのデータを保持
  const [selectedFileIndex, setSelectedFileIndex] = useState(0); // 選択されたファイルのインデックス
  const [scenarios, setScenarios] = useState([]); // シナリオのリストを保持

  // 複数のCSVファイルをアップロードしたときの処理
  const handleFileUpload = (fileData) => {
    setCsvFilesData(prevData => [...prevData, fileData]); // 新しいファイルデータを追加
    setSelectedFileIndex(csvFilesData.length); // 新しいファイルを選択
  };

  // プルダウンでファイル選択時のハンドラー
  const handleFileSelect = (event) => {
    setSelectedFileIndex(event.target.value);
  };

  // シナリオ削除のハンドラー
  const deleteScenario = (id) => {
    setScenarios(scenarios.filter((_, index) => index !== id));
  };

  // シナリオ確定ボタンの処理
  const handleConfirmScenario = () => {
    const selectedFileData = csvFilesData[selectedFileIndex];
    if (selectedFileData) {
      alert(`シナリオが確定されました。選択されたファイル: ${selectedFileData.fileName}`);
      // ここでシナリオの確定処理を追加できます
    } else {
      alert('ファイルが選択されていません。');
    }
  };

  // 新しいシナリオを追加するハンドラー
  const addScenario = () => {
    const newScenarioId = scenarios.length + 1; // 新しいシナリオのIDを生成
    setScenarios([...scenarios, { id: newScenarioId }]); // 新しいシナリオを追加
  };

  return (
    <div className="App">
      <h1>シナリオ設定画面</h1>
      
      {/* CSVファイルのアップロード */}
      <FileUpload onFileUpload={handleFileUpload} />

      {/* プルダウンでファイルを選択 */}
      {csvFilesData.length > 0 && (
        <div>
          <label>アップロードしたファイルを選択してください:</label>
          <select onChange={handleFileSelect} value={selectedFileIndex}>
            {csvFilesData.map((fileData, index) => (
              <option key={index} value={index}>
                {fileData.fileName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 選択されたファイルの内容をシナリオに渡す */}
      {csvFilesData.length > 0 && (
        <ScenarioForm
          headers={csvFilesData[selectedFileIndex].headers}
          data={csvFilesData[selectedFileIndex].data}
          scenarioId={`シナリオ ${selectedFileIndex + 1}`}
          deleteScenario={deleteScenario}
        />
      )}

      {/* シナリオ追加ボタンとシナリオ確定ボタン */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
        <button type="button" onClick={addScenario} className="add-scenario-button">
          新しいシナリオを追加
        </button>
        <button type="button" onClick={handleConfirmScenario} className="confirm-scenario-button" style={{ marginLeft: '10px' }}>
          シナリオ確定
        </button>
      </div>

      {/* 追加されたシナリオのトグルを表示 */}
      {scenarios.map((scenario) => (
        <ScenarioForm
          key={scenario.id}
          headers={csvFilesData[selectedFileIndex].headers}
          data={csvFilesData[selectedFileIndex].data}
          scenarioId={`新しいシナリオ ${scenario.id}`}
          deleteScenario={deleteScenario}
        />
      ))}
    </div>
  );
}

export default App;