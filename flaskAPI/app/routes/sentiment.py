from flask import Blueprint, request, jsonify
from app.models.sentiment_model import predict_sentiment
from konlpy.tag import Okt
from collections import Counter
from sentence_transformers import SentenceTransformer, util

sentiment_bp = Blueprint("sentiment", __name__)
okt = Okt()
model = SentenceTransformer("snunlp/KR-SBERT-V40K-klueNLI-augSTS")

def normalize_adjective(word, tag):
    """형용사/동사를 명사 형태로 변환"""
    if tag == "Noun":
        return word
    elif tag in ["Adjective", "Verb"]:
        # 어간 추출
        stemmed = okt.morphs(word, stem=True)[0]
        # 기본 명사화: "음" 또는 "함" 추가
        if stemmed.endswith("하"):  # 예: 깨끗하다 → 깨끗함
            return stemmed + "함"
        return stemmed + "음"  # 예: 좋다 → 좋음
    return word

def extract_positive_tags(text, top_k=5, threshold=0.3):
    from konlpy.tag import Okt
    from collections import Counter
    from sentence_transformers import SentenceTransformer, util
    import torch
    import re

    okt = Okt()
    model = SentenceTransformer("snunlp/KR-SBERT-V40K-klueNLI-augSTS")

    def normalize_adjective(word: str) -> str:
        word = re.sub(r"(하고|하며|하면서|하구요|하십니다)$", "", word)
        word = re.sub(r"(한|했던|하던|스러운|스럽다)$", "", word)
        word = re.sub(r"(았어요|었어요|했어요|네요|했네요|해요|했습니다|해봤어요)$", "음", word)
        return word

    # 형태소 분석: 명사/형용사 중심 + 2글자 이상
    pos_tags = okt.pos(text, stem=False)
    raw_words = [
        normalize_adjective(word) if tag == "Adjective" else word
        for word, tag in pos_tags
        if tag in {"Noun", "Adjective"} and len(word) > 1
    ]

    # 빈도 계산
    word_freq = Counter(raw_words)
    candidates = list(word_freq.keys())

    if not candidates:
        return []

    # 벡터 생성
    sentence_embedding = model.encode(text, convert_to_tensor=True)
    noun_embeddings = model.encode(candidates, convert_to_tensor=True)
    scores = util.cos_sim(sentence_embedding, noun_embeddings)[0]

    # ✅ 너무 유사하거나 너무 일반적인 단어는 제거
    filtered = []
    for word, score in zip(candidates, scores):
        s = float(score)
        # 너무 높은 점수 (문맥 내 추상 일반 단어), 너무 낮은 점수 (관련 없음) → 제외
        if threshold <= s <= 0.85:
            filtered.append((word, s, word_freq[word]))

    # 정렬: 유사도 + 빈도 기준
    filtered.sort(key=lambda x: (x[1], x[2]), reverse=True)

    return [word for word, _, _ in filtered[:top_k]]

@sentiment_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "텍스트가 필요합니다."}), 400

    text = data["text"]
    sentiment = predict_sentiment(text)
    tags = extract_positive_tags(text) if sentiment["result"] == "긍정 😊" else []

    return jsonify({
        "text": text,
        "sentiment": sentiment,
        "tags": tags
    })
