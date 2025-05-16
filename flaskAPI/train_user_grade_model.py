import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.tree import DecisionTreeClassifier
import joblib

# 1. 랜덤 시드 및 샘플 개수
np.random.seed(42)
n = 50000
today = datetime(2025, 5, 16)

# 2. 가짜 가입일 및 지역 생성
signup_dates = [today - timedelta(days=np.random.randint(0, 1000)) for _ in range(n)]
regions = np.random.choice(["서울", "강원", "경기", "충청", "전라", "경상", "제주"], size=n)
REGION_MAP = {"서울": 0, "강원": 1, "경기": 2, "충청": 3, "전라": 4, "경상": 5, "제주": 6}

# 3. 데이터프레임 생성
data = pd.DataFrame({
    "transaction_count": np.random.randint(0, 100, size=n),
    "payment_count": np.random.randint(0, 50, size=n),
    "total_payment_amount": np.random.uniform(1000, 1000000, size=n),
    "total_visit_count": np.random.randint(10, 1000, size=n),
    "successful_buyer_post_count": np.random.randint(0, 20, size=n),
    "successful_seller_post_count": np.random.randint(0, 20, size=n),
    "avg_review_score_given": np.random.uniform(1.0, 5.0, size=n),
    "avg_review_score_received": np.random.uniform(1.0, 5.0, size=n),
    "review_count_received": np.random.randint(0, 100, size=n),
    "days_since_last_activity": np.random.randint(0, 365, size=n),
    "signup_date": signup_dates,
    "region": regions
})

# 4. 전처리: 가입일 -> days_since_signup, 지역 -> region_code
data["days_since_signup"] = [(today - d).days for d in data["signup_date"]]
data["region_code"] = data["region"].map(REGION_MAP)

# 5. 레이블 생성 함수 (규칙 기반)
# def classify(row):
#     if row["total_payment_amount"] > 800000 and row["avg_review_score_received"] > 4.5 and row["days_since_last_activity"] < 10:
#         return 2  # VIP
#     elif row["days_since_last_activity"] > 180:
#         return 0  # INACTIVE
#     else:
#         return 1  # ACTIVE    
def classify(row):
    if row["total_payment_amount"] > 900_000 and row["avg_review_score_received"] > 4.7 and row["transaction_count"] > 50:
        return 5  # VIP
    elif row["days_since_last_activity"] > 180 and row["total_payment_amount"] < 10_000:
        return 0  # 버려도 되는 고객
    elif row["days_since_last_activity"] > 180 and row["total_payment_amount"] >= 10_000:
        return 1  # 잠재 재활성
    elif row["days_since_signup"] < 30 and row["transaction_count"] > 10:
        return 3  # 잠재 VIP 신규
    elif row["days_since_signup"] < 30:
        return 2  # 일반 신규
    else:
        return 4  # 일반 유저


data["grade"] = data.apply(classify, axis=1)

# 6. 학습
X = data[[
    "transaction_count", "payment_count", "total_payment_amount", "total_visit_count",
    "successful_buyer_post_count", "successful_seller_post_count",
    "avg_review_score_given", "avg_review_score_received", "review_count_received",
    "days_since_last_activity", "days_since_signup", "region_code"
]]
y = data["grade"]

model = DecisionTreeClassifier(max_depth=10, random_state=42)
model.fit(X, y)

# 7. 저장
joblib.dump(model, "user_grade_model.pkl")
print("모델 저장 완료: user_grade_model.pkl")
