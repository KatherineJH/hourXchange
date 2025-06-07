# import pandas as pd
# import numpy as np
# from sqlalchemy import create_engine
# from sklearn.model_selection import train_test_split
# from xgboost import XGBClassifier, XGBRegressor
# from sklearn.metrics import mean_squared_error, classification_report
# import joblib
# import os

# REGION_MAP = {
#     "서울": 0, "인천": 1, "경남": 2, "부산": 3,
#     "대구": 4, "울산": 5, "광주": 6, "전남": 7,
#     "전북": 8, "대전": 9, "강원": 10, "제주": 11,
#     "기타": 12
# }

# def load_and_preprocess_data():
#     print("데이터 로드 및 전처리 시작...")
#     try:
#         engine = create_engine("mysql+pymysql://root:root@localhost/db_hourxchange?charset=utf8mb4")

#         query = """SELECT
#             u.id AS user_id,
#             u.username,
#             TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) AS age,
#             DATEDIFF(CURDATE(), u.createdAt) AS days_since_signup,
#             COALESCE(v.visit_count, 0) AS visit_count,
#             COALESCE(v.distinct_url_count, 0) AS distinct_url_count,
#             COALESCE(p.payment_count, 0) AS payment_count,
#             COALESCE(p.total_payment_amount, 0) AS total_payment_amount,
#             COALESCE(d.donation_count, 0) AS donation_count,
#             COALESCE(d.total_donation_amount, 0) AS total_donation_amount,
#             COALESCE(t.transaction_count, 0) AS transaction_count,
#             COALESCE(r.review_count, 0) AS review_count,
#             COALESCE(r.avg_stars_given, 0) AS avg_stars_given,
#             COALESCE(SUBSTRING(a.jibunAddress, 1, 2), '기타') AS region
#         FROM user u
#         LEFT JOIN address a ON u.id = a.user_id
#         LEFT JOIN (
#             SELECT userId,
#                    COUNT(*) AS visit_count,
#                    COUNT(DISTINCT url) AS distinct_url_count
#             FROM visitlog
#             WHERE userId IS NOT NULL
#             GROUP BY userId
#         ) v ON u.id = v.userId
#         LEFT JOIN (
#             SELECT userId,
#                    COUNT(*) AS payment_count,
#                    SUM(amount) AS total_payment_amount
#             FROM payment
#             WHERE status = 'paid'
#             GROUP BY userId
#         ) p ON u.id = p.userId
#         LEFT JOIN (
#             SELECT user_id,
#                    COUNT(*) AS donation_count,
#                    -SUM(amount) AS total_donation_amount
#             FROM donationhistory
#             GROUP BY user_id
#         ) d ON u.id = d.user_id
#         LEFT JOIN (
#             SELECT user_id,
#                    COUNT(*) AS transaction_count
#             FROM transaction
#             WHERE status = 'COMPLETED'
#             GROUP BY user_id
#         ) t ON u.id = t.user_id
#         LEFT JOIN (
#             SELECT reviewer_id,
#                    COUNT(*) AS review_count,
#                    AVG(stars) AS avg_stars_given
#             FROM review
#             GROUP BY reviewer_id
#         ) r ON u.id = r.reviewer_id;"""

#         df = pd.read_sql(query, engine)
#         print(f"데이터 로드 완료: {len(df)}개의 레코드")

#         df["region_code"] = df["region"].map(REGION_MAP).fillna(REGION_MAP["기타"]).astype(int)

#         # 30% 비기부자 처리
#         num_rows = len(df)
#         non_donor_count = int(np.ceil(num_rows * 0.3))
#         existing_non_donors = df.index[df["donation_count"] == 0].tolist()
#         if len(existing_non_donors) < non_donor_count:
#             needed = non_donor_count - len(existing_non_donors)
#             candidates = df.index[df["donation_count"] > 0].tolist()
#             rnd_indices = np.random.choice(candidates, size=needed, replace=False)
#         else:
#             rnd_indices = np.random.choice(existing_non_donors, size=non_donor_count, replace=False)

#         for idx in rnd_indices:
#             df.at[idx, "donation_count"] = 0
#             df.at[idx, "total_donation_amount"] = 0
#             df.at[idx, "days_since_signup"] = np.random.randint(1, 31)
#             df.at[idx, "visit_count"] = 0
#             df.at[idx, "distinct_url_count"] = 0
#             df.at[idx, "payment_count"] = 0
#             df.at[idx, "total_payment_amount"] = 0
#             df.at[idx, "transaction_count"] = 0
#             df.at[idx, "review_count"] = 0
#             df.at[idx, "avg_stars_given"] = 3.0

