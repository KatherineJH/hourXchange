from flask import Blueprint, request, jsonify
from app.models.target_pred_model import predict_donation

donation_bp = Blueprint("donation", __name__)

@donation_bp.route("/predict", methods=["POST"])
def predict():
    try:
        user_input = request.get_json()
        if not user_input:
            return jsonify({"error": "입력 데이터가 없습니다."}), 400

        result = predict_donation(user_input)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500