from flask import Flask, request, jsonify
from twilio.twiml.voice_response import VoiceResponse
from twilio.twiml.messaging_response import MessagingResponse
import openai
import os
import csv
from io import StringIO
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# OpenAIのAPIキーを設定
openai.api_key = os.getenv("OPENAI_API_KEY")

# モックされたCSVデータ (元の機能)
csv_data = [
    { 'BV': '1', 'K': '2024-10-25', 'BW': '11:00', 'BX': '14:00' },
    { 'BV': '2', 'K': '2024-10-30', 'BW': '', 'BX': '' }
]

# 音声通話の処理 (元の機能 + ChatGPT連携)
@app.route("/voice", methods=['POST'])
def voice():
    twiml_response = VoiceResponse()
    user_input = request.form.get('SpeechResult', '')  # 音声認識結果

    if user_input:
        # ChatGPT APIでユーザー入力を処理する（新機能）
        chatgpt_response = get_chatgpt_response(user_input)
        twiml_response.say(chatgpt_response, voice='alice', language='ja-JP')
    else:
        # BV列の値に基づく元々の処理（元の機能）
        selected_row = csv_data[0]  # 仮に1行目を選択
        if selected_row['BV'] == '1':
            twiml_response.say(f"配送日は{selected_row['K']}です。")
        elif selected_row['BV'] == '2':
            twiml_response.say(f"配送日は{selected_row['K']}です。確定しますか？")

        # 配送時間の確認（元の機能）
        if selected_row['BW'] and selected_row['BX']:
            twiml_response.say(f"配送時間は{selected_row['BW']}から{selected_row['BX']}です。")
        else:
            twiml_response.say("配送時間が決まっておりません。")

    return str(twiml_response)

# SMSの処理 (新機能)
@app.route("/sms", methods=['POST'])
def sms():
    user_input = request.form['Body']
    chatgpt_response = get_chatgpt_response(user_input)
    response = MessagingResponse()
    response.message(chatgpt_response)
    return str(response)

# ChatGPT APIを使用して応答を取得 (新機能)
def get_chatgpt_response(user_input):
    try:
        response = openai.Completion.create(
            engine="gpt-4",  # 適切なモデルエンジンを選択
            prompt=user_input,
            max_tokens=100,
            n=1,
            stop=None,
            temperature=0.7
        )
        return response.choices[0].text.strip()
    except Exception as e:
        return "申し訳ありませんが、処理に失敗しました。"

# CSVファイルのアップロード (新機能: JISエンコード対応)
@app.route("/upload", methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({"error": "ファイルが見つかりませんでした。"}), 400

    file = request.files['file']
    try:
        # CSVファイルを文字コード（Shift_JIS）で読み込む
        content = file.read().decode('shift_jis')
        csv_reader = csv.DictReader(StringIO(content))
        global csv_data
        csv_data = [row for row in csv_reader]
        return jsonify({"message": "ファイルが正常にアップロードされました。"})
    except Exception as e:
        return jsonify({"error": "ファイルの読み込みに失敗しました。"}), 500

if __name__ == "__main__":
    app.run(debug=True)
