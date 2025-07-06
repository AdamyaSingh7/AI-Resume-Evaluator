from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import PyPDF2
from scoring import score_resume
from feedback import generate_feedback
from pdf_generator import generate_feedback_pdf

# ✅ Define app BEFORE using it
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.get_json()
    parsed_text = data.get('text', '')
    scores = data.get('scores', {})
    feedback = data.get('feedback', '')

    pdf_buffer = generate_feedback_pdf(parsed_text, scores, feedback)
    return send_file(pdf_buffer, as_attachment=True, download_name="resume_feedback.pdf", mimetype='application/pdf')

@app.route('/upload', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['resume']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'Only PDF files are allowed'}), 400

    if len(file.read()) > 5 * 1024 * 1024:
        return jsonify({'error': 'File exceeds 5 MB limit'}), 400
    file.seek(0)  # reset after size check

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = "".join(page.extract_text() or "" for page in reader.pages)

        if not text.strip():
            return jsonify({'error': 'Unable to extract text from the PDF'}), 400

        scores = score_resume(text)
        feedback = generate_feedback(text, scores)

        return jsonify({
            'text': text.strip(),
            'scores': scores,
            'feedback': feedback
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)
