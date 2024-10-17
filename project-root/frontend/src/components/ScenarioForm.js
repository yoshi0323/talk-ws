import React, { useState, useEffect } from 'react';

const ScenarioForm = ({ headers, data, scenarioId, deleteScenario }) => {
  const [selectedField, setSelectedField] = useState('');
  const [requiredInfo, setRequiredInfo] = useState('');
  const [conditionOperator, setConditionOperator] = useState('equals');
  const [scenarioInput, setScenarioInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);  // トグルの開閉状態
  const [nestedScenarios, setNestedScenarios] = useState([]);  // ネストされたシナリオ
  const [response, setResponse] = useState(''); // シナリオの回答

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

  // データ処理の関数
  const processData = (data) => {
    if (!data || data.length === 0) return; // dataが未定義または空の場合は処理を中止

    const row = data[0]; // 最初の行を処理
    const bvIndex = headers.indexOf('BV');
    const kIndex = headers.indexOf('K');
    const bwIndex = headers.indexOf('BW');
    const bxIndex = headers.indexOf('BX');
    const bzIndex = headers.indexOf('BZ');
    const caIndex = headers.indexOf('CA');
    const cbIndex = headers.indexOf('CB');
    const ccIndex = headers.indexOf('CC');
    const aaIndex = headers.indexOf('AA');

    let responseText = '';

    // BVの値に基づく処理
    if (row[bvIndex] === '1') {
      responseText = `配送日は${row[kIndex]}です。`;
    } else if (row[bvIndex] === '2') {
      responseText = `配送日は${row[kIndex]}ですが、確定ではありません。確定しますか？`;
    }

    // 配送時間の確認
    if (row[bwIndex] && row[bwIndex] !== 'OK' && row[bwIndex] !== 'NG' && row[bwIndex] !== '未') {
      responseText += ` 配送予定時間は${row[bwIndex]}～${row[bxIndex]}です。`;
    } else {
      responseText += ' 配送時間が決まっておりません。';
    }

    // 特定の行の処理（例：677行目）
    if (data.indexOf(row) === 676) { // 0-indexedなので676
      responseText += ' 11:00~14:00の間で配送予定です。';
    }

    // 配送日の変更
    if (row[bzIndex]) {
      responseText += ` ${row[bzIndex]}以降の曜日で回答可能です。`;
      if (row[caIndex]) {
        responseText += `ただし${row[caIndex]}の曜日には配送ができません。`;
      }
    }

    // 配送オプション
    if (row[aaIndex] === '1') {
      responseText += ` 配送オプション: ${row[cbIndex] === '1' ? '玄関渡し' : '開梱'}`;
    }

    // AA列の値に基づく条件分岐
    if (row[aaIndex] === '0') {
      responseText += ' 配送オプションはありません。';
    }

    // &シナリオの処理
    if (scenarioInput === 'input' && row[bvIndex] === '1') {
      responseText += ` 変数B: ${row[kIndex]}が配送日となります。`;
    }

    setResponse(responseText);
  };

  // データが変更されたときに処理を実行
  useEffect(() => {
    processData(data); // dataを引数として渡す
  }, [data]);

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
              data={data} // dataを渡す
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

          {/* シナリオの回答表示 */}
          <div>
            <h4>シナリオの回答:</h4>
            <p>{response}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioForm;