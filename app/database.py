from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Usamos SQLite por ahora para Floany Visión (luego pasamos a MySQL)
SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/floany_vision.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ESTA ES LA LÍNEA QUE TE ESTÁ DANDO EL ERROR:
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()