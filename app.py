from flask import Flask, send_file, render_template, request, after_this_request
from PIL import Image
import os
import uuid

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_SIZE'] = 10 * 1024 * 1024  # 10 MB limit
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'file' not in request.files:
            return "No file part", 400

        file = request.files['file']
        if file.filename == "":
            return "No selected file", 400

        if not allowed_file(file.filename):
            return "Unsupported file type", 400

        input_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{uuid.uuid4()}_{file.filename}")
        file.save(input_path)

        output_format = request.form.get('format', 'png').upper()
        output_path = os.path.splitext(input_path)[0] + '.' + output_format.lower()

        try:
            with Image.open(input_path) as img:
                img.convert('RGB').save(output_path, output_format)

            @after_this_request
            def cleanup(response):
                # Remove both input and output files *after* sending response
                for path in [input_path, output_path]:
                    try:
                        if os.path.exists(path):
                            os.remove(path)
                    except Exception as e:
                        print(f"Cleanup failed: {e}")
                return response

            return send_file(output_path, as_attachment=True)

        except Exception as e:
            return f"Error converting file: {e}", 500

    return render_template('index.html')

if __name__ == '__main__':
    app.run()


