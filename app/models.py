from sqlalchemy import Column, Integer, String, Float, ForeignKey
from .database import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    tipo = Column(String(50))
    precio = Column(Float)
    stock = Column(Integer)
    descripcion = Column(String(255))

class Venta(Base):
    __tablename__ = "ventas"

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"))
    cliente = Column(String(100))
    cantidad = Column(Integer)
    total_pagado = Column(Float)
    fecha = Column(String(50))

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), unique=True, index=True, nullable=False)
    password_hashed = Column(String(255), nullable=False)