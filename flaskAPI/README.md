# 설치 안내

1. 모델 파일 다운로드

- [공유 링크](https://drive.google.com/file/d/1-7ZkqtBX1llIPKGabpQRbIVEyUmFhook/view?usp=sharing)에서 `kc_electra_sentiment_model.pt` 다운로드
- 프로젝트의 `flaskAPI/` 폴더 안에 넣어주세요.

2. 가상환경 및 라이브러리 설치
   $ cd hourXchange\flaskAPI
   $ python -m venv venv (처음에만)
   $ venv\Scripts\activate (Windows)
   $ pip install -r requirements.txt

3. Flask 실행
   $ python main.py
