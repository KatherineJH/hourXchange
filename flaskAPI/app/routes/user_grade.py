from flask import Blueprint, request, jsonify
from app.models.user_grade_model import predict_user_grade

user_grade_bp = Blueprint("user_grade", __name__)

@user_grade_bp.route("/predict", methods=["POST"])
def predict():
    try:
        user_input = request.get_json()
        if not user_input:
            return jsonify({"error": "입력 데이터가 없습니다."}), 400

        result = predict_user_grade(user_input)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
