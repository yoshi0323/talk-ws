const express = require('express');
const { VoiceResponse } = require('twilio').twiml;
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// CSVデータの取り込み (mock function)
const csvData = [
  { BV: '1', K: '2024-10-25', BW: '11:00', BX: '14:00' },
  { BV: '2', K: '2024-10-30', BW: '', BX: '' },
];

app.post('/voice', (req, res) => {
  const twiml = new VoiceResponse();
  const selectedRow = csvData[0]; // 仮に1行目を選択

  // BVが1の場合、配送日を回答
  if (selectedRow.BV === '1') {
    twiml.say(`配送日は${selectedRow.K}です。`);
  } else if (selectedRow.BV === '2') {
    twiml.say(`配送日は${selectedRow.K}です。確定しますか？`);
  }

  // BWとBXの配送時間
  if (selectedRow.BW && selectedRow.BX) {
    twiml.say(`配送時間は${selectedRow.BW}から${selectedRow.BX}です。`);
  } else {
    twiml.say('配送時間が決まっておりません。');
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
