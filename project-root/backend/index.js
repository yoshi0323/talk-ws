require('dotenv').config();  // .envファイルから環境変数をロードするための設定

const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');

// TwilioのアカウントSIDとAuthTokenを環境変数から読み込む
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// 電話の処理
app.post('/call', (req, res) => {
  const { to, from } = req.body;

  client.calls
    .create({
      url: 'http://demo.twilio.com/docs/voice.xml',
      to: to,
      from: from,
    })
    .then(call => res.send(`Call initiated with ID: ${call.sid}`))
    .catch(error => res.status(500).send(`Error: ${error.message}`));
});

// SMSの処理
app.post('/sms', (req, res) => {
  const { to, from, body } = req.body;

  client.messages
    .create({
      body: body,
      to: to,
      from: from,
    })
    .then(message => res.send(`SMS sent with SID: ${message.sid}`))
    .catch(error => res.status(500).send(`Error: ${error.message}`));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
