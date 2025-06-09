from flask import Blueprint, request, jsonify
from app.models.target_pred_model import predict_donation, simulate_donation_increase

donation_bp = Blueprint("donation", __name__)
@donation_bp.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "입력 데이터가 없습니다."}), 400
        simulate_flag = data.get("simulate", False)

        if simulate_flag:
            user_input = data.get("user_input")
            var_name = data.get("var_name")
            value_range = data.get("value_range")

            if not user_input or not var_name or not value_range:
                return jsonify({"error": "simulate 모드일 경우 user_input, var_name, value_range가 필요합니다."}), 400

            results = simulate_donation_increase(user_input, var_name, value_range)
            return jsonify({"simulated_results": [{"value": v, "predicted": p} for v, p in results]})

        else:
            result = predict_donation(data)
            return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500