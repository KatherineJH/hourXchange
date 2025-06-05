# import pandas as pd
# import numpy as np
# from datetime import datetime
# from sqlalchemy import create_engine
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestRegressor
# from sklearn.metrics import mean_squared_error
# from sklearn.preprocessing import OneHotEncoder

# # 1. SQLAlchemy 엔진 설정
# engine = create_engine("mysql+pymysql://root:root@localhost/db_hourxchange?charset=utf8mb4")

# # 2. SQL 데이터 조회
# query = """
# SELECT
#   dh.id AS history_id,
#   dh.amount,
#   dh.createdAt AS donated_at,
#   dh.user_id AS donor_user_id,
#   d.id AS donation_id,
#   d.title,
#   d.purpose,
#   d.targetAmount,
#   d.user_id AS fundraiser_user_id
# FROM donationhistory dh
# JOIN donation d ON dh.donation_id = d.id;
# """

# df = pd.read_sql(query, engine)
# print("SQLAlchemy로 DataFrame 로딩 성공")
# print(df.head())

# # 3. 날짜 파생 변수 생성
# df['donated_at'] = pd.to_datetime(df['donated_at'])
# df['year'] = df['donated_at'].dt.year
# df['month'] = df['donated_at'].dt.month
# df['day'] = df['donated_at'].dt.day
# df['hour'] = df['donated_at'].dt.hour
# df['day_of_week'] = df['donated_at'].dt.dayofweek
# df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

# # 4. 불필요한 컬럼 제거
# df = df.drop(columns=['history_id', 'donated_at', 'title', 'purpose'])

# # 5. 범주형 컬럼 원핫인코딩
# categorical_cols = ['donation_id', 'donor_user_id', 'fundraiser_user_id']
# encoder = OneHotEncoder(sparse_output=False, drop='first')
# encoded_cats = encoder.fit_transform(df[categorical_cols])
# encoded_df = pd.DataFrame(encoded_cats, columns=encoder.get_feature_names_out(categorical_cols))

# # 6. 수치형 컬럼과 결합
# numeric_cols = ['targetAmount', 'year', 'month', 'day', 'hour', 'day_of_week', 'is_weekend']
# X = pd.concat([df[numeric_cols].reset_index(drop=True), encoded_df.reset_index(drop=True)], axis=1)
# y = df['amount']

# # 7. 학습/테스트 분할
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # 8. 모델 학습
# model = RandomForestRegressor(n_estimators=100, random_state=42)
# model.fit(X_train, y_train)

# # 9. 평가
# y_pred = model.predict(X_test)
# rmse = np.sqrt(mean_squared_error(y_test, y_pred))
# print(f"RMSE: {rmse:.2f}")

# # 10. 중요 변수 출력
# importance_df = pd.DataFrame({
#     "feature": X.columns,
#     "importance": model.feature_importances_
# }).sort_values(by="importance", ascending=False)
# print("\nFeature Importance:")
# print(importance_df.head(10))

# # 11. 예측 예시
# example_input = X.iloc[0:1]  # 첫 번째 샘플 복제
# example_pred = model.predict(example_input)
# print(f"\n 예측 예시 (id={df.iloc[0]['donor_user_id']}): 예상 기부 금액 = {example_pred[0]:.2f}")


import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBClassifier, XGBRegressor
from sklearn.metrics import mean_squared_error
import joblib
import os

