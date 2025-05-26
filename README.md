# HourXchange 프로젝트

HourXChange는 지역 기반의 재능 및 서비스 교환 플랫폼으로, 사용자가 자신의 재능을 나누고 타임 크레딧을 획득해 기부나 봉사활동에 참여할 수 있도록 설계된 공유 경제 서비스입니다. 게시판, 실시간 채팅 기반 거래, 마이페이지 관리 등 핵심 기능을 포함하며, Elasticsearch 기반 검색 고도화와 Redis 캐싱, 머신러닝 기반 감성 분석·유저 등급 예측·시계열 예측 기능을 통해 사용자 경험과 운영 효율을 높였습니다. 또한, 1365 자원봉사·Dialogflow 챗봇·Kakao 지도 등의 외부 API를 연동하여 서비스 활용 범위를 확장했습니다.

## 1. 프론트엔드 도메인
- [hourxchange.kr](http://hourxchange.kr)  
  서비스의 도메인 주소입니다.  
- [hourxchange.vercel.app](https://hourxchange.vercel.app/)
  프론트엔드 애플리케이션이 임시 배포된 메인 도메인입니다.

## 2. 개발환경 및 도구

### 🖥️ 프론트엔드
- **언어/프레임워크**: JavaScript (React.js)
- **스타일/설계**: React Router, Axios, TailwindCSS
- **테스트 및 배포**: AWS (S3 + CloudFront), Postman (API 테스트)
- **이미지 업로드**: Cloudinary (클라이언트 측 직접 업로드)

### 🛠️ 백엔드
- **프레임워크**: Java Spring Boot
- **ORM**: JPA (Hibernate)
- **보안/인증**: Spring Security, JWT, OAuth2 (Google, Naver, GitHub)
- **API 문서화**: Postman Collection 기반 테스트 문서화

### 📦 데이터베이스 및 저장소
- **관계형 DB**: MySQL (AWS RDS)
- **캐시 저장소**: Redis (AWS ElastiCache)
- **검색 엔진**: Elasticsearch (Docker 기반)

### 🤖 머신러닝 분석 서버 (Flask)
- **프레임워크**: Python Flask
- **ML 모델**: PyTorch, XGBoost, scikit-learn 기반 모델
- **기능**: 감성 분석, 시계열 예측, 사용자 등급 분류

### ☁️ 클라우드 인프라 (AWS)
- **서버 인스턴스**: EC2 (Spring Boot, Flask, Elasticsearch 서버)
- **정적 리소스 호스팅**: S3 (React 빌드 파일), CloudFront (HTTPS 처리)
- **도메인 및 인증**: Route 53 + ACM + CloudFront
- **네트워크**: VPC, 퍼블릭/프라이빗 서브넷 분리, IAM Role

### 🔁 CI/CD & 버전 관리
- **버전 관리**: Git + GitHub
- **CI/CD 자동 배포**: GitHub Actions → EC2
- **컨테이너화**: Docker (Flask, Elasticsearch 용)  

## 3. 구글 공유 드라이브
https://drive.google.com/drive/u/0/folders/11gI0NbzLTuVygEr2RX6w0GkclGCzjogE
