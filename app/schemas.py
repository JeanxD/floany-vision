"""
FLOANY VISIÓN — ESQUEMAS PYDANTIC v2.0
Validación y serialización de datos para la API.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional


# ─────────────────────────────────────────
# PRODUCTOS
# ─────────────────────────────────────────
class ProductoBase(BaseModel):
    nombre:      str       = Field(..., min_length=2, max_length=100,  description="Nombre del producto")
    tipo:        str       = Field(...,                                 description="'Gafas de Sol' o 'Lentes de Medida'")
    precio:      float     = Field(..., gt=0,                          description="Precio en soles (mayor a 0)")
    stock:       int       = Field(..., ge=0,                          description="Unidades disponibles")
    descripcion: Optional[str] = Field(None, max_length=500,          description="Descripción del producto")
    imagen:      Optional[str] = Field(None,                           description="URL o ruta de la imagen")

    @field_validator('tipo')
    @classmethod
    def validar_tipo(cls, v: str) -> str:
        permitidos = {'Gafas de Sol', 'Lentes de Medida'}
        if v not in permitidos:
            raise ValueError(f"El tipo debe ser uno de: {', '.join(permitidos)}")
        return v

    @field_validator('precio')
    @classmethod
    def validar_precio(cls, v: float) -> float:
        return round(v, 2)


class Producto(ProductoBase):
    id: int

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# VENTAS
# ─────────────────────────────────────────
class VentaCreate(BaseModel):
    producto_id: int  = Field(..., gt=0,        description="ID del producto vendido")
    cliente:     str  = Field(..., min_length=2, description="Nombre del cliente")
    cantidad:    int  = Field(..., gt=0,         description="Cantidad comprada (mínimo 1)")


class Venta(VentaCreate):
    id:           int
    total_pagado: float
    fecha:        str

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# USUARIOS
# ─────────────────────────────────────────
class UsuarioPublico(BaseModel):
    id:     int
    nombre: str
    correo: str

    class Config:
        from_attributes = True