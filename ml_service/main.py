# from fastapi import FastAPI
# from pydantic import BaseModel

# app = FastAPI()

# class TextRequest(BaseModel):
#     text: str

# @app.post("/analyze")
# async def analyze(data: TextRequest):
    
#     text = data.text

#     # Dummy ML logic (for testing)
#     risk_score = 75 if "sad" in text.lower() else 20

#     return {
#         "emotion": "sad" if risk_score > 50 else "neutral",
#         "riskScore": risk_score
#     }






# from fastapi import FastAPI
# from pydantic import BaseModel
# import joblib

# from text_analysis import analyze_text
# from risk_score import calculate_risk

# app = FastAPI()

# model = joblib.load("mental_health_model_fast.joblib")

# class TextRequest(BaseModel):
#     text: str

# @app.post("/analyze")
# async def analyze(data: TextRequest):
#     text = data.text.strip()

#     if not text:
#         return {
#             "emotion": "neutral",
#             "predicted_label": "Normal",
#             "confidence": 0.0,
#             "sentiment_score": 0.0,
#             "cognitive_distortions": [],
#             "behavioral_signals": [],
#             "riskScore": 0
#         }

#     vader_result = analyze_text(text)

#     predicted_label = model.predict([text])[0]

#     probabilities = model.predict_proba([text])[0]
#     confidence = float(max(probabilities))

#     risk_score = calculate_risk(vader_result)

#     return {
#         "emotion": vader_result["emotion"],
#         "predicted_label": predicted_label,
#         "confidence": round(confidence, 4),
#         "sentiment_score": vader_result["sentiment_score"],
#         "cognitive_distortions": vader_result["cognitive_distortions"],
#         "behavioral_signals": vader_result["behavioral_signals"],
#         "riskScore": risk_score
#     }

# from fastapi import FastAPI
# from pydantic import BaseModel
# import joblib

# from text_analysis import analyze_text
# from risk_score import calculate_risk

# # ✅ IMPORT CLEAN FUNCTION (VERY IMPORTANT)
# from train_model import clean_text

# app = FastAPI()

# # ✅ Load trained pipeline (TF-IDF + Logistic Regression)
# model = joblib.load("mental_health_model.joblib")


# class TextRequest(BaseModel):
#     text: str


# @app.post("/analyze")
# async def analyze(data: TextRequest):
#     text = data.text.strip()

#     # ✅ Handle empty input
#     if not text:
#         return {
#             "emotion": "neutral",
#             "predicted_label": "Normal",
#             "confidence": 0.0,
#             "sentiment_score": 0.0,
#             "cognitive_distortions": [],
#             "behavioral_signals": [],
#             "riskScore": 0
#         }

#     # 🔥 STEP 1: CLEAN TEXT (FIXED ISSUE)
#     cleaned_text = clean_text(text)

#     # 🔥 STEP 2: VADER + RULE-BASED ANALYSIS
#     vader_result = analyze_text(text)

#     # 🔥 STEP 3: ML PREDICTION (USING CLEANED TEXT)
#     predicted_label = model.predict([cleaned_text])[0]

#     probabilities = model.predict_proba([cleaned_text])[0]
#     confidence = float(max(probabilities))

#     # 🔥 STEP 4: RISK SCORE
#     risk_score = calculate_risk(vader_result)

#     # 🔥 FINAL RESPONSE (MATCHES DASHBOARD ✅)
#     return {
#         "emotion": vader_result["emotion"],
#         "predicted_label": predicted_label,
#         "confidence": round(confidence, 4),
#         "sentiment_score": vader_result["sentiment_score"],
#         "cognitive_distortions": vader_result["cognitive_distortions"],
#         "behavioral_signals": vader_result["behavioral_signals"],
#         "riskScore": risk_score
#     }




