# import pandas as pd
# from sqlalchemy import create_engine

# # SQLAlchemy 엔진 생성
# engine = create_engine("mysql+pymysql://root:root@localhost/db_hourxchange?charset=utf8mb4")

# # 쿼리 실행
# query = """
# SELECT
#     dh.id AS history_id,
#     dh.amount,
#     dh.createdAt AS donated_at,
#     dh.user_id AS donor_user_id,
#     d.id AS donation_id,
#     d.title,
#     d.purpose,
#     d.targetAmount,
#     d.user_id AS fundraiser_user_id
# FROM donationhistory dh
# JOIN donation d ON dh.donation_id = d.id;
# """

# # DataFrame으로 로드
# df = pd.read_sql(query, con=engine)

# print("SQLAlchemy로 DataFrame 로딩 성공")
# print(df.head())

import pandas as pd
import numpy as np
from datetime import datetime
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import OneHotEncoder

# 1. SQLAlchemy 엔진 설정
engine = create_engine("mysql+pymysql://root:root@localhost/db_hourxchange?charset=utf8mb4")

# 2. SQL 데이터 조회
query = """
SELECT
  dh.id AS history_id,
  dh.amount,
  dh.createdAt AS donated_at,
  dh.user_id AS donor_user_id,
  d.id AS donation_id,
  d.title,
  d.purpose,
  d.targetAmount,
  d.user_id AS fundraiser_user_id
FROM donationhistory dh
JOIN donation d ON dh.donation_id = d.id;
"""

df = pd.read_sql(query, engine)
print("SQLAlchemy로 DataFrame 로딩 성공")
print(df.head())

# 3. 날짜 파생 변수 생성
df['donated_at'] = pd.to_datetime(df['donated_at'])
df['year'] = df['donated_at'].dt.year
df['month'] = df['donated_at'].dt.month
df['day'] = df['donated_at'].dt.day
df['hour'] = df['donated_at'].dt.hour
df['day_of_week'] = df['donated_at'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

# 4. 불필요한 컬럼 제거
df = df.drop(columns=['history_id', 'donated_at', 'title', 'purpose'])

# 5. 범주형 컬럼 원핫인코딩
categorical_cols = ['donation_id', 'donor_user_id', 'fundraiser_user_id']
encoder = OneHotEncoder(sparse_output=False, drop='first')
encoded_cats = encoder.fit_transform(df[categorical_cols])
encoded_df = pd.DataFrame(encoded_cats, columns=encoder.get_feature_names_out(categorical_cols))

# 6. 수치형 컬럼과 결합
numeric_cols = ['targetAmount', 'year', 'month', 'day', 'hour', 'day_of_week', 'is_weekend']
X = pd.concat([df[numeric_cols].reset_index(drop=True), encoded_df.reset_index(drop=True)], axis=1)
y = df['amount']

# 7. 학습/테스트 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 8. 모델 학습
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 9. 평가
y_pred = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"RMSE: {rmse:.2f}")

# 10. 중요 변수 출력
importance_df = pd.DataFrame({
    "feature": X.columns,
    "importance": model.feature_importances_
}).sort_values(by="importance", ascending=False)
print("\nFeature Importance:")
print(importance_df.head(10))

# 11. 예측 예시
example_input = X.iloc[0:1]  # 첫 번째 샘플 복제
example_pred = model.predict(example_input)
print(f"\n 예측 예시 (id={df.iloc[0]['donor_user_id']}): 예상 기부 금액 = {example_pred[0]:.2f}")
