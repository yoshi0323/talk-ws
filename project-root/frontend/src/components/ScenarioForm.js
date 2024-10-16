import React, { useState } from 'react';

const ScenarioForm = ({ headers, csvData, scenarioId, deleteScenario }) => {
  const [userInput, setUserInput] = useState("");
  const [csvHeader, setCsvHeader] = useState("");
  const [conditionType, setConditionType] = useState("一致している時");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (csvHeader && userInput) {
      const matchingRows = csvData.filter(row => {
        const columnIndex = headers.indexOf(csvHeader);
        return conditionType === "一致している時"
          ? row[columnIndex] === userInput
          : conditionType === "かつ"
          ? row[columnIndex] && row[columnIndex] === userInput
          : row[columnIndex] || row[columnIndex] === userInput;
      });
      console.log(`シナリオ${scenarioId}の条件に一致する行:`, matchingRows);
    } else {
      console.error("分岐させたい要素と必要な情報を入力してください");
    }
  };

  return (
    <div className="scenario-form">
      <h2>シナリオ{scenarioId}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>分岐させたい要素:</label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="入力を追加"
            required
          />
          <label>が</label>
          <select value={csvHeader} onChange={(e) => setCsvHeader(e.target.value)}>
            {headers.length > 0 ? (
              headers.map((header, index) => (
                <option key={index} value={header}>
                  {header}
                </option>
              ))
            ) : (
              <option value="">CSVファイルをアップロードしてください</option>
            )}
          </select>
          <select value={conditionType} onChange={(e) => setConditionType(e.target.value)}>
            <option value="一致している時">一致している時</option>
            <option value="かつ">かつ</option>
            <option value="または">または</option>
          </select>
        </div>
        <textarea placeholder="シナリオを入力" rows="3"></textarea>
        <div className="form-buttons">
          <button type="button" onClick={() => deleteScenario(scenarioId)}>シナリオ削除</button>
        </div>
      </form>
    </div>
  );
};

export default ScenarioForm;
