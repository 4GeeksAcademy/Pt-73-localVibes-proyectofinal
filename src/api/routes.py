from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Category, Event, FavoriteEvent, Ticket, UserMedia
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select, or_, delete
from datetime import datetime, timedelta
import secrets
import cloudinary.uploader
from flask_mail import Message
from api.mail import mail

api = Blueprint('api', __name__)


# =============================================================
# 1. AUTENTICACIÓN Y USUARIOS
# =============================================================

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    required_fields = ["email", "password", "username", "name", "lastname"]

    if not body or any(field not in body or not body[field] for field in required_fields):
        return jsonify({
            "message": f"Faltan datos obligatorios: {', '.join(required_fields)}"
        }), 400

    stmt = select(User).where(
        or_(
            User.email == body["email"],
            User.username == body["username"]
        )
    )

    if db.session.scalar(stmt):
        return jsonify({
            "message": "El username o el email ya se encuentran registrados"
        }), 400

    hashed_password = generate_password_hash(body["password"])

    # Código de verificación de 6 dígitos
    verification_code = str(secrets.randbelow(1000000)).zfill(6)

    new_user = User(
        username=body["username"],
        email=body["email"],
        password_hash=hashed_password,
        name=body["name"],
        lastname=body["lastname"],
        role=body.get("role", "user"),
        is_active=True,
        email_verify=False,
        verification_code=verification_code,
        verification_code_expires_at=datetime.utcnow() + timedelta(minutes=10)
    )

    db.session.add(new_user)
    db.session.commit()

    # Enviar código por correo
    try:
        msg = Message(
            subject="Verifica tu correo - Local Vibes",
            recipients=[new_user.email],
            body=f"""Hola {new_user.name},

Gracias por registrarte en Local Vibes.

Tu código de verificación es:

{verification_code}

Este código vence en 10 minutos.

Si no realizaste este registro, puedes ignorar este correo.

¡Bienvenido a Local Vibes!
"""
        )

        mail.send(msg)

    except Exception as e:
        print("Error enviando correo:", e)

        return jsonify({
            "message": "Usuario registrado, pero no se pudo enviar el correo de verificación."
        }), 500

    return jsonify({
        "message": "Usuario registrado exitosamente. Revisa tu correo para obtener el código de verificación.",
        "email": new_user.email
    }), 201


# =============================================================
# 2. VERIFICAR CORREO ELECTRÓNICO
# =============================================================

@api.route('/verify-email', methods=['POST'])
def verify_email():
    body = request.get_json()

    email = body.get("email") if body else None
    code = body.get("code") if body else None

    if not email or not code:
        return jsonify({
            "message": "Se requiere el email y el código de verificación"
        }), 400

    stmt = select(User).where(User.email == email)
    user = db.session.scalar(stmt)

    if not user:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    if user.email_verify:
        return jsonify({
            "message": "El correo ya se encuentra verificado"
        }), 400

    if user.verification_code != code:
        return jsonify({
            "message": "El código de verificación es incorrecto"
        }), 400

    if not user.verification_code_expires_at:
        return jsonify({
            "message": "El código de verificación no es válido"
        }), 400

    if datetime.utcnow() > user.verification_code_expires_at:
        return jsonify({
            "message": "El código de verificación ha expirado"
        }), 400

    # Verificación exitosa
    user.email_verify = True
    user.verification_code = None
    user.verification_code_expires_at = None

    db.session.commit()

    return jsonify({
        "message": "Correo electrónico verificado exitosamente"
    }), 200


# =============================================================
# 3. REENVIAR CÓDIGO DE VERIFICACIÓN
# =============================================================

@api.route('/resend-verification', methods=['POST'])
def resend_verification():
    body = request.get_json()

    email = body.get("email") if body else None

    if not email:
        return jsonify({
            "message": "Se requiere el email"
        }), 400

    stmt = select(User).where(User.email == email)
    user = db.session.scalar(stmt)

    if not user:
        return jsonify({
            "message": "Usuario no encontrado"
        }), 404

    if user.email_verify:
        return jsonify({
            "message": "El correo ya se encuentra verificado"
        }), 400

    # Generar nuevo código
    verification_code = str(secrets.randbelow(1000000)).zfill(6)

    user.verification_code = verification_code
    user.verification_code_expires_at = datetime.utcnow() + timedelta(minutes=10)

    db.session.commit()

    # Enviar nuevo correo
    try:
        msg = Message(
            subject="Nuevo código de verificación - Local Vibes",
            recipients=[user.email],
            body=f"""Hola {user.name},

Tu nuevo código de verificación para Local Vibes es:

{verification_code}

Este código vence en 10 minutos.

Si no realizaste esta solicitud, puedes ignorar este correo.

¡Gracias!
"""
        )

        mail.send(msg)

    except Exception as e:
        print("Error enviando correo:", e)

        return jsonify({
            "message": "No se pudo enviar el nuevo código de verificación."
        }), 500

    return jsonify({
        "message": "Nuevo código enviado correctamente"
    }), 200


