"""
LotDuel Backend API
Flask application factory.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from config import config


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # CORS — allow frontend origin
    CORS(
        app,
        origins=[
            app.config["FRONTEND_URL"],
            "https://lotduel.com",
            "https://www.lotduel.com",
            "https://lotduel-app.vercel.app",
            "http://localhost:5173",
            "http://localhost:4173",
        ],
        supports_credentials=True,
    )

    # Database
    db.init_app(app)
    Migrate(app, db)

    # Register blueprints
    from routes.buyer import buyer_bp
    from routes.dealer import dealer_bp
    from routes.admin import admin_bp

    app.register_blueprint(buyer_bp)
    app.register_blueprint(dealer_bp)
    app.register_blueprint(admin_bp)

    # Health check
    @app.route("/api/health")
    def health():
        return jsonify({
            "status": "ok",
            "service": "lotduel-api",
            "version": "2.0.0",
        })

    # Create tables in dev mode
    with app.app_context():
        db.create_all()

    return app


# Dev server entry point
if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
