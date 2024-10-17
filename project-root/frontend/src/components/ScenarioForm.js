import React, { useState } from 'react';

const ScenarioForm = ({ headers, scenarioId, deleteScenario }) => {
  const [selectedField, setSelectedField] = useState('');
  const [requiredInfo, setRequiredInfo] = useState('');
  const [conditionOperator, setConditionOperator] = useState('equals');
  const [scenarioInput, setScenarioInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);  // トグルの開閉状態
  const [nestedScenarios, setNestedScenarios] = useState([]);  // ネストされたシナリオ

  // 入力フィールドの変更ハンドラー
  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  const handleRequiredInfoChange = (event) => {
    setRequiredInfo(event.target.value);
  };

  const handleConditionOperatorChange = (event) => {
    setConditionOperator(event.target.value);
  };

  const handleScenarioInputChange = (event) => {
    setScenarioInput(event.target.value);
  };

  const toggleForm = () => {
    setIsExpanded(!isExpanded);  // トグル開閉
  };

  // 新しいシナリオをトグル内に追加するハンドラー
  const addNestedScenario = () => {
    const newScenarioId = nestedScenarios.length + 1;
    setNestedScenarios([...nestedScenarios, { id: newScenarioId }]);
  };

  return (
    <div className="scenario-form">
      <div className="scenario-header" onClick={toggleForm} style={{ cursor: 'pointer' }}>
        <h3>シナリオ {scenarioId}</h3>
        <button>{isExpanded ? '閉じる' : '開く'}</button>
      </div>

      {isExpanded && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {/* 「分岐させたい要素」テキスト入力 */}
            <input
              type="text"
              value={selectedField}
              onChange={handleFieldChange}
              placeholder="分岐させたい要素を入力"
              className="custom-input"
              style={{ marginRight: '10px', flexGrow: 1 }}
            />
            <span style={{ marginRight: '10px' }}>が</span>
            {/* 「必要な情報」プルダウン */}
            <select
              value={requiredInfo}
              onChange={handleRequiredInfoChange}
              className="custom-input"
              style={{ marginRight: '10px', flexGrow: 1 }}
            >
              <option value="">必要な情報</option>
              {headers.map((header, index) => (
                <option key={index} value={header}>
                  {header}
                </option>
              ))}
            </select>
            {/* 条件演算子プルダウン */}
            <select
              value={conditionOperator}
              onChange={handleConditionOperatorChange}
              className="custom-input"
              style={{ marginRight: '10px' }}
            >
              <option value="equals">一致している時</option>
              <option value="or">または</option>
              <option value="and">かつ</option>
            </select>
          </div>

          {/* シナリオの入力フィールド */}
          <textarea
            value={scenarioInput}
            onChange={handleScenarioInputChange}
            placeholder="シナリオを入力"
            className="scenario-input"
            style={{ width: '100%', height: '100px', marginBottom: '10px' }}
          />

          {/* ネストされたシナリオの表示 */}
          {nestedScenarios.map((nestedScenario) => (
            <ScenarioForm
              key={nestedScenario.id}
              headers={headers}
              scenarioId={`${scenarioId}-${nestedScenario.id}`}
              deleteScenario={() => setNestedScenarios(nestedScenarios.filter(s => s.id !== nestedScenario.id))}
            />
          ))}

          {/* トグル内に追加ボタンと削除ボタン */}
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
            {/* ボタンを重複させないようにし、トグルごとに追加されないよう修正 */}
            {nestedScenarios.length === 0 && (
              <>
                <button type="button" onClick={() => deleteScenario(scenarioId)} className="delete-button" style={{ marginRight: '10px' }}>
                  シナリオ削除
                </button>
                <button type="button" onClick={addNestedScenario} className="add-scenario-button">
                  シナリオをトグル内に追加
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioForm;