# =============================================================
# 4. LOGIN & PERFIL UNIFICADO
# =============================================================

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()

    if not body or not body.get("email") or not body.get("password"):
        return jsonify({
            "message": "Se requiere email y contraseña"
        }), 400

    stmt = select(User).where(User.email == body["email"])
    user = db.session.scalar(stmt)

    if not user or not check_password_hash(
        user.password_hash,
        body["password"]
    ):
        return jsonify({
            "message": "Credenciales inválidas"
        }), 401

    if not user.email_verify:
        return jsonify({
            "message": "Debes verificar tu correo electrónico antes de iniciar sesión."
        }), 403

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Inicio de sesión exitoso",
        "token": access_token,
        "user": user.serialize()
    }), 200


@api.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def handle_profile():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    # GET: Enviar datos al frontend
    if request.method == 'GET':
        return jsonify(user.serialize()), 200

    # PUT: Guardar cambios desde el frontend (incluye foto de Cloudinary)
    if request.method == 'PUT':
        data = request.get_json()
        
        new_avatar_url = data.get("image_url")
        if new_avatar_url:
            user.avatar = new_avatar_url 
            
        if "name" in data:
            user.name = data["name"]
        if "lastname" in data:
            user.lastname = data["lastname"]
            
        db.session.commit()
        
        return jsonify({
            "message": "Perfil actualizado con éxito", 
            "user": user.serialize()
        }), 200


# =============================================================
# 5. CATEGORÍAS
# =============================================================

@api.route('/categories', methods=['GET'])
def get_categories():
    stmt = select(Category)
    categories = db.session.scalars(stmt).all()
    return jsonify([category.serialize() for category in categories]), 200


# =============================================================
# 6. EVENTOS
# =============================================================

@api.route('/events', methods=['GET'])
def get_events():
    category_id = request.args.get('category_id')
    
    # 👇 Filtro estricto: Solo muestra eventos cuya fecha de inicio sea MAYOR a la hora y fecha actual
    stmt = select(Event).where(
        Event.status == "active",
        Event.start_time >= datetime.now()
    )

    if category_id:
        stmt = stmt.where(Event.category_id == int(category_id))

    events = db.session.scalars(stmt).all()
    
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
    body = request.get_json()
    current_user_id = int(get_jwt_identity())

    # Extraer imágenes para arreglar Explorar
    imgs = body.get("imgs_event", [])
    
    if isinstance(imgs, str):
        main_image = imgs
        imgs = [imgs]
    else:
        main_image = imgs[0] if isinstance(imgs, list) and len(imgs) > 0 else None

    new_event = Event(
        title=body.get("title"),
        category_id=body.get("category_id"),
        location_name=body.get("location_name"),
        address=body.get("address"),
        start_time=body.get("start_time"),
        description=body.get("description"),
        capacity=body.get("capacity"),
        latitude=body.get("latitude"),
        longitude=body.get("longitude"),
        imgs_event=imgs,
        image_url=main_image, # Retrocompatibilidad
        organizer_id=current_user_id,
        price=body.get("price", 0.0),
        end_time=body.get("end_time")
    )

    db.session.add(new_event)
    db.session.commit()

    return jsonify({
        "message": "Evento creado exitosamente",
        "event": new_event.serialize()
    }), 201


@api.route('/user/events', methods=['GET'])
@jwt_required()
def get_my_events():
    current_user_id = int(get_jwt_identity())
    stmt = select(Event).where(Event.organizer_id == current_user_id).order_by(Event.start_time.desc())
    my_events = db.session.scalars(stmt).all()
    return jsonify([event.serialize() for event in my_events]), 200


@api.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user_id = int(get_jwt_identity())
    event = db.session.get(Event, event_id)
    
    if not event:
        return jsonify({"message": "Evento no encontrado"}), 404
        
    if event.organizer_id != current_user_id:
        return jsonify({"message": "No tienes permiso para eliminar este evento"}), 403
        
    db.session.delete(event)
    db.session.commit()
    
    return jsonify({"message": "Evento eliminado con éxito"}), 200


