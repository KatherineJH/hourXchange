# 유저 등급 분류 파이프라인
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import joblib

# ------------------------
# 1. 데이터 생성
# ------------------------
np.random.seed(42)
n = 50000
today = datetime.now()

signup_dates = [today - timedelta(days=np.random.randint(0, 1000)) for _ in range(n)]
regions = np.random.choice(
    ["서울", "인천", "경남", "부산", "대구", "울산", "광주", "전남", "전북", "대전", "강원", "제주", "기타"],
    size=n
)
REGION_MAP = {
    "서울": 0, "인천": 1, "경남": 2, "부산": 3, "대구": 4, "울산": 5,
    "광주": 6, "전남": 7, "전북": 8, "대전": 9, "강원": 10, "제주": 11, "기타":12
}

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
data["days_since_signup"] = [(today - d).days for d in data["signup_date"]]
data["region_code"] = data["region"].map(REGION_MAP)

# ------------------------
# 2. 라벨 생성
# ------------------------
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

# ------------------------
# 3. 학습 데이터 구성 및 분할
# ------------------------
FEATURES = [
    "transaction_count", "payment_count", "total_payment_amount", "total_visit_count",
    "successful_buyer_post_count", "successful_seller_post_count",
    "avg_review_score_given", "avg_review_score_received", "review_count_received",
    "days_since_last_activity", "days_since_signup", "region_code"
]

X = data[FEATURES]
y = data["grade"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ------------------------
# 4. 모델 학습 및 검증
# ------------------------
model = DecisionTreeClassifier(max_depth=10, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("검증 정확도:", accuracy_score(y_test, y_pred))
print("분류 리포트:\n", classification_report(y_test, y_pred))

# ------------------------
# 5. 교차 검증
# ------------------------
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print("5-Fold 교차 검증 정확도 평균:", np.mean(scores))

# ------------------------
# 6. GridSearch를 통한 튜닝
# ------------------------
param_grid = {
    'max_depth': [5, 10, 15],
    'min_samples_split': [2, 5, 10],
}
grid = GridSearchCV(DecisionTreeClassifier(random_state=42), param_grid, cv=3, scoring='accuracy')
grid.fit(X_train, y_train)

print("최적 하이퍼파라미터:", grid.best_params_)
print("최적 모델 검증 정확도:", accuracy_score(y_test, grid.best_estimator_.predict(X_test)))

# ------------------------
# 7. Confusion Matrix 시각화
# ------------------------
best_model = grid.best_estimator_
cm = confusion_matrix(y_test, best_model.predict(X_test))
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=np.unique(y))
disp.plot(cmap="Blues")
plt.title("Confusion Matrix")
plt.show()

# ------------------------
# 8. 모델 저장
# ------------------------
joblib.dump(best_model, "user_grade_model.pkl")
print("모델 저장 완료: user_grade_model.pkl")