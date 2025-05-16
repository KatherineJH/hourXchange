from flask import Flask

def create_app():
    app = Flask(__name__)

    from app.routes.sentiment import sentiment_bp
    from app.routes.forecast import forecast_bp
    
    app.register_blueprint(sentiment_bp, url_prefix="/sentiment")
    app.register_blueprint(forecast_bp, url_prefix="/forecast")

    return app