@api.route('/events/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    current_user_id = int(get_jwt_identity())
    event = db.session.get(Event, event_id)
    
    if not event:
        return jsonify({"message": "Evento no encontrado"}), 404
        
    if event.organizer_id != current_user_id:
        return jsonify({"message": "No tienes permiso para editar este evento"}), 403
        
    body = request.get_json()
    
    if "title" in body: event.title = body["title"]
    if "category_id" in body: event.category_id = body["category_id"]
    if "location_name" in body: event.location_name = body["location_name"]
    if "address" in body: event.address = body["address"]
    if "start_time" in body: event.start_time = body["start_time"]
    if "end_time" in body: event.end_time = body["end_time"]
    if "description" in body: event.description = body["description"]
    if "price" in body: event.price = body["price"]
    if "capacity" in body: event.capacity = body["capacity"]
    if "latitude" in body: event.latitude = body["latitude"]
    if "longitude" in body: event.longitude = body["longitude"]
    if "imgs_event" in body: event.imgs_event = body["imgs_event"]

    db.session.commit()
    
    return jsonify({"message": "Evento actualizado con éxito", "event": event.serialize()}), 200


# =============================================================
# 7. FAVORITOS
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

    stmt = select(FavoriteEvent).where(
        FavoriteEvent.user_id == current_user_id,
        FavoriteEvent.event_id == event_id
    )

    if db.session.scalars(stmt).first():
        return jsonify({"message": "Este evento ya se encuentra en tus favoritos"}), 400

    new_favorite = FavoriteEvent(user_id=current_user_id, event_id=event_id)
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({"message": "Agregado a favoritos"}), 201


@api.route('/favorites/<int:event_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(event_id):
    current_user_id = int(get_jwt_identity())

    stmt = select(FavoriteEvent).where(
        FavoriteEvent.user_id == current_user_id,
        FavoriteEvent.event_id == event_id
    )

    favorite_to_delete = db.session.scalars(stmt).first()

    if not favorite_to_delete:
        return jsonify({"error": "El favorito no existe"}), 404

    db.session.delete(favorite_to_delete)
    db.session.commit()

    return jsonify({"message": "Eliminado de favoritos"}), 200


# =============================================================
# 8. DASHBOARD STATS
# =============================================================

@api.route('/user/dashboard-stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    current_user_id = int(get_jwt_identity())

    created_events = Event.query.filter_by(organizer_id=current_user_id).count()
    saved_favorites = FavoriteEvent.query.filter_by(user_id=current_user_id).count()
    purchased_tickets = Ticket.query.filter_by(user_id=current_user_id).count()

    return jsonify({
        "created_events": created_events,
        "saved_favorites": saved_favorites,
        "purchased_tickets": purchased_tickets
    }), 200


# =============================================================
# 9. CLOUDINARY (Subida de imágenes general)
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
                result = cloudinary.uploader.upload(file)
                uploaded_urls.append(result.get("secure_url"))
        
        return jsonify({"urls": uploaded_urls}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =============================================================
# 10. GALERÍA DE USUARIO (User Media)
# =============================================================

@api.route('/user/media', methods=['POST'])
@jwt_required()
def add_media_image():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    image_url = data.get("image_url")
    
    if not image_url:
        return jsonify({"message": "Falta la URL de la imagen"}), 400
        
    new_media = UserMedia(
        user_id=int(current_user_id),
        image_url=image_url
    )
    
    db.session.add(new_media)
    db.session.commit()
    
    return jsonify({"message": "Imagen guardada en la galería", "media": new_media.serialize()}), 201


# =============================================================
# 11. COMPRA Y GESTIÓN DE ENTRADAS (CHECKOUT)
# =============================================================

@api.route('/tickets', methods=['POST'])
@jwt_required()
def buy_ticket():
    current_user_id = int(get_jwt_identity())
    body = request.get_json()
    
    event_id = body.get("event_id")
    if not event_id:
        return jsonify({"message": "El ID del evento es requerido"}), 400
        
    new_ticket = Ticket(
        user_id=current_user_id,
        event_id=event_id,
        ticket_type=body.get("ticket_type", "General")
    )
    
    db.session.add(new_ticket)
    db.session.commit()
    
    return jsonify({"message": "Compra exitosa", "ticket": new_ticket.serialize()}), 201


@api.route('/user/tickets', methods=['GET'])
@jwt_required()
def get_my_tickets():
    current_user_id = int(get_jwt_identity())
    stmt = select(Ticket).where(Ticket.user_id == current_user_id).order_by(Ticket.purchased_at.desc())
    my_tickets = db.session.scalars(stmt).all()
    
    return jsonify([ticket.serialize() for ticket in my_tickets]), 200