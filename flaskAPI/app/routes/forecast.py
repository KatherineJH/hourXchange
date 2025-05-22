from flask import Blueprint, request, jsonify
from app.models.forecast_model import predict_sales

forecast_bp = Blueprint("forecast", __name__)

@forecast_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "history" not in data:
        return jsonify({"error": "history (list of {'ds': date, 'y': value}) 가 필요합니다."}), 400

    try:
        # Get optional 'periods' from request, default to 7
        periods = int(data.get("periods", 7))
        forecast = predict_sales(data["history"], periods)
        return jsonify(forecast)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
