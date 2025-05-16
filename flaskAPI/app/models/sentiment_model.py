import os
import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoModel, AutoTokenizer

class KcELECTRAClassifier(nn.Module):
    def __init__(self, num_classes=2):
        super(KcELECTRAClassifier, self).__init__()
        self.bert = AutoModel.from_pretrained("beomi/KcELECTRA-base")
        self.classifier = nn.Linear(self.bert.config.hidden_size, num_classes)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled = outputs.last_hidden_state[:, 0]
        return self.classifier(pooled)

# 모델 및 토크나이저 초기화
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../kc_electra_sentiment_model.pt")

model = KcELECTRAClassifier(num_classes=2).to(DEVICE)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.eval()

tokenizer = AutoTokenizer.from_pretrained("beomi/KcELECTRA-base")

def predict_sentiment(text):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding="max_length",
        max_length=64
    )
    inputs = {k: v.to(DEVICE) for k, v in inputs.items() if k != "token_type_ids"}

    with torch.no_grad():
        output = model(**inputs)
        probs = F.softmax(output, dim=1).cpu().numpy()[0]
        pred = torch.argmax(output, dim=1).item()

    return {
        "result": "긍정 😊" if pred == 1 else "부정 😡",
        "positive_prob": round(float(probs[1]), 4),
        "negative_prob": round(float(probs[0]), 4)
    }
