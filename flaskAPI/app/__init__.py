from flask import Flask

def create_app():
    app = Flask(__name__)

    from app.routes.sentiment import sentiment_bp
    from app.routes.forecast import forecast_bp
    from app.routes.user_grade import user_grade_bp
    from app.routes.predict_donation import donation_bp
    
    app.register_blueprint(sentiment_bp, url_prefix="/sentiment")
    app.register_blueprint(forecast_bp, url_prefix="/forecast")
    app.register_blueprint(user_grade_bp, url_prefix="/user-grade") 
    app.register_blueprint(donation_bp, url_prefix="/donation") 

    return app