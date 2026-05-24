"""
FLOANY VISIÓN Y SALUD — API BACKEND v2.0
FastAPI + SQLAlchemy + JWT
"""

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import jwt

from . import models, schemas, database

# ─────────────────────────────────────────
# INICIALIZACIÓN
# ─────────────────────────────────────────
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Floany Visión — API Comercial",
    description="Sistema de ventas, inventario y autenticación para Floany Visión y Salud.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "FloanyVision_JWT_Key_2026_Secure"
ALGORITHM  = "HS256"


# ─────────────────────────────────────────
# ESQUEMAS AUTH LOCALES
# ─────────────────────────────────────────
class UserRegister(BaseModel):
    nombre:   str
    correo:   EmailStr
    password: str

class UserLogin(BaseModel):
    correo:   EmailStr
    password: str


# ─────────────────────────────────────────
# HELPER: DECODIFICAR TOKEN
# ─────────────────────────────────────────
def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado. Por favor inicia sesión nuevamente.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido.")


# ─────────────────────────────────────────
# RUTA RAÍZ
# ─────────────────────────────────────────
@app.get("/", tags=["Estado"])
def health_check():
    return {
        "status":  "ok",
        "sistema": "Floany Visión API v2.0",
        "fecha":   datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }


# ─────────────────────────────────────────
# AUTENTICACIÓN
# ─────────────────────────────────────────
@app.post("/auth/register", tags=["Autenticación"])
def registrar_usuario(user: UserRegister, db: Session = Depends(database.get_db)):
    """Registra un nuevo usuario en el sistema."""
    existe = db.query(models.Usuario).filter(models.Usuario.correo == user.correo).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado.",
        )

    nuevo = models.Usuario(
        nombre           = user.nombre.strip(),
        correo           = user.correo.lower(),
        password_hashed  = pwd_context.hash(user.password),
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {"status": "ok", "message": f"Cuenta creada para {nuevo.nombre}."}


@app.post("/auth/login", tags=["Autenticación"])
def login_usuario(user: UserLogin, db: Session = Depends(database.get_db)):
    """Autentica al usuario y devuelve un token JWT."""
    db_user = db.query(models.Usuario).filter(models.Usuario.correo == user.correo.lower()).first()

    if not db_user or not pwd_context.verify(user.password, db_user.password_hashed):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos.",
        )

    payload = {
        "user_id": db_user.id,
        "nombre":  db_user.nombre,
        "exp":     datetime.utcnow() + timedelta(hours=24),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"token": token, "nombre": db_user.nombre, "user_id": db_user.id}


# ─────────────────────────────────────────
# INVENTARIO — PRODUCTOS
# ─────────────────────────────────────────
@app.get("/productos", response_model=List[schemas.Producto], tags=["Inventario"])
def listar_productos(
    tipo:     Optional[str] = Query(None, description="Filtrar por tipo: 'Gafas de Sol' o 'Lentes de Medida'"),
    busqueda: Optional[str] = Query(None, description="Búsqueda por nombre o descripción"),
    db: Session = Depends(database.get_db),
):
    """Lista todos los productos, con filtros opcionales."""
    query = db.query(models.Producto)
    if tipo:
        query = query.filter(models.Producto.tipo == tipo)
    if busqueda:
        like = f"%{busqueda}%"
        query = query.filter(
            models.Producto.nombre.ilike(like) | models.Producto.descripcion.ilike(like)
        )
    return query.all()


@app.get("/productos/{producto_id}", response_model=schemas.Producto, tags=["Inventario"])
def obtener_producto(producto_id: int, db: Session = Depends(database.get_db)):
    """Obtiene un producto por su ID."""
    p = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")
    return p


@app.post("/productos", response_model=schemas.Producto, tags=["Inventario"])
def crear_producto(producto: schemas.ProductoBase, db: Session = Depends(database.get_db)):
    """Crea un nuevo producto en el catálogo."""
    nuevo = models.Producto(**producto.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.put("/productos/{producto_id}", response_model=schemas.Producto, tags=["Inventario"])
def actualizar_producto(
    producto_id: int,
    datos: schemas.ProductoBase,
    db: Session = Depends(database.get_db),
):
    """Actualiza un producto existente (precio, stock, descripción, etc.)."""
    p = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")
    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(p, campo, valor)
    db.commit()
    db.refresh(p)
    return p


@app.delete("/productos/{producto_id}", tags=["Inventario"])
def eliminar_producto(producto_id: int, db: Session = Depends(database.get_db)):
    """Elimina un producto del catálogo."""
    p = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")
    db.delete(p)
    db.commit()
    return {"status": "ok", "message": f"Producto '{p.nombre}' eliminado."}


# ─────────────────────────────────────────
# VENTAS
# ─────────────────────────────────────────
@app.post("/ventas", response_model=schemas.Venta, tags=["Ventas"])
def realizar_venta(venta: schemas.VentaCreate, db: Session = Depends(database.get_db)):
    """
    Procesa una venta:
    1. Verifica que el producto exista y tenga stock suficiente.
    2. Calcula el total.
    3. Deduce el stock.
    4. Registra la venta en historial.
    """
    p = db.query(models.Producto).filter(models.Producto.id == venta.producto_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Producto no existe en catálogo.")
    if p.stock < venta.cantidad:
        raise HTTPException(
            status_code=400,
            detail=f"Stock insuficiente. Disponible: {p.stock} unidad(es).",
        )

    total   = round(p.precio * venta.cantidad, 2)
    p.stock -= venta.cantidad

    nueva_venta = models.Venta(
        producto_id  = venta.producto_id,
        cliente      = venta.cliente,
        cantidad     = venta.cantidad,
        total_pagado = total,
        fecha        = datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    )
    db.add(nueva_venta)
    db.commit()
    db.refresh(nueva_venta)
    return nueva_venta


@app.get("/ventas", response_model=List[schemas.Venta], tags=["Ventas"])
def listar_ventas(db: Session = Depends(database.get_db)):
    """Lista el historial completo de ventas."""
    return db.query(models.Venta).order_by(models.Venta.id.desc()).all()


# ─────────────────────────────────────────
# DASHBOARD / ESTADÍSTICAS
# ─────────────────────────────────────────
@app.get("/dashboard/stats", tags=["Dashboard"])
def estadisticas(db: Session = Depends(database.get_db)):
    """Devuelve estadísticas generales para un posible panel admin."""
    total_productos = db.query(models.Producto).count()
    total_ventas    = db.query(models.Venta).count()
    total_usuarios  = db.query(models.Usuario).count()

    # Ingresos totales
    ventas = db.query(models.Venta).all()
    ingresos = sum(v.total_pagado for v in ventas)

    # Productos con stock bajo (≤ 2)
    stock_bajo = db.query(models.Producto).filter(models.Producto.stock <= 2).all()

    return {
        "total_productos": total_productos,
        "total_ventas":    total_ventas,
        "total_usuarios":  total_usuarios,
        "ingresos_totales": round(ingresos, 2),
        "productos_stock_bajo": [{"id": p.id, "nombre": p.nombre, "stock": p.stock} for p in stock_bajo],
    }