def load_and_preprocess_data():
    print("데이터 로드 및 전처리 시작...")
    try:
        engine = create_engine("mysql+pymysql://root:root@localhost/db_hourxchange?charset=utf8mb4")

        query = """
        SELECT
            u.id AS user_id,
            u.username,
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
            COALESCE(r.avg_stars_given, 0) AS avg_stars_given
        FROM user u
        LEFT JOIN (
            SELECT userId, 
                   COUNT(*) AS visit_count,
                   COUNT(DISTINCT url) AS distinct_url_count
            FROM visitlog
            WHERE userId IS NOT NULL
            GROUP BY userId
        ) v ON u.id = v.userId
        LEFT JOIN (
            SELECT userId,
                   COUNT(*) AS payment_count,
                   SUM(amount) AS total_payment_amount
            FROM payment
            WHERE status = 'paid'
            GROUP BY userId
        ) p ON u.id = p.userId
        LEFT JOIN (
            SELECT user_id,
                   COUNT(*) AS donation_count,
                   SUM(amount) AS total_donation_amount
            FROM donationhistory
            WHERE amount > 0
            GROUP BY user_id
        ) d ON u.id = d.user_id
        LEFT JOIN (
            SELECT user_id,
                   COUNT(*) AS transaction_count
            FROM transaction
            WHERE status = 'COMPLETED'
            GROUP BY user_id
        ) t ON u.id = t.user_id
        LEFT JOIN (
            SELECT reviewer_id,
                   COUNT(*) AS review_count,
                   AVG(stars) AS avg_stars_given
            FROM review
            GROUP BY reviewer_id
        ) r ON u.id = r.reviewer_id;
        """

        df = pd.read_sql(query, engine)
        print(f"데이터 로드 완료: {len(df)}개의 레코드")

        df['total_donation_amount'] = df['total_donation_amount'].abs()

        # 기부 이력 없는 경우 20명 임의 추가
        if df["donation_count"].value_counts().get(0, 0) == len(df):
            print("기부 이력이 없는 데이터입니다. 20명에게 임의로 기부 이력 추가...")
            df.loc[:19, "donation_count"] = 1
            df.loc[:19, "total_donation_amount"] = [1000 + i * 50 for i in range(20)]

        # 데이터 증강 (100명 → 1000명)
        original_df = df.copy()
        original_size = len(original_df)
        target_size = 1000
        needed = target_size - original_size
        repeat_times = (needed // original_size) + 1

        augmented_df = pd.concat([original_df] * repeat_times, ignore_index=True)
        augmented_df = augmented_df.sample(n=needed, random_state=42).reset_index(drop=True)

        int_cols = [
            'days_since_signup', 'age', 'visit_count', 'distinct_url_count', 'payment_count',
            'total_payment_amount', 'donation_count', 'total_donation_amount',
            'transaction_count', 'review_count'
        ]

        def add_safe_noise(col, values):
            min_val = df[col].min()
            max_val = df[col].max()
            noisy = values * (1 + np.random.uniform(-0.05, 0.05, size=len(values)))
            return np.clip(np.round(noisy), min_val, max_val).astype(int)

        for col in int_cols:
            augmented_df[col] = add_safe_noise(col, augmented_df[col])

        augmented_df['avg_stars_given'] = np.round(np.random.uniform(0, 5, size=len(augmented_df)), 2)
        start_id = df['user_id'].max() + 1
        augmented_df['user_id'] = np.arange(start_id, start_id + len(augmented_df))

        expanded_df = pd.concat([df, augmented_df], ignore_index=True)
        expanded_df["is_future_donor"] = (expanded_df["donation_count"] > 0).astype(int)

        print(f"데이터 증강 완료: 원래 {original_size} → 확장 {len(expanded_df)}")
        return expanded_df
    except Exception as e:
        print(f"데이터 로드/전처리 중 오류: {str(e)}")
        raise

def train_models():
    try:
        df = load_and_preprocess_data()
        feature_cols = [
            "age", "days_since_signup", "visit_count", "distinct_url_count",
            "payment_count", "total_payment_amount", "transaction_count",
            "review_count", "avg_stars_given"
        ]

        print("기부 여부 분류 모델 학습 시작...")
        X_clf = df[feature_cols]
        y_clf = df["is_future_donor"]
        X_train_clf, X_test_clf, y_train_clf, y_test_clf = train_test_split(X_clf, y_clf, test_size=0.2, random_state=42)

        clf = XGBClassifier()
        clf.fit(X_train_clf, y_train_clf)

        from sklearn.metrics import classification_report
        y_pred_clf = clf.predict(X_test_clf)
        print("\n기부 여부 분류 모델 평가:")
        print(classification_report(y_test_clf, y_pred_clf))

        # 루트 경로에 저장
        joblib.dump(clf, "clf_model.pkl")
        print("분류 모델 저장 완료: clf_model.pkl")

        print("기부 금액 회귀 모델 학습 시작...")
        donors_df = df[df["donation_count"] > 0].copy()
        X_reg = donors_df[feature_cols]
        y_reg = donors_df["total_donation_amount"]
        X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(X_reg, y_reg, test_size=0.2, random_state=42)

        reg = XGBRegressor()
        reg.fit(X_train_reg, y_train_reg)

        y_pred_reg = reg.predict(X_test_reg)
        rmse = np.sqrt(mean_squared_error(y_test_reg, y_pred_reg))
        print(f"\n회귀 모델 RMSE: {rmse:.2f}")

        # 루트 경로에 저장
        joblib.dump(reg, "reg_model.pkl")
        print("회귀 모델 저장 완료: reg_model.pkl")

        return clf, reg, feature_cols
    except Exception as e:
        print(f"모델 학습 중 오류: {str(e)}")
        raise

def predict_donation(user_input):
    try:
        input_df = pd.DataFrame([user_input], columns=feature_cols)

        is_donor_pred = clf_model.predict(input_df)[0]
        donor_probability = clf_model.predict_proba(input_df)[0][1]

        result = {
            "is_future_donor": bool(is_donor_pred),
            "donor_probability": float(donor_probability)
        }

        if is_donor_pred:
            donation_amount = reg_model.predict(input_df)[0]
            result["predicted_donation_amount"] = float(donation_amount)
        else:
            result["predicted_donation_amount"] = 0.0

        print(f"예측 결과: {result}")
        return result
    except Exception as e:
        print(f"예측 중 오류: {str(e)}")
        raise ValueError(f"예측 중 오류 발생: {str(e)}")

# 모델 로드 또는 학습
try:
    if os.path.exists("clf_model.pkl") and os.path.exists("reg_model.pkl"):
        print("저장된 모델 로드...")
        clf_model = joblib.load("clf_model.pkl")
        reg_model = joblib.load("reg_model.pkl")
        feature_cols = [
            "age", "days_since_signup", "visit_count", "distinct_url_count",
            "payment_count", "total_payment_amount", "transaction_count",
            "review_count", "avg_stars_given"
        ]
    else:
        print("모델이 없으므로 새로 학습...")
        clf_model, reg_model, feature_cols = train_models()
except Exception as e:
    print(f"모델 초기화 중 오류: {str(e)}")
    raise

if __name__ == "__main__":
    test_input = {
        "age": 30,
        "days_since_signup": 100,
        "visit_count": 50,
        "distinct_url_count": 10,
        "payment_count": 5,
        "total_payment_amount": 5000,
        "transaction_count": 3,
        "review_count": 2,
        "avg_stars_given": 4.5
    }
    print("\n테스트 예측 실행...")
    result = predict_donation(test_input)
    print(f"테스트 예측 결과: {result}")