#         df["is_future_donor"] = (df["donation_count"] > 0).astype(int)
#         print("★ ‘비협조적(non‐donor)’ 30% 반영 후 분포 ★")
#         print(df["is_future_donor"].value_counts(), "\n")

#         # 데이터 증강
#         original_df = df.copy()
#         original_size = len(original_df)
#         target_size = 1000
#         needed = target_size - original_size
#         repeat_times = (needed // original_size) + 1

#         augmented_df = pd.concat([original_df] * repeat_times, ignore_index=True)
#         augmented_df = augmented_df.sample(n=needed, random_state=42).reset_index(drop=True)

#         int_cols = [
#             "days_since_signup", "age", "visit_count", "distinct_url_count", "payment_count",
#             "total_payment_amount", "donation_count", "total_donation_amount",
#             "transaction_count", "review_count"
#         ]

#         def add_safe_noise(col, values):
#             min_val = df[col].min()
#             max_val = df[col].max()
#             noisy = values * (1 + np.random.uniform(-0.05, 0.05, size=len(values)))
#             return np.clip(np.round(noisy), min_val, max_val).astype(int)

#         for col in int_cols:
#             augmented_df[col] = add_safe_noise(col, augmented_df[col])

#         augmented_df["avg_stars_given"] = np.round(np.random.uniform(0, 5, size=len(augmented_df)), 2)
#         start_id = df["user_id"].max() + 1
#         augmented_df["user_id"] = np.arange(start_id, start_id + len(augmented_df))

#         expanded_df = pd.concat([df, augmented_df], ignore_index=True)
#         expanded_df["is_future_donor"] = (expanded_df["donation_count"] > 0).astype(int)

#         print(f"데이터 증강 완료: 원래 {original_size} → 확장 {len(expanded_df)}")
#         return expanded_df
#     except Exception as e:
#         print(f"데이터 로드/전처리 중 오류: {str(e)}")
#         raise

# def train_models():
#     try:
#         df = load_and_preprocess_data()
#         global feature_cols
#         feature_cols = [
#             "age", "days_since_signup", "visit_count", "distinct_url_count",
#             "payment_count", "total_payment_amount", "transaction_count",
#             "review_count", "avg_stars_given", "region_code"
#         ]

#         print("기부 여부 분류 모델 학습 시작...")
#         X_clf = df[feature_cols]
#         y_clf = df["is_future_donor"]
#         X_train_clf, X_test_clf, y_train_clf, y_test_clf = train_test_split(X_clf, y_clf, test_size=0.2, random_state=42)

#         clf = XGBClassifier()
#         clf.fit(X_train_clf, y_train_clf)

#         y_pred_clf = clf.predict(X_test_clf)
#         print("\n기부 여부 분류 모델 평가:")
#         print(classification_report(y_test_clf, y_pred_clf))

#         joblib.dump(clf, "clf_model.pkl")
#         print("분류 모델 저장 완료: clf_model.pkl")

#         print("기부 금액 회귀 모델 학습 시작...")
#         donors_df = df[df["donation_count"] > 0].copy()
#         X_reg = donors_df[feature_cols]
#         y_reg = donors_df["total_donation_amount"]
#         X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(X_reg, y_reg, test_size=0.2, random_state=42)

#         reg = XGBRegressor()
#         reg.fit(X_train_reg, y_train_reg)

#         y_pred_reg = reg.predict(X_test_reg)
#         rmse = np.sqrt(mean_squared_error(y_test_reg, y_pred_reg))
#         print(f"\n회귀 모델 RMSE: {rmse:.2f}")

#         joblib.dump(reg, "reg_model.pkl")
#         print("회귀 모델 저장 완료: reg_model.pkl")

#         return clf, reg, feature_cols
#     except Exception as e:
#         print(f"모델 학습 중 오류: {str(e)}")
#         raise

# def predict_donation(user_input):
#     try:
#         required_cols = [
#             "age", "days_since_signup", "visit_count", "distinct_url_count",
#             "payment_count", "total_payment_amount", "transaction_count",
#             "review_count", "avg_stars_given", "region"
#         ]
#         missing = [col for col in required_cols if col not in user_input]
#         if missing:
#             raise ValueError(f"입력 누락: {missing}")

