import click
from flask.cli import with_appcontext
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
from api.models import db, User, Category, Event, FavoriteEvent, Ticket, UserMedia


def setup_commands(app):

    @app.cli.command("insert-test-data")
    @with_appcontext
    def insert_test_data():
        """
        Inserta datos de prueba en la base de datos (Categorías, Usuarios y Eventos)
        """
        print("Empezando a inyectar datos de prueba...")

        # ========================================================
        # 1. LIMPIAR BASE DE DATOS (Evita duplicados)
        # ========================================================
        print("Limpiando tablas antiguas...")
        FavoriteEvent.query.delete()
        Ticket.query.delete()
        UserMedia.query.delete()
        Event.query.delete()
        Category.query.delete()
        User.query.delete()
        db.session.commit()

        # ========================================================
        # 2. CREAR USUARIOS
        # ========================================================
        print("Creando usuarios...")
        hashed_password = generate_password_hash("123456")

        user1 = User(
            username="localvibes_admin",
            email="admin@localvibes.com",
            password_hash=hashed_password,
            name="Edgar",
            lastname="Maldonado",
            role="admin",
            is_active=True,
            avatar="https://ui-avatars.com/api/?name=Edgar+Maldonado&background=ff523b&color=fff"
        )

        user2 = User(
            username="carlos_eventos",
            email="carlos@gmail.com",
            password_hash=hashed_password,
            name="Carlos",
            lastname="Pérez",
            role="organizer",
            is_active=True
        )

        db.session.add(user1)
        db.session.add(user2)
        db.session.commit()

        # ========================================================
        # 3. CREAR CATEGORÍAS (AHORA SON 5)
        # ========================================================
        print("Creando 5 categorías...")
        cat_musica = Category(
            name="Música", description="Conciertos, festivales y recitales")
        cat_teatro = Category(
            name="Teatro", description="Obras, stand-up y artes escénicas")
        cat_deportes = Category(
            name="Deportes", description="Eventos deportivos y carreras")
        cat_gastronomia = Category(
            name="Gastronomía", description="Ferias, catas y degustaciones")
        cat_tecnologia = Category(
            name="Tecnología", description="Conferencias, hackathons y networking")

        db.session.add_all(
            [cat_musica, cat_teatro, cat_deportes, cat_gastronomia, cat_tecnologia])
        db.session.commit()

        # ========================================================
        # 4. CREAR EVENTOS (6 POR CATEGORÍA = 30 EVENTOS)
        # ========================================================
        print("Creando 30 eventos espectaculares...")

        now = datetime.now()

        eventos = [
            # ----------------------------------------------------
            # MÚSICA
            # ----------------------------------------------------
            Event(
                title="Cusica Fest 2026",
                description="El festival más grande de Venezuela regresa. Bandas nacionales e internacionales en dos días de música ininterrumpida.",
                start_time=(now + timedelta(days=15)
                            ).replace(hour=14, minute=0).isoformat(),
                end_time="23:59",
                price=60.00,
                capacity=10000,
                status="active",
                location_name="Universidad Simón Bolívar",
                address="Valle de Sartenejas, Baruta, Caracas",
                latitude=10.4105, longitude=-66.8837,
                image_url="https://images.unsplash.com/photo-1540039155732-61ee01ba29e5?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1540039155732-61ee01ba29e5?w=800"],
                category_id=cat_musica.id, organizer_id=user1.id
            ),
            Event(
                title="Tributo a Queen Sinfónico",
                description="La Orquesta Sinfónica Gran Mariscal de Ayacucho rinde tributo a la banda británica Queen.",
                start_time=(now + timedelta(days=3)
                            ).replace(hour=19, minute=0).isoformat(),
                end_time="21:30",
                price=30.00,
                capacity=2000,
                status="active",
                location_name="Concha Acústica de Bello Monte",
                address="Colinas de Bello Monte, Caracas",
                latitude=10.4851, longitude=-66.8665,
                image_url="https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=800"],
                category_id=cat_musica.id, organizer_id=user2.id
            ),
            Event(
                title="Noche de Jazz & Vinos",
                description="Relájate con el mejor jazz caraqueño mientras disfrutas de una selección de vinos chilenos.",
                start_time=(now + timedelta(days=8)
                            ).replace(hour=20, minute=30).isoformat(),
                end_time="01:00",
                price=0.00,
                capacity=150,
                status="active",
                location_name="Centro Cultural Chacao",
                address="Avenida Tamanaco, El Rosal, Caracas",
                latitude=10.4901, longitude=-66.8587,
                image_url="https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800"],
                category_id=cat_musica.id, organizer_id=user1.id
            ),
            Event(
                title="Concierto de Los Mesoneros",
                description="La aclamada banda de rock venezolano presenta su nuevo disco en vivo.",
                start_time=(now + timedelta(days=22)
                            ).replace(hour=20, minute=0).isoformat(),
                end_time="23:30",
                price=45.00,
                capacity=3500,
                status="active",
                location_name="Terraza del CCCT",
                address="Chuao, Caracas, Miranda",
                latitude=10.4795, longitude=-66.8529,
                image_url="https://images.unsplash.com/photo-1493225457224-eda0e6fd1463?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1493225457224-eda0e6fd1463?w=800"],
                category_id=cat_musica.id, organizer_id=user2.id
            ),
            Event(
                title="Sunset Electrónico El Volcán",
                description="Música electrónica al aire libre viendo el atardecer sobre Caracas.",
                start_time=(now + timedelta(days=5)
                            ).replace(hour=16, minute=0).isoformat(),
                end_time="22:00",
                price=15.00,
                capacity=500,
                status="active",
                location_name="El Volcán",
                address="El Hatillo, Miranda",
                latitude=10.4285, longitude=-66.8285,
                image_url="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"],
                category_id=cat_musica.id, organizer_id=user1.id
            ),
            Event(
                title="Gaitas del Colegio San Ignacio",
                description="Empieza la temporada navideña con el festival de gaitas más esperado del año.",
                start_time=(now + timedelta(days=40)
                            ).replace(hour=12, minute=0).isoformat(),
                end_time="22:00",
                price=10.00,
                capacity=4000,
                status="active",
                location_name="Colegio San Ignacio de Loyola",
                address="Chacao, Caracas",
                latitude=10.4998, longitude=-66.8532,
                image_url="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800"],
                category_id=cat_musica.id, organizer_id=user2.id
            ),

            # ----------------------------------------------------
            # TEATRO Y ARTE
            # ----------------------------------------------------
            Event(
                title="Obra: El Método Grönholm",
                description="Cuatro aspirantes a un cargo ejecutivo se enfrentan a unas pruebas de selección inusuales.",
                start_time=(now + timedelta(days=12)
                            ).replace(hour=19, minute=0).isoformat(),
                end_time="21:00",
                price=20.00,
                capacity=300,
                status="active",
                location_name="Teatro Trasnocho",
                address="C.C. Paseo Las Mercedes, Caracas",
                latitude=10.4791, longitude=-66.8617,
                image_url="https://images.unsplash.com/photo-1507676184212-d0330a15233c?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1507676184212-d0330a15233c?w=800"],
                category_id=cat_teatro.id, organizer_id=user1.id
            ),
            Event(
                title="Stand Up Comedy: Emilio Lovera",
                description="El maestro de la comedia venezolana regresa con su nuevo show lleno de anécdotas.",
                start_time=(now + timedelta(days=2)
                            ).replace(hour=20, minute=30).isoformat(),
                end_time="22:30",
                price=25.00,
                capacity=800,
                status="active",
                location_name="Centro Cultural BOD",
                address="La Castellana, Caracas",
                latitude=10.4983, longitude=-66.8538,
                image_url="https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800"],
                category_id=cat_teatro.id, organizer_id=user2.id
            ),
            Event(
                title="Microteatro Venezuela",
                description="Obras de 15 minutos en espacios pequeños de 15 metros cuadrados. ¡Pura intensidad!",
                start_time=(now + timedelta(days=7)
                            ).replace(hour=18, minute=0).isoformat(),
                end_time="23:59",
                price=5.00,
                capacity=1500,
                status="active",
                location_name="Urban Cuplé, CCCT",
                address="Chuao, Caracas, Miranda",
                latitude=10.4795, longitude=-66.8529,
                image_url="https://images.unsplash.com/photo-1518834107812-6afb05940256?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1518834107812-6afb05940256?w=800"],
                category_id=cat_teatro.id, organizer_id=user1.id
            ),
            Event(
                title="Improvisto Clásico",
                description="Show de improvisación teatral donde el público decide qué actúan los actores.",
                start_time=(now + timedelta(days=14)
                            ).replace(hour=20, minute=0).isoformat(),
                end_time="21:45",
                price=12.00,
                capacity=250,
                status="active",
                location_name="Teatro Escena 8",
                address="Las Mercedes, Caracas",
                latitude=10.4815, longitude=-66.8590,
                image_url="https://images.unsplash.com/photo-1498661694102-0a3793ed8820?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1498661694102-0a3793ed8820?w=800"],
                category_id=cat_teatro.id, organizer_id=user2.id
            ),
            Event(
                title="El Cascanueces (Ballet Teresa Carreño)",
                description="El clásico de navidad llega de nuevo a la imponente sala Ríos Reyna del Teresa Carreño.",
                start_time=(now + timedelta(days=60)
                            ).replace(hour=16, minute=30).isoformat(),
                end_time="18:30",
                price=30.00,
                capacity=2400,
                status="active",
                location_name="Teatro Teresa Carreño",
                address="Parque Central, Caracas",
                latitude=10.4996, longitude=-66.8993,
                image_url="https://images.unsplash.com/photo-1516474640498-8ec1f99c29cc?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1516474640498-8ec1f99c29cc?w=800"],
                category_id=cat_teatro.id, organizer_id=user1.id
            ),
            Event(
                title="Conversatorio: Arte Contemporáneo",
                description="Charla y exposición gratuita con artistas locales emergentes.",
                start_time=(now + timedelta(days=10)
                            ).replace(hour=10, minute=0).isoformat(),
                end_time="13:00",
                price=0.00,
                capacity=100,
                status="active",
                location_name="Galería de Arte Nacional",
                address="Avenida México, Caracas",
                latitude=10.5037, longitude=-66.9066,
                image_url="https://images.unsplash.com/photo-1518998053401-8714bb7e4dc6?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1518998053401-8714bb7e4dc6?w=800"],
                category_id=cat_teatro.id, organizer_id=user2.id
            ),

            # ----------------------------------------------------
            # DEPORTES
            # ----------------------------------------------------
            Event(
                title="Maratón CAF Caracas 2026",
                description="La carrera más importante de Venezuela. Únete a los 42K, 21K o apoya en las calles.",
                start_time=(now + timedelta(days=90)
                            ).replace(hour=5, minute=30).isoformat(),
                end_time="12:00",
                price=40.00,
                capacity=12000,
                status="active",
                location_name="Parque Los Caobos (Salida)",
                address="Plaza Morelos, Caracas",
                latitude=10.5009, longitude=-66.8997,
                image_url="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800"],
                category_id=cat_deportes.id, organizer_id=user1.id
            ),
            Event(
                title="Leones vs Navegantes (Clásico)",
                description="El juego más emocionante de la LVBP. Ven a apoyar a tu equipo en el estadio Monumental.",
                start_time=(now + timedelta(days=4)
                            ).replace(hour=19, minute=0).isoformat(),
                end_time="23:30",
                price=15.00,
                capacity=38000,
                status="active",
                location_name="Estadio Monumental Simón Bolívar",
                address="La Rinconada, Caracas",
                latitude=10.4357, longitude=-66.9388,
                image_url="https://images.unsplash.com/photo-1508344928928-7137b29de216?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1508344928928-7137b29de216?w=800"],
                category_id=cat_deportes.id, organizer_id=user2.id
            ),
            Event(
                title="Clase Masiva de Bailoterapia",
                description="Únete a cientos de caraqueños quemando calorías y disfrutando al ritmo de la música.",
                start_time=(now + timedelta(days=6)
                            ).replace(hour=8, minute=0).isoformat(),
                end_time="10:00",
                price=0.00,
                capacity=500,
                status="active",
                location_name="Plaza Altamira",
                address="Avenida Francisco de Miranda, Chacao",
                latitude=10.4957, longitude=-66.8488,
                image_url="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800"],
                category_id=cat_deportes.id, organizer_id=user1.id
            ),
            Event(
                title="Torneo de Padel El Hatillo",
                description="Inscríbete en el torneo relámpago de Padel o ven como espectador.",
                start_time=(now + timedelta(days=17)
                            ).replace(hour=9, minute=0).isoformat(),
                end_time="20:00",
                price=20.00,
                capacity=200,
                status="active",
                location_name="Padel Club El Hatillo",
                address="El Hatillo, Miranda",
                latitude=10.4258, longitude=-66.8252,
                image_url="https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1622279457486-62dcc4a631d6?w=800"],
                category_id=cat_deportes.id, organizer_id=user2.id
            ),
            Event(
                title="Ruta Ciclista a Sabas Nieves",
                description="Reto de bicicleta de montaña subiendo el Ávila. Hidratación incluida.",
                start_time=(now + timedelta(days=9)
                            ).replace(hour=6, minute=30).isoformat(),
                end_time="10:30",
                price=5.00,
                capacity=100,
                status="active",
                location_name="Entrada Sabas Nieves, El Ávila",
                address="Altamira, Caracas",
                latitude=10.5100, longitude=-66.8524,
                image_url="https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800"],
                category_id=cat_deportes.id, organizer_id=user1.id
            ),
            Event(
                title="Final Torneo de Fútbol 7",
                description="Copa Intercolegial de Caracas, final de infarto.",
                start_time=(now + timedelta(days=11)
                            ).replace(hour=16, minute=0).isoformat(),
                end_time="18:30",
                price=0.00,
                capacity=600,
                status="active",
                location_name="Canchas del Colegio San Ignacio",
                address="Chacao, Caracas",
                latitude=10.4998, longitude=-66.8532,
                image_url="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"],
                category_id=cat_deportes.id, organizer_id=user2.id
            ),

            # ----------------------------------------------------
            # GASTRONOMÍA
            # ----------------------------------------------------
            Event(
                title="Caracas Food Truck Fest",
                description="Más de 20 food trucks reunidos. Hamburguesas, comida asiática, postres y cerveza artesanal.",
                start_time=(now + timedelta(days=13)
                            ).replace(hour=17, minute=0).isoformat(),
                end_time="23:30",
                price=0.00,
                capacity=3000,
                status="active",
                location_name="Plaza Alfredo Sadel",
                address="Las Mercedes, Caracas",
                latitude=10.4816, longitude=-66.8624,
                image_url="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800"],
                category_id=cat_gastronomia.id, organizer_id=user1.id
            ),
            Event(
                title="Cata de Ron de Venezuela",
                description="Degustación guiada de los mejores rones venezolanos con Denominación de Origen.",
                start_time=(now + timedelta(days=20)
                            ).replace(hour=19, minute=30).isoformat(),
                end_time="22:00",
                price=35.00,
                capacity=50,
                status="active",
                location_name="Hacienda La Trinidad",
                address="Secadero, La Trinidad, Caracas",
                latitude=10.4354, longitude=-66.8647,
                image_url="https://images.unsplash.com/photo-1627993077309-847249b6ce4d?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1627993077309-847249b6ce4d?w=800"],
                category_id=cat_gastronomia.id, organizer_id=user2.id
            ),
            Event(
                title="Feria de la Empanada",
                description="Cazón, dominó, pabellón y más. Ven a probar empanadas de todos los rincones del país.",
                start_time=(now + timedelta(days=5)
                            ).replace(hour=8, minute=0).isoformat(),
                end_time="14:00",
                price=0.00,
                capacity=800,
                status="active",
                location_name="Mercado de Chacao",
                address="Chacao, Miranda",
                latitude=10.4966, longitude=-66.8523,
                image_url="https://images.unsplash.com/photo-1626082895617-2c6fd0f90382?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1626082895617-2c6fd0f90382?w=800"],
                category_id=cat_gastronomia.id, organizer_id=user1.id
            ),
            Event(
                title="Oktoberfest Caracas 2026",
                description="Música alemana, salchichas, pretzels y muchísima cerveza artesanal nacional.",
                start_time=(now + timedelta(days=45)
                            ).replace(hour=16, minute=0).isoformat(),
                end_time="02:00",
                price=20.00,
                capacity=1500,
                status="active",
                location_name="Club Ítalo Venezolano",
                address="Prados del Este, Caracas",
                latitude=10.4485, longitude=-66.8617,
                image_url="https://images.unsplash.com/photo-1532635241-17e820acc59f?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1532635241-17e820acc59f?w=800"],
                category_id=cat_gastronomia.id, organizer_id=user2.id
            ),
            Event(
                title="Taller: Pizzas Artesanales",
                description="Aprende a hacer masa madre y prepara tu propia pizza en leña.",
                start_time=(now + timedelta(days=25)
                            ).replace(hour=10, minute=0).isoformat(),
                end_time="13:30",
                price=40.00,
                capacity=20,
                status="active",
                location_name="Bottega Caracas",
                address="Los Palos Grandes, Caracas",
                latitude=10.4985, longitude=-66.8407,
                image_url="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800"],
                category_id=cat_gastronomia.id, organizer_id=user1.id
            ),
            Event(
                title="Cena a Ciegas",
                description="Experimenta una cena de 4 tiempos con los ojos vendados. Potencia tus sentidos.",
                start_time=(now + timedelta(days=16)
                            ).replace(hour=20, minute=0).isoformat(),
                end_time="23:00",
                price=65.00,
                capacity=40,
                status="active",
                location_name="Alto Restaurante",
                address="Los Palos Grandes, Caracas",
                latitude=10.4975, longitude=-66.8422,
                image_url="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"],
                category_id=cat_gastronomia.id, organizer_id=user2.id
            ),

            # ----------------------------------------------------
            # TECNOLOGÍA (NUEVA CATEGORÍA)
            # ----------------------------------------------------
            Event(
                title="Caracas Tech Summit 2026",
                description="La conferencia tecnológica más importante del país. Charlas sobre Inteligencia Artificial, desarrollo de software y futuro digital.",
                start_time=(now + timedelta(days=21)
                            ).replace(hour=9, minute=0).isoformat(),
                end_time="18:00",
                price=50.00,
                capacity=800,
                status="active",
                location_name="Hotel Eurobuilding",
                address="Chuao, Caracas, Miranda",
                latitude=10.4764, longitude=-66.8453,
                image_url="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"],
                category_id=cat_tecnologia.id, organizer_id=user1.id
            ),
            Event(
                title="Hackathon: Soluciones Web3",
                description="Competencia de programación de 48 horas continuas. Crea la mejor DApp y gana premios increíbles.",
                start_time=(now + timedelta(days=35)
                            ).replace(hour=18, minute=0).isoformat(),
                end_time="18:00",
                price=0.00,  # Gratis previa selección
                capacity=150,
                status="active",
                location_name="Torre Digitel",
                address="La Castellana, Caracas",
                latitude=10.4975, longitude=-66.8521,
                image_url="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800"],
                category_id=cat_tecnologia.id, organizer_id=user2.id
            ),
            Event(
                title="Meetup: Startups y Networking",
                description="Encuentro mensual de emprendedores tecnológicos, desarrolladores e inversores.",
                start_time=(now + timedelta(days=12)
                            ).replace(hour=18, minute=30).isoformat(),
                end_time="21:30",
                price=10.00,
                capacity=100,
                status="active",
                location_name="Impact Hub Caracas",
                address="Torre Parque Ávila, Los Palos Grandes",
                latitude=10.4950, longitude=-66.8435,
                image_url="https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800"],
                category_id=cat_tecnologia.id, organizer_id=user1.id
            ),
            Event(
                title="Expo Gaming & Esports",
                description="Torneos de videojuegos, exhibición de hardware de última generación, cosplay y más.",
                start_time=(now + timedelta(days=50)
                            ).replace(hour=10, minute=0).isoformat(),
                end_time="20:00",
                price=20.00,
                capacity=5000,
                status="active",
                location_name="CIEC Universidad Metropolitana",
                address="Terrazas del Ávila, Caracas",
                latitude=10.4988, longitude=-66.8122,
                image_url="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"],
                category_id=cat_tecnologia.id, organizer_id=user2.id
            ),
            Event(
                title="Bootcamp: Introducción a React",
                description="Taller intensivo para aprender a crear interfaces modernas con la librería más demandada.",
                start_time=(now + timedelta(days=18)
                            ).replace(hour=9, minute=0).isoformat(),
                end_time="16:00",
                price=30.00,
                capacity=40,
                status="active",
                location_name="Espacios UCAB",
                address="Montalbán, Caracas",
                latitude=10.4642, longitude=-66.9758,
                image_url="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"],
                category_id=cat_tecnologia.id, organizer_id=user1.id
            ),
            Event(
                title="Masterclass: Ciberseguridad",
                description="Aprende cómo proteger tus datos personales y corporativos de ataques informáticos.",
                start_time=(now + timedelta(days=26)
                            ).replace(hour=14, minute=0).isoformat(),
                end_time="17:00",
                price=0.00,
                capacity=120,
                status="active",
                location_name="Auditorio UCV",
                address="Ciudad Universitaria, Caracas",
                latitude=10.4880, longitude=-66.8906,
                image_url="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
                imgs_event=[
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800"],
                category_id=cat_tecnologia.id, organizer_id=user2.id
            )
        ]

        # Guardar todos los eventos en bloque
        db.session.add_all(eventos)
        db.session.commit()

        print("¡Listo! 5 Categorías, 2 Usuarios y 30 Eventos creados con éxito. 🚀")
