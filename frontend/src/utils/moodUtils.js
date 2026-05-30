export const EMOTION_SCORE_MAP = {
  happiness: 9, joy: 9, neutral: 6, stress: 4, anxiety: 3, anger: 3, angry: 3, sad: 2, sadness: 2,
};

export const getSuggestions = (emotionKey, predictedLabel, riskScore, score) => {
  const risk = riskScore || 0;
  const label = predictedLabel || "Normal";

  if (["joy", "happiness"].includes(emotionKey)) {
    if (score >= 8) return ["You're thriving! Share this energy with someone you love today.", "This is a great time to set a new goal or start something exciting.", "Celebrate this moment — you deserve to feel this good."];
    if (score >= 6) return ["You're doing well — keep nurturing what's making you feel good.", "A short walk or some music can keep this positive energy going.", "Write down one thing you're grateful for today."];
    return ["You're in a decent mood — build on it with something you enjoy.", "Reach out to a friend and share how you're feeling.", "Do one small thing today that makes you smile."];
  }

  if (["sad", "sadness"].includes(emotionKey)) {
    if (label === "Suicidal" || risk >= 70) return ["Please reach out to someone close to you right now.", "You matter — consider calling a mental health helpline today.", "Take it one minute at a time. You don't have to do this alone."];
    if (label === "Depression" || risk >= 40) return ["You don't have to face this alone — talk to someone you trust.", "Small steps matter — even getting up and drinking water counts.", "Consider reaching out to a friend or family member today."];
    return ["It's okay to feel low sometimes. Be gentle with yourself today.", "Try listening to your favorite song or stepping outside briefly.", "Write down what's on your mind — it helps to let it out."];
  }

  if (emotionKey === "anxiety") {
    if (risk >= 70) return ["Your anxiety seems intense right now — please talk to someone you trust.", "Try grounding yourself: name 5 things you can see around you.", "Step away from all screens and sit quietly for a few minutes."];
    if (risk >= 40) return ["Try a 4-4-4 breathing exercise for one minute.", "Focus only on the next small task in front of you.", "Drink water and step away from the screen briefly."];
    return ["Take a slow deep breath — you're safe right now.", "Write down what's worrying you to get it out of your head.", "A short walk outside can help calm a restless mind."];
  }

  if (emotionKey === "stress") {
    if (risk >= 70) return ["You're carrying a lot right now — it's okay to ask for help.", "Step away completely for 15 minutes — no phone, no work.", "Talk to someone about what's overwhelming you today."];
    if (risk >= 40) return ["Take a short break and relax your shoulders.", "Break your work into one small manageable step at a time.", "Avoid multitasking — focus on just one thing right now."];
    return ["Take a 5-minute break away from your screen.", "A short stretch or deep breath can reset your focus.", "You're handling it — just take it one step at a time."];
  }

  if (["anger", "angry"].includes(emotionKey)) {
    if (risk >= 70) return ["Your frustration seems very intense — please step away before reacting.", "Talk to someone you trust about what's upsetting you.", "Consider speaking to a counselor if this feeling persists."];
    if (risk >= 40) return ["Pause before reacting and take a slow breath.", "Step away from the triggering situation for a few minutes.", "Write down what upset you before responding to anyone."];
    return ["Take a moment to cool down before making any decisions.", "A short walk can help release built-up tension.", "Try to identify what triggered this feeling and address it calmly."];
  }

  if (score >= 7) return ["Your mood looks stable — keep up your current routine.", "This is a good time to reflect on what's working well for you.", "Stay consistent with the habits that are keeping you balanced."];
  if (score >= 4) return ["Keep tracking your mood daily for better insights.", "Take a small pause and notice how your body feels right now.", "Try a short relaxing activity like music or a brief walk."];
  return ["Write a few more lines next time for a clearer analysis.", "Consider rest and self-care today.", "Talking to someone you trust can always help."];
};
