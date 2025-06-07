import joblib
import numpy as np
import pandas as pd
from datetime import datetime

MODEL_PATH = "user_grade_model.pkl"
model = joblib.load(MODEL_PATH)

# region 인코딩
REGION_MAP = {"서울": 0, "인천": 1, "경남": 2, "부산": 3, "대구": 4, "울산": 5, "광주": 6, "전남":7,
              "전북":8, "대전":9, "강원":10, "제주":11, "기타":12}

# feature 순서 맞춰야 함
FEATURE_ORDER = [
    "transaction_count", "payment_count", "total_payment_amount", "total_visit_count",
    "successful_buyer_post_count", "successful_seller_post_count",
    "avg_review_score_given", "avg_review_score_received", "review_count_received",
    "days_since_last_activity", "days_since_signup", "region_code"
]

DEFAULT_VALUES = {
    "transaction_count": 0,
    "payment_count": 0,
    "total_payment_amount": 0.0,
    "total_visit_count": 0,
    "successful_buyer_post_count": 0,
    "successful_seller_post_count": 0,
    "avg_review_score_given": 3.0,
    "avg_review_score_received": 3.0,
    "review_count_received": 0,
    "days_since_last_activity": 365,
    "days_since_signup": 999,
    "region_code": 6  # 기타
}

def preprocess_input(user_input: dict):
    # region_code
    region = user_input.get("region")
    if region:
        user_input["region_code"] = REGION_MAP.get(region, 6)
    else:
        user_input["region_code"] = DEFAULT_VALUES["region_code"]

    # days_since_signup
    if "signup_date" in user_input:
        try:
            signup_date = datetime.strptime(user_input["signup_date"], "%Y-%m-%d")
            days = (datetime.now() - signup_date).days
            user_input["days_since_signup"] = days
        except Exception:
            user_input["days_since_signup"] = DEFAULT_VALUES["days_since_signup"]
    else:
        user_input["days_since_signup"] = DEFAULT_VALUES["days_since_signup"]

    # 나머지 누락된 필드 보완
    full_input = {f: user_input.get(f, DEFAULT_VALUES[f]) for f in FEATURE_ORDER}

    # DataFrame으로 반환
    return pd.DataFrame([full_input])


def predict_user_grade(user_input: dict) -> dict:
    processed = preprocess_input(user_input)
    grade = int(model.predict(processed)[0])
    return {"grade": grade}
