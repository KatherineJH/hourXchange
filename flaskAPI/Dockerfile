# FROM python:3.9
# 
# WORKDIR /app
#
# COPY . /app
# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt
# 
# CMD ["python", "main.py"]

# flaskAPI/Dockerfile
FROM python:3.9-slim

WORKDIR /app

# 1) 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2) 소스 복사
COPY . .

# 3) 모델 학습/덤프 (app/models/*.py 안에
#    if __name__ == "__main__": train & dump 코드가 있어야 합니다)
RUN python -m app.models.user_grade_model \
 && python -m app.models.sentiment_model \
 && python -m app.models.forecast_model

# 4) 포트 노출
EXPOSE 5000

# 5) 컨테이너 시작 시 API 기동
CMD ["python", "main.py"]

