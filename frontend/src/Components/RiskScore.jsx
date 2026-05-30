export default function RiskMeter({ score }) {
    if (score === undefined) return null;
  
    let label = "Normal";
    let color = "green";
  
    if (score > 80) {
      label = "Critical";
      color = "red";
    } else if (score > 60) {
      label = "High Risk";
      color = "orange";
    } else if (score > 30) {
      label = "Mild Stress";
      color = "gold";
    }
  
    return (
      <div style={card}>
        <h3>Mental Health Risk Assessment</h3>
  
        <div style={barBackground}>
          <div
            style={{
              ...barFill,
              width: `${score}%`,
              backgroundColor: color,
            }}
          />
        </div>
  
        <p><strong>Score:</strong> {score}</p>
        <p><strong>Status:</strong> {label}</p>
      </div>
    );
  }
  
  const card = {
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f5f5f5",
    marginTop: "20px",
  };
  
  const barBackground = {
    height: "20px",
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: "10px",
    marginBottom: "10px",
  };
  
  const barFill = {
    height: "100%",
    borderRadius: "10px",
  };