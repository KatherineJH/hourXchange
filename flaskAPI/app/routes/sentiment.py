from flask import Blueprint, request, jsonify
from app.models.sentiment_model import predict_sentiment
from app.utils.text_processing import extract_nouns

sentiment_bp = Blueprint("sentiment", __name__)

@sentiment_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "텍스트가 필요합니다."}), 400

    text = data["text"]
    sentiment = predict_sentiment(text)
    tags = extract_nouns(text) if sentiment["result"] == "긍정 😊" else []

    return jsonify({
        "text": text,
        "sentiment": sentiment,
        "tags": tags
    })
