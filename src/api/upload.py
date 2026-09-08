import os
from flask import Blueprint, request, jsonify
import cloudinary
import cloudinary.uploader

# Aquí definimos el blueprint. NO lo importes aquí mismo.
upload_api = Blueprint('upload_api', __name__)

# Configuración de Cloudinary
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"), 
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET"),
  secure = True
)

@upload_api.route('/upload', methods=['POST'])
def handle_upload():
    try:
        # Verificar si vienen archivos
        if 'images' not in request.files:
            return jsonify({"error": "No se encontraron imágenes en la petición"}), 400

        files = request.files.getlist('images')
        uploaded_urls = []

        for file in files:
            # Subida a Cloudinary
            upload_result = cloudinary.uploader.upload(file)
            uploaded_urls.append(upload_result['secure_url'])

        return jsonify({"urls": uploaded_urls}), 200

    except Exception as e:
        print(f"Error en la subida: {str(e)}")
        return jsonify({"error": str(e)}), 500