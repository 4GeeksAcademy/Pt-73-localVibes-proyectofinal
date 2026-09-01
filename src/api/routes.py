from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Category, Event, FavoriteEvent
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select, or_, delete
from datetime import datetime
import cloudinary.uploader
from flask import Blueprint, request, jsonify

api = Blueprint('api', __name__)
CORS(api)

# =============================================================
# 1. AUTENTICACIÓN Y USUARIOS
# =============================================================

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    required_fields = ["email", "password", "username", "name", "lastname"]
    if not body or any(field not in body or not body[field] for field in required_fields):
        return jsonify({"message": f"Faltan datos obligatorios: {', '.join(required_fields)}"}), 400

    stmt = select(User).where(or_(User.email == body["email"], User.username == body["username"]))
    if db.session.scalar(stmt):
        return jsonify({"message": "El username o el email ya se encuentran registrados"}), 400

    hashed_password = generate_password_hash(body["password"])
    new_user = User(
        username=body["username"],
        email=body["email"],
        password_hash=hashed_password,
        name=body["name"],
        lastname=body["lastname"],
        role=body.get("role", "user"),
        is_active=True,
        email_verify=False
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente", "user": new_user.serialize()}), 201


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    if not body or not body.get("email") or not body.get("password"):
        return jsonify({"message": "Se requiere email y contraseña"}), 400

    stmt = select(User).where(User.email == body["email"])
    user = db.session.scalar(stmt)

    if not user or not check_password_hash(user.password_hash, body["password"]):
        return jsonify({"message": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Inicio de sesión exitoso", "token": access_token, "user": user.serialize()}), 200


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))
    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200


# =============================================================
# 2. CATEGORÍAS
# =============================================================

@api.route('/categories', methods=['GET'])
def get_categories():
    stmt = select(Category)
    categories = db.session.scalars(stmt).all()
    return jsonify([category.serialize() for category in categories]), 200


# =============================================================
# 3. EVENTOS (ESTA ES LA RUTA QUE USA EL MAPA)
# =============================================================

@api.route('/events', methods=['GET'])
def get_events():
    category_id = request.args.get('category_id')
    # Seleccionamos eventos activos
    stmt = select(Event).where(Event.status == "active")

    if category_id:
        stmt = stmt.where(Event.category_id == int(category_id))

    events = db.session.scalars(stmt).all()
    # Retornamos la lista serializada (incluye lat y lng para el mapa)
    return jsonify([event.serialize() for event in events]), 200


@api.route('/events/<int:event_id>', methods=['GET'])
def get_event_detail(event_id):
    event = db.session.get(Event, event_id)
    if not event:
        return jsonify({"message": "Evento no encontrado"}), 404
    return jsonify(event.serialize()), 200


@api.route('/events', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = int(get_jwt_identity())
    body = request.get_json()

    required_fields = ["title", "category_id", "latitude", "longitude"]
    if not body or any(field not in body or not body[field] for field in required_fields):
        return jsonify({"message": "Faltan campos obligatorios"}), 400

    new_event = Event(
        title=body["title"],
        description=body.get("description"),
        location_name=body.get("location_name"),
        address=body.get("address"),
        latitude=float(body["latitude"]),
        longitude=float(body["longitude"]),
        image_url=body.get("image_url"),
        status="active",
        organizer_id=current_user_id,
        category_id=int(body["category_id"])
    )

    db.session.add(new_event)
    db.session.commit()
    return jsonify({"message": "Evento creado exitosamente", "event": new_event.serialize()}), 201


# =============================================================
# 4. FAVORITOS
# =============================================================

@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    current_user_id = int(get_jwt_identity())
    stmt = select(FavoriteEvent).where(FavoriteEvent.user_id == current_user_id)
    favorites = db.session.scalars(stmt).all()
    return jsonify([fav.serialize() for fav in favorites]), 200

@api.route('/favorites/<int:event_id>', methods=['POST'])
@jwt_required()
def add_favorite(event_id):
    current_user_id = int(get_jwt_identity())
    new_favorite = FavoriteEvent(user_id=current_user_id, event_id=event_id)
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({"message": "Agregado a favoritos"}), 201

# =============================================================
# 4. CLOUDINARY (Subida de imágenes)
# =============================================================

@api.route('/upload', methods=['POST'])
def upload_images():
    if 'images' not in request.files:
        return jsonify({"error": "No se encontraron imágenes"}), 400
        
    files = request.files.getlist('images')
    uploaded_urls = []

    try:
        for file in files:
            if file.filename != '':
                # Subir cada archivo a Cloudinary
                result = cloudinary.uploader.upload(file)
                uploaded_urls.append(result.get("secure_url"))
        
        return jsonify({
            "urls": uploaded_urls
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500