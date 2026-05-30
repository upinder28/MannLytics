export default function AnalysisReport({ analysis }) {
    if (!analysis) return null;
  
    return (
      <div style={card}>
        <h3>Emotion Analysis Report</h3>
  
        <p><strong>Primary Emotion:</strong> {analysis.emotion}</p>
        <p><strong>Sentiment Score:</strong> {analysis.sentiment_score}</p>
  
        <h4>Cognitive Distortions</h4>
        {analysis.cognitive_distortions?.length > 0 ? (
          <ul>
            {analysis.cognitive_distortions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        ) : (
          <p>None detected</p>
        )}
  
        <h4>Behavioral Signals</h4>
        {analysis.behavioral_signals?.length > 0 ? (
          <ul>
            {analysis.behavioral_signals.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        ) : (
          <p>None detected</p>
        )}
      </div>
    );
  }
  
  const card = {
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#eef6ff",
    marginTop: "20px",
  };