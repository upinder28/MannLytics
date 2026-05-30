def calculate_risk(analysis):
    score = 0

    # Emotion weight
    if analysis["emotion"] == "sadness":
        score += 15
    elif analysis["emotion"] == "anxiety":
        score += 20
    elif analysis["emotion"] == "anger":
        score += 15
    elif analysis["emotion"] == "stress":
        score += 15
    elif analysis["emotion"] == "neutral":
        score += 5

    # Sentiment intensity weight
    sentiment_weight = abs(analysis["sentiment_score"]) * 25
    score += sentiment_weight

    # Cognitive distortions
    score += len(analysis["cognitive_distortions"]) * 15

    # Behavioral signals
    score += len(analysis["behavioral_signals"]) * 20

    return round(min(score, 100), 2)