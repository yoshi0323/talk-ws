from flask import Flask, request, jsonify
from flask_cors import CORS
import csv

app = Flask(__name__)
CORS(app)  # ReactとのCORSを許可

@app.route('/upload', methods=['POST'])
def upload_csv():
    file = request.files['file']
    filepath = f"uploads/{file.filename}"
    file.save(filepath)
    headers = get_csv_headers(filepath)
    return jsonify({"headers": headers})

def get_csv_headers(filepath):
    with open(filepath, 'r') as f:
        reader = csv.reader(f)
        headers = next(reader)  # 最初の行（ヘッダー）を取得
    return headers

if __name__ == "__main__":
    app.run(debug=True)