#         input_data = user_input.copy()
#         input_data["region_code"] = REGION_MAP.get(input_data["region"], REGION_MAP["기타"])
#         input_df = pd.DataFrame([input_data], columns=feature_cols)

#         is_donor_pred = clf_model.predict(input_df)[0]
#         donor_probability = clf_model.predict_proba(input_df)[0][1]

#         result = {
#             "is_future_donor": bool(is_donor_pred),
#             "donor_probability": float(donor_probability)
#         }

#         if is_donor_pred:
#             result["predicted_donation_amount"] = float(reg_model.predict(input_df)[0])
#         else:
#             result["predicted_donation_amount"] = 0.0

#         print("예측 결과:", result)
#         return result
#     except Exception as e:
#         print(f"예측 중 오류: {str(e)}")
#         raise ValueError(f"예측 실패: {str(e)}")

# # 모델 로드 or 학습
# try:
#     if os.path.exists("clf_model.pkl") and os.path.exists("reg_model.pkl"):
#         print("저장된 모델 로드 중...")
#         clf_model = joblib.load("clf_model.pkl")
#         reg_model = joblib.load("reg_model.pkl")
#         feature_cols = [
#             "age", "days_since_signup", "visit_count", "distinct_url_count",
#             "payment_count", "total_payment_amount", "transaction_count",
#             "review_count", "avg_stars_given", "region_code"
#         ]
#     else:
#         print("모델이 없어 새로 학습합니다.")
#         clf_model, reg_model, feature_cols = train_models()
# except Exception as e:
#     print(f"모델 초기화 오류: {str(e)}")
#     raise

# if __name__ == "__main__":
#     test_input = {
#         "age": 30,
#         "days_since_signup": 100,
#         "visit_count": 50,
#         "distinct_url_count": 10,
#         "payment_count": 5,
#         "total_payment_amount": 5000,
#         "transaction_count": 3,
#         "review_count": 2,
#         "avg_stars_given": 4.5,
#         "region": "서울"
#     }
#     print("\n[테스트 예측]")
#     result = predict_donation(test_input)
#     print(result)

# import pandas as pd
# import numpy as np
# from sqlalchemy import create_engine
# from sklearn.model_selection import train_test_split
# from xgboost import XGBRegressor
# from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
# import joblib
# import os
# from app.models.user_grade_model import predict_user_grade

# # 지역 인코딩
# REGION_MAP = {
#     "서울": 0, "인천": 1, "경남": 2, "부산": 3, "대구": 4,
#     "울산": 5, "광주": 6, "전남": 7, "전북": 8, "대전": 9,
#     "강원": 10, "제주": 11, "기타": 12
# }

# def load_and_preprocess_data():
#     engine = create_engine("mysql+pymysql://root:root@localhost/db_hourxchange?charset=utf8mb4")

#     query = """
#     SELECT
#         u.id AS user_id,
#         TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) AS age,
#         DATEDIFF(CURDATE(), u.createdAt) AS days_since_signup,
#         COALESCE(v.visit_count, 0) AS visit_count,
#         COALESCE(v.distinct_url_count, 0) AS distinct_url_count,
#         COALESCE(p.payment_count, 0) AS payment_count,
#         COALESCE(p.total_payment_amount, 0) AS total_payment_amount,
#         COALESCE(d.donation_count, 0) AS donation_count,
#         COALESCE(d.total_donation_amount, 0) AS total_donation_amount,
#         COALESCE(t.transaction_count, 0) AS transaction_count,
#         COALESCE(r.review_count, 0) AS review_count,
#         COALESCE(r.avg_stars_given, 0) AS avg_stars_given,
#         COALESCE(SUBSTRING(a.jibunAddress, 1, 2), '기타') AS region
#     FROM user u
#     LEFT JOIN address a ON u.id = a.user_id
#     LEFT JOIN (
#         SELECT userId, COUNT(*) AS visit_count, COUNT(DISTINCT url) AS distinct_url_count
#         FROM visitlog WHERE userId IS NOT NULL GROUP BY userId
#     ) v ON u.id = v.userId
#     LEFT JOIN (
#         SELECT userId, COUNT(*) AS payment_count, SUM(amount) AS total_payment_amount
#         FROM payment WHERE status = 'paid' GROUP BY userId
#     ) p ON u.id = p.userId
#     LEFT JOIN (
#         SELECT user_id, COUNT(*) AS donation_count, -SUM(amount) AS total_donation_amount
#         FROM donationhistory GROUP BY user_id
#     ) d ON u.id = d.user_id
#     LEFT JOIN (
#         SELECT user_id, COUNT(*) AS transaction_count
#         FROM transaction WHERE status = 'COMPLETED' GROUP BY user_id
#     ) t ON u.id = t.user_id
#     LEFT JOIN (
#         SELECT reviewer_id, COUNT(*) AS review_count, AVG(stars) AS avg_stars_given
#         FROM review GROUP BY reviewer_id
#     ) r ON u.id = r.reviewer_id;
#     """

