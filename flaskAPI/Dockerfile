# FROM python:3.9
# 
# WORKDIR /app
#
# COPY . /app
# RUN pip install --upgrade pip
# RUN pip install -r requirements.txt
# 
# CMD ["python", "main.py"]

FROM python:3.9-slim
WORKDIR /app

# 1) 의존성 설치 (캐시 활용)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2) 애플리케이션 코드 및 모델 복사
COPY . .

EXPOSE 5000
CMD ["python", "main.py"]
