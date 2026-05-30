


# import nltk
# import re
# from nltk.sentiment import SentimentIntensityAnalyzer

# nltk.download("vader_lexicon", quiet=True)

# sia = SentimentIntensityAnalyzer()

# def analyze_text(text):
#     sentiment = sia.polarity_scores(text)
#     compound_score = sentiment["compound"]

#     text_lower = text.lower()

#     # 🔥 Emotion detection (Hybrid: Keywords + VADER)
#     emotion = "neutral"

#     emotion_keywords = {
#         # ✅ Fear + Loneliness → Anxiety
#         "anxiety": [
#             "fear", "afraid", "scared", "terrified", "anxious", "nervous",
#             "worried", "fearful",
#             "alone", "lonely", "isolated", "left out"
#         ],
#         "anger": ["angry", "mad", "furious", "irritated", "annoyed"],
#         "sadness": ["sad", "depressed", "down", "hopeless", "crying"],
#         "happiness": ["happy", "joy", "excited", "great", "amazing", "good"],
#         "stress": ["stressed", "overwhelmed", "pressure", "burnout", "tired"]
#     }

#     # ✅ STRONG keyword matching (fix for fear issue)
#     for emo, keywords in emotion_keywords.items():
#         if any(kw in text_lower for kw in keywords):
#             emotion = emo
#             break

#     # ✅ VADER fallback (only if nothing matched)
#     if emotion == "neutral":
#         if compound_score <= -0.5:
#             emotion = "sadness"
#         elif compound_score >= 0.5:
#             emotion = "happiness"
#         else:
#             emotion = "neutral"

#     # 🧠 Cognitive Distortions
#     cognitive_distortions = []
#     distortion_keywords = {
#         "overthinking": ["always", "never", "what if", "overthink"],
#         "self-blame": ["my fault", "blame myself", "i am the reason"],
#         "catastrophizing": ["worst", "ruined everything", "nothing will work"]
#     }

#     for label, keywords in distortion_keywords.items():
#         if any(kw in text_lower for kw in keywords):
#             cognitive_distortions.append(label)

#     # 🧍 Behavioral Signals
#     behavioral_signals = []
#     behavior_keywords = {
#         "isolation": ["alone", "isolated", "no one around"],
#         "withdrawal": ["don't want to talk", "avoid people", "stay away"],
#         "low_energy": ["tired", "no energy", "exhausted"]
#     }

#     for label, keywords in behavior_keywords.items():
#         if any(kw in text_lower for kw in keywords):
#             behavioral_signals.append(label)

#     return {
#         "emotion": emotion,
#         "sentiment_score": compound_score,
#         "cognitive_distortions": cognitive_distortions,
#         "behavioral_signals": behavioral_signals,
#     }



# yashika code



import nltk
import re
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download("vader_lexicon", quiet=True)

sia = SentimentIntensityAnalyzer()

def analyze_text(text):
    sentiment = sia.polarity_scores(text)
    compound_score = sentiment["compound"]

    text_lower = text.lower()

    # 🔥 Emotion detection (Hybrid: Keywords + VADER)
    emotion = "neutral"

    emotion_keywords = {
        # ✅ Fear + Loneliness → Anxiety
        "anxiety": [
            "fear", "afraid", "scared", "terrified", "anxious", "nervous",
            "worried", "fearful",
            "alone", "lonely", "isolated", "left out"
        ],
        "anger": ["angry", "mad", "furious", "irritated", "annoyed"],
        "sadness": ["sad", "depressed", "down", "hopeless", "crying"],
        "happiness": ["happy", "joy", "excited", "great", "amazing", "good"],
        "stress": ["stressed", "overwhelmed", "pressure", "burnout", "tired"]
    }

    # ✅ STRONG keyword matching (fix for fear issue)
    for emo, keywords in emotion_keywords.items():
        if any(kw in text_lower for kw in keywords):
            emotion = emo
            break

    # ✅ VADER fallback (only if nothing matched)
    if emotion == "neutral":
        if compound_score <= -0.5:
            emotion = "sadness"
        elif compound_score >= 0.5:
            emotion = "happiness"
        else:
            emotion = "neutral"

    # 🧠 Cognitive Distortions
    cognitive_distortions = []
    distortion_keywords = {
        "overthinking": ["always", "never", "what if", "overthink"],
        "self-blame": ["my fault", "blame myself", "i am the reason"],
        "catastrophizing": ["worst", "ruined everything", "nothing will work"]
    }

    for label, keywords in distortion_keywords.items():
        if any(kw in text_lower for kw in keywords):
            cognitive_distortions.append(label)

    # 🧍 Behavioral Signals
    behavioral_signals = []
    behavior_keywords = {
        "isolation": ["alone", "isolated", "no one around"],
        "withdrawal": ["don't want to talk", "avoid people", "stay away"],
        "low_energy": ["tired", "no energy", "exhausted"]
    }

    for label, keywords in behavior_keywords.items():
        if any(kw in text_lower for kw in keywords):
            behavioral_signals.append(label)

    return {
        "emotion": emotion,
        "sentiment_score": compound_score,
        "cognitive_distortions": cognitive_distortions,
        "behavioral_signals": behavioral_signals,
    }