def get_suggestions(emotion, predicted_label, risk_score, score):
    emotion = emotion.lower()

    if emotion in ["happiness", "joy"]:
        if score >= 8:
            return ["You're thriving! Share this energy with someone you love today.", "This is a great time to set a new goal or start something exciting.", "Celebrate this moment — you deserve to feel this good."]
        if score >= 6:
            return ["You're doing well — keep nurturing what's making you feel good.", "A short walk or some music can keep this positive energy going.", "Write down one thing you're grateful for today."]
        return ["You're in a decent mood — build on it with something you enjoy.", "Reach out to a friend and share how you're feeling.", "Do one small thing today that makes you smile."]

    if emotion in ["sad", "sadness"]:
        if predicted_label == "Suicidal" or risk_score >= 70:
            return ["Please reach out to someone close to you right now.", "You matter — consider calling a mental health helpline today.", "Take it one minute at a time. You don't have to do this alone."]
        if predicted_label == "Depression" or risk_score >= 50:
            return ["You don't have to face this alone — talk to someone you trust.", "Small steps matter — even getting up and drinking water counts.", "Consider reaching out to a friend or family member today."]
        return ["It's okay to feel low sometimes. Be gentle with yourself today.", "Try listening to your favorite song or stepping outside briefly.", "Write down what's on your mind — it helps to let it out."]

    if emotion == "anxiety":
        if risk_score >= 70:
            return ["Your anxiety seems intense — please talk to someone you trust.", "Try grounding yourself: name 5 things you can see around you.", "Step away from all screens and sit quietly for a few minutes."]
        if risk_score >= 45:
            return ["Try a 4-4-4 breathing exercise for one minute.", "Focus only on the next small task in front of you.", "Drink water and step away from the screen briefly."]
        return ["Take a slow deep breath — you're safe right now.", "Write down what's worrying you to get it out of your head.", "A short walk outside can help calm a restless mind."]

    if emotion == "stress":
        if risk_score >= 70:
            return ["You're carrying a lot right now — it's okay to ask for help.", "Step away completely for 15 minutes — no phone, no work.", "Talk to someone about what's overwhelming you today."]
        if risk_score >= 45:
            return ["Take a short break and relax your shoulders.", "Break your work into one small manageable step at a time.", "Avoid multitasking — focus on just one thing right now."]
        return ["Take a 5-minute break away from your screen.", "A short stretch or deep breath can reset your focus.", "You're handling it — just take it one step at a time."]

    if emotion in ["anger", "angry"]:
        if risk_score >= 70:
            return ["Your frustration seems very intense — please step away before reacting.", "Talk to someone you trust about what's upsetting you.", "Consider speaking to a counselor if this feeling persists."]
        if risk_score >= 45:
            return ["Pause before reacting and take a slow breath.", "Step away from the triggering situation for a few minutes.", "Write down what upset you before responding to anyone."]
        return ["Take a moment to cool down before making any decisions.", "A short walk can help release built-up tension.", "Try to identify what triggered this feeling and address it calmly."]

    if score >= 7:
        return ["Your mood looks stable — keep up your current routine.", "This is a good time to reflect on what's working well for you.", "Stay consistent with the habits that are keeping you balanced."]
    if score >= 4:
        return ["Keep tracking your mood daily for better insights.", "Take a small pause and notice how your body feels right now.", "Try a short relaxing activity like music or a brief walk."]
    return ["Write a few more lines next time for a clearer analysis.", "Consider rest and self-care today.", "Talking to someone you trust can always help."]


    # yashika code


from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

from text_analysis import analyze_text
from risk_score import calculate_risk
from train_model import clean_text, MAX_LEN

app = FastAPI()

_saved = joblib.load("mental_health_model.joblib")
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
_tokenizer = AutoTokenizer.from_pretrained(_saved["model_path"])
_model = AutoModelForSequenceClassification.from_pretrained(_saved["model_path"]).to(_device)
_model.eval()
_id2label = {int(k): v for k, v in _saved["id2label"].items()}


def _predict(cleaned_text: str):
    enc = _tokenizer(
        cleaned_text,
        max_length=MAX_LEN,
        padding="max_length",
        truncation=True,
        return_tensors="pt",
    )
    enc = {k: v.to(_device) for k, v in enc.items()}
    with torch.no_grad():
        logits = _model(**enc).logits[0]
    probs = torch.softmax(logits, dim=0).cpu().numpy()
    label = _id2label[int(probs.argmax())]
    return label, float(probs.max())


class TextRequest(BaseModel):
    text: str


@app.post("/analyze")
async def analyze(data: TextRequest):
    text = data.text.strip()

    # ✅ Handle empty input
    if not text:
        return {
            "emotion": "neutral",
            "predicted_label": "Normal",
            "confidence": 0.0,
            "sentiment_score": 0.0,
            "cognitive_distortions": [],
            "behavioral_signals": [],
            "riskScore": 0
        }

    # 🔥 STEP 1: CLEAN TEXT (FIXED ISSUE)
    cleaned_text = clean_text(text)

    # 🔥 STEP 2: VADER + RULE-BASED ANALYSIS
    vader_result = analyze_text(text)

    # 🔥 STEP 3: ML PREDICTION
    predicted_label, confidence = _predict(cleaned_text)

    # 🔥 STEP 4: RISK SCORE
    risk_score = calculate_risk(vader_result)

    # 🔥 STEP 5: SUGGESTIONS
    score = min(10, max(1, round(risk_score / 10)))
    suggestions = get_suggestions(vader_result["emotion"], predicted_label, risk_score, score)

    # 🔥 FINAL RESPONSE (MATCHES DASHBOARD ✅)
    return {
        "emotion": vader_result["emotion"],
        "predicted_label": predicted_label,
        "confidence": round(confidence, 4),
        "sentiment_score": vader_result["sentiment_score"],
        "cognitive_distortions": vader_result["cognitive_distortions"],
        "behavioral_signals": vader_result["behavioral_signals"],
        "riskScore": risk_score,
        "suggestions": suggestions
    }