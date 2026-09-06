import click
from api.models import db, User, Category, Event
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
from sqlalchemy import delete
# SEED PARA RELLENAR BASE DE DATOS
def setup_commands(app):
    
    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("🧹 Limpiando base de datos (eventos y categorías anteriores)...")
        db.session.execute(delete(Event))
        db.session.execute(delete(Category))
        db.session.commit()

        print("🌱 Insertando datos de prueba de Caracas...")

        # 1. Crear o recuperar Usuario Administrador
        admin_email = "admin@localvibes.com"
        user = db.session.query(User).filter_by(email=admin_email).first()
        
        if not user:
            user = User(
                username="admin_eventos",
                email=admin_email,
                password_hash=generate_password_hash("123456"),
                name="Admin",
                lastname="LocalVibes",
                role="admin",
                is_active=True,
                email_verify=True
            )
            db.session.add(user)
            db.session.commit()

        # 2. Crear las 5 Categorías
        categories_data = [
            Category(name="Música", description="Conciertos y festivales", icon="bi-music-note-beamed"),
            Category(name="Tecnología", description="Meetups, charlas y hackathons", icon="bi-laptop"),
            Category(name="Deportes", description="Torneos, carreras y entrenamientos", icon="bi-trophy"),
            Category(name="Gastronomía", description="Ferias de comida y catas", icon="bi-cup-straw"),
            Category(name="Arte y Cultura", description="Exposiciones y teatro", icon="bi-palette")
        ]
        db.session.add_all(categories_data)
        db.session.commit()

        # Guardamos las categorías en variables para asociarlas fácil
        cat_musica = categories_data[0].id
        cat_tech = categories_data[1].id
        cat_deportes = categories_data[2].id
        cat_gastro = categories_data[3].id
        cat_arte = categories_data[4].id

        # 3. Crear 10 Eventos (2 por categoría) distribuidos en Caracas
        now = datetime.utcnow()

        events_data = [
            # --- MÚSICA ---
            Event(
                title="Concierto Sinfónico Juvenil",
                description="Disfruta de una tarde mágica con la Orquesta Sinfónica en la majestuosa sala Ríos Reyna.",
                location_name="Teatro Teresa Carreño",
                address="Final Paseo Colón, Bellas Artes, Caracas",
                latitude=10.4994, longitude=-66.8983,  # Bellas Artes
                start_time=now + timedelta(days=2, hours=16),
                end_time=now + timedelta(days=2, hours=19),
                image_url="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800",
                status="active", organizer_id=user.id, category_id=cat_musica
            ),
            Event(
                title="Festival Indie Caracas",
                description="Las mejores bandas alternativas de la ciudad tocando al aire libre.",
                location_name="Concha Acústica de Bello Monte",
                address="Final Av. Caurimare, Colinas de Bello Monte",
                latitude=10.4855, longitude=-66.8643,  # Bello Monte
                start_time=now + timedelta(days=5, hours=15),
                end_time=now + timedelta(days=5, hours=23),
                image_url="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800",
                status="active", organizer_id=user.id, category_id=cat_musica
            ),

            # --- TECNOLOGÍA ---
            Event(
                title="Caracas Tech & Startups Meetup",
                description="Networking, charlas de Inteligencia Artificial y tendencias en desarrollo web.",
                location_name="Impact Hub Caracas",
                address="Torre Parque Ávila, Av. Francisco de Miranda, Los Palos Grandes",
                latitude=10.4957, longitude=-66.8450,  # Los Palos Grandes
                start_time=now + timedelta(days=3, hours=18),
                end_time=now + timedelta(days=3, hours=21),
                image_url="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
                status="active", organizer_id=user.id, category_id=cat_tech
            ),
            Event(
                title="Hackathon Innovación Ucabista",
                description="Competencia de programación de 24 horas continuas resolviendo problemas sociales.",
                location_name="UCAB",
                address="Universidad Católica Andrés Bello, Montalbán",
                latitude=10.4632, longitude=-66.9751,  # Montalbán
                start_time=now + timedelta(days=10, hours=8),
                end_time=now + timedelta(days=11, hours=8),
                image_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
                status="active", organizer_id=user.id, category_id=cat_tech
            ),

            # --- DEPORTES ---
            Event(
                title="Entrenamiento Funcional al Aire Libre",
                description="Clase abierta de funcional y HIIT para todos los niveles. Lleva tu hidratación.",
                location_name="Parque Generalísimo Francisco de Miranda",
                address="Av. Francisco de Miranda, Caracas (Parque del Este)",
                latitude=10.4941, longitude=-66.8354,  # Parque del Este
                start_time=now + timedelta(days=1, hours=7),
                end_time=now + timedelta(days=1, hours=9),
                image_url="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
                status="active", organizer_id=user.id, category_id=cat_deportes
            ),
            Event(
                title="Torneo Relámpago de Pádel",
                description="Inscríbete con tu pareja y participa en el torneo de fin de semana.",
                location_name="Capital Pádel Club",
                address="Valle Arriba, Caracas",
                latitude=10.4680, longitude=-66.8580,  # Valle Arriba
                start_time=now + timedelta(days=7, hours=9),
                end_time=now + timedelta(days=8, hours=18),
                image_url="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800",
                status="active", organizer_id=user.id, category_id=cat_deportes
            ),

            # --- GASTRONOMÍA ---
            Event(
                title="Feria de Food Trucks Caracas",
                description="Más de 15 propuestas gastronómicas, música en vivo y ambiente familiar.",
                location_name="Plaza Alfredo Sadel",
                address="Av. Principal de Las Mercedes",
                latitude=10.4811, longitude=-66.8617,  # Las Mercedes
                start_time=now + timedelta(days=4, hours=12),
                end_time=now + timedelta(days=4, hours=22),
                image_url="https://images.unsplash.com/photo-1565123409695-4af5670f2095?w=800",
                status="active", organizer_id=user.id, category_id=cat_gastro
            ),
            Event(
                title="Cata de Café y Chocolate Venezolano",
                description="Un recorrido por los sabores de nuestros cacaos finos de aroma y el mejor café.",
                location_name="Pueblo de El Hatillo",
                address="Calle Escalona, Casco Histórico de El Hatillo",
                latitude=10.4237, longitude=-66.8252,  # El Hatillo
                start_time=now + timedelta(days=6, hours=15),
                end_time=now + timedelta(days=6, hours=18),
                image_url="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
                status="active", organizer_id=user.id, category_id=cat_gastro
            ),

            # --- ARTE Y CULTURA ---
            Event(
                title="Exposición: Caracas Inédita",
                description="Muestra fotográfica de la arquitectura caraqueña de los años 50.",
                location_name="Galería de Arte Nacional (GAN)",
                address="Av. México, Plaza de los Museos, Caracas",
                latitude=10.5028, longitude=-66.9026,  # Bellas Artes / Centro
                start_time=now + timedelta(days=2, hours=10),
                end_time=now + timedelta(days=15, hours=17),
                image_url="https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=800",
                status="active", organizer_id=user.id, category_id=cat_arte
            ),
            Event(
                title="Obra: El Ensayo",
                description="Teatro íntimo. Una comedia sobre los enredos de una compañía teatral.",
                location_name="Trasnocho Cultural",
                address="Centro Comercial Paseo Las Mercedes, Nivel Trasnocho",
                latitude=10.4800, longitude=-66.8601,  # Las Mercedes
                start_time=now + timedelta(days=8, hours=20),
                end_time=now + timedelta(days=8, hours=22),
                image_url="https://images.unsplash.com/photo-1507676184212-d0330a151f15?w=800",
                status="active", organizer_id=user.id, category_id=cat_arte
            )
        ]
        
        db.session.add_all(events_data)
        db.session.commit()

        print("✅ Base de datos poblada con éxito: 5 Categorías y 10 Eventos en Caracas.")