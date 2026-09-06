from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, Boolean, Text, Float, ForeignKey, JSON, Float
from datetime import datetime
from typing import Optional, List
import uuid #

db = SQLAlchemy()

# -------------------------------------------------------------
# 1. TABLA USER (Actualizada)
# -------------------------------------------------------------
class User(db.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    lastname: Mapped[str] = mapped_column(String(100), nullable=False)
    
    # NUEVO: Campo para la foto de perfil directa
    avatar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    role: Mapped[Optional[str]] = mapped_column(String(50), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    email_verify: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relaciones
    events: Mapped[List["Event"]] = relationship(back_populates="organizer")
    favorite_events: Mapped[List["FavoriteEvent"]] = relationship(back_populates="user")
    # Relación con la nueva tabla de fotos
    media_images: Mapped[List["UserMedia"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "lastname": self.lastname,
            "avatar": self.avatar, # Incluido en el serialize
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# -------------------------------------------------------------
# 2. TABLA CATEGORY
# -------------------------------------------------------------
class Category(db.Model):
    __tablename__ = 'categories'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    icon: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relaciones
    events: Mapped[List["Event"]] = relationship(back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "icon": self.icon
        }


# -------------------------------------------------------------
# 3. TABLA EVENT (Esta es la que usa tu semilla)
# -------------------------------------------------------------
class Event(db.Model):
    __tablename__ = 'events'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    organizer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    start_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    end_time: Mapped[str] = mapped_column(String(50), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=True, default=0.0)
    capacity: Mapped[int] = mapped_column(Integer, nullable=True) 
    imgs_event: Mapped[list] = mapped_column(JSON, nullable=True)
    guests: Mapped[list] = mapped_column(JSON, nullable=True) 
    
    # Claves Foráneas
    organizer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relaciones
    organizer: Mapped["User"] = relationship(back_populates="events")
    category: Mapped["Category"] = relationship(back_populates="events")
    favorite_events: Mapped[List["FavoriteEvent"]] = relationship(back_populates="event")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "price": self.price,
            "capacity": self.capacity,
            "imgs_event": self.imgs_event,
            "description": self.description,
            "location_name": self.location_name,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time,
            "image_url": self.image_url,
            "status": self.status,
            "organizer_id": self.organizer_id,
            "category_id": self.category_id,
            "guests": self.guests
        }


# -------------------------------------------------------------
# 4. TABLA FAVORITE_EVENTS
# -------------------------------------------------------------
class FavoriteEvent(db.Model):
    __tablename__ = 'favorite_events'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relaciones
    user: Mapped["User"] = relationship(back_populates="favorite_events")
    event: Mapped["Event"] = relationship(back_populates="favorite_events")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "event": self.event.serialize() if self.event else None
        }

class Ticket(db.Model):
    __tablename__ = 'tickets'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable=False)
    
    # Esto generará un código único tipo "LV-A1B2C3" automáticamente
    reference: Mapped[str] = mapped_column(String(50), default=lambda: f"LV-{uuid.uuid4().hex[:6].upper()}")
    purchased_at: Mapped[DateTime] = mapped_column(DateTime, default=datetime.utcnow)
    ticket_type: Mapped[str] = mapped_column(String(50), default="General")

    # Relaciones
    user: Mapped["User"] = relationship("User", backref="tickets")
    event: Mapped["Event"] = relationship("Event", backref="tickets")
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

# -------------------------------------------------------------
# 5. TABLA USER_MEDIA (Para publicaciones o galería)
# -------------------------------------------------------------
class UserMedia(db.Model):
    __tablename__ = 'user_media'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relación con User
    user: Mapped["User"] = relationship(back_populates="media_images")

    def serialize(self):
        return {
            "id": self.id,
            "reference": self.reference,
            "purchased_at": self.purchased_at,
            "ticket_type": self.ticket_type,
            "event": self.event.serialize() if self.event else None
        }
    
            "image_url": self.image_url,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat()
        }
