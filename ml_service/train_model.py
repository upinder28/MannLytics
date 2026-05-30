# import os
# import re
# import warnings
# from pathlib import Path

# import joblib
# import pandas as pd
# from sklearn.exceptions import ConvergenceWarning
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.linear_model import LogisticRegression
# from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
# from sklearn.model_selection import train_test_split
# from sklearn.pipeline import Pipeline

# BASE_DIR = Path(__file__).resolve().parent

# # ✅ UPDATED: Direct CSV path
# CSV_PATH = BASE_DIR / "Combined Data.csv"

# MODEL_PATH = BASE_DIR / "mental_health_model.joblib"
# LABELS_PATH = BASE_DIR / "mental_health_labels.joblib"
# MIN_SAMPLES_PER_LABEL = 2


# def clean_text(text: str) -> str:
#     text = str(text).lower().strip()
#     text = re.sub(r"http\S+|www\.\S+", " ", text)
#     text = re.sub(r"[^a-zA-Z0-9\s'!?]", " ", text)
#     text = re.sub(r"\s+", " ", text).strip()
#     return text


# def get_training_sample_size() -> int | None:
#     raw_value = os.getenv("TRAIN_SAMPLE_SIZE", "").strip()
#     if not raw_value:
#         return None

#     sample_size = int(raw_value)
#     if sample_size <= 0:
#         raise ValueError("TRAIN_SAMPLE_SIZE must be greater than 0.")
#     return sample_size


# def format_top_predictions(model: Pipeline, cleaned_text: str, limit: int = 3) -> str:
#     if not hasattr(model, "predict_proba"):
#         return "Top predictions are unavailable for this model."

#     probabilities = model.predict_proba([cleaned_text])[0]
#     labels = model.classes_
#     top_indices = probabilities.argsort()[::-1][:limit]
#     return ", ".join(
#         f"{labels[index]} ({probabilities[index]:.2%})" for index in top_indices
#     )


# def main() -> None:
#     warnings.filterwarnings("ignore", category=ConvergenceWarning)

#     # ✅ Check CSV exists
#     if not CSV_PATH.exists():
#         raise FileNotFoundError(f"CSV file not found: {CSV_PATH}")

#     print("Loading dataset...")
#     df = pd.read_csv(CSV_PATH)

#     required_cols = {"statement", "status"}
#     missing = required_cols - set(df.columns)
#     if missing:
#         raise ValueError(f"Missing required columns: {missing}")

#     df = df[["statement", "status"]].copy()
#     df["statement"] = df["statement"].fillna("").astype(str)
#     df["status"] = df["status"].fillna("").astype(str)
#     df["statement"] = df["statement"].map(clean_text)

#     before = len(df)
#     df = df[(df["statement"] != "") & (df["status"] != "")]
#     print(f"Rows before cleaning: {before}")
#     print(f"Rows after cleaning:  {len(df)}")

#     label_counts = df["status"].value_counts()
#     rare_labels = label_counts[label_counts < MIN_SAMPLES_PER_LABEL].index.tolist()
#     if rare_labels:
#         print(
#             "\nDropping labels with too few examples:",
#             ", ".join(rare_labels),
#         )
#         df = df[~df["status"].isin(rare_labels)].copy()
#         label_counts = df["status"].value_counts()

#     print("\nLabel counts:")
#     print(label_counts)

#     sample_size = get_training_sample_size()
#     if sample_size is not None and sample_size < len(df):
#         print(f"\nUsing sampled subset: {sample_size} rows")
#         df = df.sample(sample_size, random_state=42).copy()
#     else:
#         print("\nUsing full dataset for training.")

#     x_train, x_test, y_train, y_test = train_test_split(
#         df["statement"],
#         df["status"],
#         test_size=0.2,
#         random_state=42,
#         stratify=df["status"],
#     )

#     model = Pipeline(
#         steps=[
#             (
#                 "tfidf",
#                 TfidfVectorizer(
#                     stop_words="english",
#                     ngram_range=(1, 2),
#                     min_df=2,
#                     max_features=50000,
#                     sublinear_tf=True,
#                 ),
#             ),
#             (
#                 "classifier",
#                 LogisticRegression(
#                     max_iter=1000,
#                     class_weight="balanced",
#                     solver="lbfgs",
#                 ),
#             ),
#         ]
#     )

#     print("\nTraining model...")
#     model.fit(x_train, y_train)

