from flask import Flask, render_template, request, redirect
import os
import csv

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def upload_file():
    return render_template('upload.html')

@app.route('/uploader', methods=['POST'])
def uploader():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        process_csv(filepath)  # CSVの処理
        return 'File uploaded and processed successfully'

def process_csv(filepath):
    with open(filepath, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # CSVの各行に対してシナリオ分岐処理を実施
            print(row)

if __name__ == '__main__':
    app.run(debug=True)
