import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "lotduel-dev-key-change-in-prod")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Frontend URL for CORS
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # MarketCheck API
    MARKETCHECK_API_KEY = os.getenv("MARKETCHECK_API_KEY", "")


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(os.path.dirname(__file__), "lotduel_dev.db"),
    )


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")  # PostgreSQL on VPS


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
}