#     df = pd.read_sql(query, engine)
#     df["region_code"] = df["region"].map(REGION_MAP).fillna(REGION_MAP["기타"]).astype(int)
#     print(f"데이터 로딩 완료: {len(df)}건")
#     return df

# def augment_data(df, target_size=1000):
#     needed = target_size - len(df)
#     if needed <= 0:
#         return df

#     repeated_df = pd.concat([df] * ((needed // len(df)) + 1), ignore_index=True)
#     augmented_df = repeated_df.sample(n=needed, random_state=42).reset_index(drop=True)

#     int_cols = [
#         "age", "days_since_signup", "visit_count", "distinct_url_count",
#         "payment_count", "total_payment_amount", "transaction_count",
#         "review_count"
#     ]

#     for col in int_cols:
#         noise = np.random.normal(0, 0.1, size=len(augmented_df))  # ±10% 노이즈
#         augmented_df[col] = np.clip(
#             (augmented_df[col] * (1 + noise)).round(), 0, None
#         ).astype(int)

#     # 별점은 [0, 5] 범위 내에서 노이즈 추가
#     augmented_df["avg_stars_given"] = np.clip(
#         np.random.normal(augmented_df["avg_stars_given"], 0.3), 0, 5
#     ).round(2)

#     return pd.concat([df, augmented_df], ignore_index=True)

# def train_model():
#     df = load_and_preprocess_data()
#     df = augment_data(df, target_size=1000)  # 데이터 증강 추가

#     global feature_cols
#     feature_cols = [
#         "age", "days_since_signup", "visit_count", "distinct_url_count",
#         "payment_count", "total_payment_amount", "transaction_count",
#         "review_count", "avg_stars_given", "region_code"
#     ]

#     X = df[feature_cols]
#     y = df["total_donation_amount"]  # 이미 -SUM(amount) 처리로 양수임

#     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

#     model = XGBRegressor()
#     model.fit(X_train, y_train)
#     y_pred = model.predict(X_test)

#     # 성능 평가
#     rmse = np.sqrt(mean_squared_error(y_test, y_pred))
#     mae = mean_absolute_error(y_test, y_pred)
#     r2 = r2_score(y_test, y_pred)

#     print("\n [기부 금액 예측 회귀 모델 평가]")
#     print(f"RMSE: {rmse:.2f}")
#     print(f"MAE : {mae:.2f}")
#     print(f"R²  : {r2:.4f}")

#     joblib.dump(model, "reg_model.pkl")
#     return model, feature_cols

# def predict_donation(user_input):
#     input_data = user_input.copy()
#     input_data["region_code"] = REGION_MAP.get(input_data["region"], REGION_MAP["기타"])
#     input_df = pd.DataFrame([input_data], columns=feature_cols)

#     predicted_amount = reg_model.predict(input_df)[0]
#     return {
#         "predicted_donation_amount": float(predicted_amount)
#     }

# # 모델 로드 or 학습
# if os.path.exists("reg_model.pkl"):
#     reg_model = joblib.load("reg_model.pkl")
#     feature_cols = [
#         "age", "days_since_signup", "visit_count", "distinct_url_count",
#         "payment_count", "total_payment_amount", "transaction_count",
#         "review_count", "avg_stars_given", "region_code"
#     ]
# else:
#     reg_model, feature_cols = train_model()

# # 테스트 예측
# if __name__ == "__main__":
#     test_input = {
#         "age": 29,
#         "days_since_signup": 50,
#         "visit_count": 12,
#         "distinct_url_count": 7,
#         "payment_count": 4,
#         "total_payment_amount": 3200,
#         "transaction_count": 2,
#         "review_count": 1,
#         "avg_stars_given": 4.3,
#         "region": "경남"
#     }
#     print("\n [예측 결과]")
#     print(predict_donation(test_input))

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