#     print("Evaluating model...")
#     y_pred = model.predict(x_test)
#     accuracy = accuracy_score(y_test, y_pred)

#     print(f"\nAccuracy: {accuracy:.4f}\n")
#     print("Classification report:")
#     print(classification_report(y_test, y_pred))

#     print("Confusion matrix:")
#     print(confusion_matrix(y_test, y_pred, labels=model.classes_))

#     print("Saving model files...")
#     joblib.dump(model, MODEL_PATH)
#     joblib.dump(sorted(df["status"].unique().tolist()), LABELS_PATH)

#     print(f"\nSaved model to: {MODEL_PATH}")
#     print(f"Saved labels to: {LABELS_PATH}")

#     sample_texts = [
#         "I feel empty and hopeless and I do not want to talk to anyone",
#         "I am nervous all the time and cannot sleep properly",
#         "Today was peaceful and I feel okay",
#     ]

#     print("\nSample predictions:")
#     for text in sample_texts:
#         cleaned_text = clean_text(text)
#         pred = model.predict([cleaned_text])[0]

#         if hasattr(model, "predict_proba"):
#             probs = model.predict_proba([cleaned_text])[0]
#             confidence = float(max(probs))
#             top_predictions = format_top_predictions(model, cleaned_text)
#             print(
#                 f"- {text}\n"
#                 f"  -> Predicted: {pred} ({confidence:.2%})\n"
#                 f"  -> Top matches: {top_predictions}"
#             )
#         else:
#             print(f"- {text}\n  -> {pred}")


# if __name__ == "__main__":
#     main()



# yashika code


import re
import zipfile
from pathlib import Path

import joblib
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "mental_health_model.joblib"
LABELS_PATH = BASE_DIR / "mental_health_labels.joblib"
ROBERTA_PATH = BASE_DIR / "roberta_model"
MAX_LEN = 128


def clean_text(text: str) -> str:
    text = str(text).lower().strip()
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"[^a-zA-Z0-9\s'!?]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def load_model():
    """Load the pretrained RoBERTa model from local path."""
    if not ROBERTA_PATH.exists():
        raise FileNotFoundError(
            f"RoBERTa model not found at: {ROBERTA_PATH}\n"
            "Please download from Colab and extract to ml_service/roberta_model/"
        )

    print(f"Loading model from {ROBERTA_PATH}...")
    tokenizer = AutoTokenizer.from_pretrained(str(ROBERTA_PATH))
    model = AutoModelForSequenceClassification.from_pretrained(str(ROBERTA_PATH))
    model.eval()

    id2label = model.config.id2label
    label2id = model.config.label2id

    # Save joblib file for main.py
    joblib.dump(
        {
            "type": "roberta",
            "model_path": str(ROBERTA_PATH),
            "label2id": label2id,
            "id2label": id2label,
        },
        MODEL_PATH,
    )
    joblib.dump(sorted(label2id.keys()), LABELS_PATH)

    print(f"Saved model info to: {MODEL_PATH}")
    print(f"Saved labels to: {LABELS_PATH}")
    print(f"Labels: {sorted(label2id.keys())}")

    return model, tokenizer, id2label


def predict(text: str, model, tokenizer, id2label, device):
    cleaned = clean_text(text)
    enc = tokenizer(
        cleaned,
        max_length=MAX_LEN,
        padding="max_length",
        truncation=True,
        return_tensors="pt",
    ).to(device)
    with torch.no_grad():
        logits = model(**enc).logits[0]
    probs = torch.softmax(logits, dim=0).cpu().numpy()
    top3 = probs.argsort()[::-1][:3]
    pred = id2label[int(probs.argmax())]
    conf = float(probs.max())
    top_str = ", ".join(f"{id2label[i]} ({probs[i]:.2%})" for i in top3)
    return pred, conf, top_str


def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    model, tokenizer, id2label = load_model()
    model = model.to(device)

    sample_texts = [
        "I feel empty and hopeless and I do not want to talk to anyone",
        "I am nervous all the time and cannot sleep properly",
        "Today was peaceful and I feel okay",
        "I cannot stop thinking about ending my life",
        "I feel so bipolar today, up and down all the time",
    ]

    print("\nSample predictions:")
    for text in sample_texts:
        pred, conf, top_str = predict(text, model, tokenizer, id2label, device)
        print(f"- {text}\n  -> Predicted: {pred} ({conf:.2%})\n  -> Top: {top_str}")


if __name__ == "__main__":
    main()