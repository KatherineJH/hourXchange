import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib
import os

# 지역 인코딩
REGION_MAP = {
    "서울": 0, "인천": 1, "경남": 2, "부산": 3, "대구": 4,
    "울산": 5, "광주": 6, "전남": 7, "전북": 8, "대전": 9,
    "강원": 10, "제주": 11, "기타": 12
}

feature_cols = [
    "age", "days_since_signup", "visit_count", "distinct_url_count",
    "payment_count", "total_payment_amount", "transaction_count",
    "review_count", "avg_stars_given", "region_code"
]

def load_and_preprocess_data():
    engine = create_engine("mysql+pymysql://root:root@localhost/db_hourxchange?charset=utf8mb4")

    query = """
    SELECT
        u.id AS user_id,
        TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) AS age,
        DATEDIFF(CURDATE(), u.createdAt) AS days_since_signup,
        COALESCE(v.visit_count, 0) AS visit_count,
        COALESCE(v.distinct_url_count, 0) AS distinct_url_count,
        COALESCE(p.payment_count, 0) AS payment_count,
        COALESCE(p.total_payment_amount, 0) AS total_payment_amount,
        COALESCE(d.donation_count, 0) AS donation_count,
        COALESCE(d.total_donation_amount, 0) AS total_donation_amount,
        COALESCE(t.transaction_count, 0) AS transaction_count,
        COALESCE(r.review_count, 0) AS review_count,
        COALESCE(r.avg_stars_given, 0) AS avg_stars_given,
        COALESCE(SUBSTRING(a.jibunAddress, 1, 2), '기타') AS region
    FROM user u
    LEFT JOIN address a ON u.id = a.user_id
    LEFT JOIN (
        SELECT userId, COUNT(*) AS visit_count, COUNT(DISTINCT url) AS distinct_url_count
        FROM visitlog WHERE userId IS NOT NULL GROUP BY userId
    ) v ON u.id = v.userId
    LEFT JOIN (
        SELECT userId, COUNT(*) AS payment_count, SUM(amount) AS total_payment_amount
        FROM payment WHERE status = 'paid' GROUP BY userId
    ) p ON u.id = p.userId
    LEFT JOIN (
        SELECT user_id, COUNT(*) AS donation_count, -SUM(amount) AS total_donation_amount
        FROM donationhistory GROUP BY user_id
    ) d ON u.id = d.user_id
    LEFT JOIN (
        SELECT user_id, COUNT(*) AS transaction_count
        FROM transaction WHERE status = 'COMPLETED' GROUP BY user_id
    ) t ON u.id = t.user_id
    LEFT JOIN (
        SELECT reviewer_id, COUNT(*) AS review_count, AVG(stars) AS avg_stars_given
        FROM review GROUP BY reviewer_id
    ) r ON u.id = r.reviewer_id;
    """

    df = pd.read_sql(query, engine)
    df["region_code"] = df["region"].map(REGION_MAP).fillna(REGION_MAP["기타"]).astype(int)
    print(f"데이터 로딩 완료: {len(df)}건")
    return df

def augment_data(df, target_size=1000):
    needed = target_size - len(df)
    if needed <= 0:
        return df

    repeated_df = pd.concat([df] * ((needed // len(df)) + 1), ignore_index=True)
    augmented_df = repeated_df.sample(n=needed, random_state=42).reset_index(drop=True)

    int_cols = [
        "age", "days_since_signup", "visit_count", "distinct_url_count",
        "payment_count", "total_payment_amount", "transaction_count",
        "review_count"
    ]

    for col in int_cols:
        noise = np.random.normal(0, 0.1, size=len(augmented_df))  # ±10% 노이즈
        augmented_df[col] = np.clip(
            (augmented_df[col] * (1 + noise)).round(), 0, None
        ).astype(int)

    augmented_df["avg_stars_given"] = np.clip(
        np.random.normal(augmented_df["avg_stars_given"], 0.3), 0, 5
    ).round(2)

    return pd.concat([df, augmented_df], ignore_index=True)

def train_model():
    df = load_and_preprocess_data()
    df = augment_data(df, target_size=1000)

    X = df[feature_cols]
    y = df["total_donation_amount"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = XGBRegressor()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print("\n [기부 금액 예측 회귀 모델 평가]")
    print(f"RMSE: {rmse:.2f}")
    print(f"MAE : {mae:.2f}")
    print(f"R²  : {r2:.4f}")

    joblib.dump(model, "reg_model.pkl")
    return model

# 전역 모델 로딩 (Flask import 시에도 실행됨)
try:
    reg_model = joblib.load("reg_model.pkl")
except:
    reg_model = train_model()

def predict_donation(user_input):
    input_data = user_input.copy()
    input_data["region_code"] = REGION_MAP.get(input_data["region"], REGION_MAP["기타"])
    input_df = pd.DataFrame([input_data], columns=feature_cols)
    predicted_amount = reg_model.predict(input_df)[0]
    return {
        "predicted_donation_amount": float(predicted_amount)
    }

def simulate_donation_increase(user_input, var_name, value_range):
    base_input = user_input.copy()
    results = []

    for val in value_range:
        modified_input = base_input.copy()
        modified_input[var_name] = val
        modified_input["region_code"] = REGION_MAP.get(modified_input["region"], REGION_MAP["기타"])
        input_df = pd.DataFrame([modified_input], columns=feature_cols)
        predicted = reg_model.predict(input_df)[0]
        results.append((val, float(predicted)))

    return results
