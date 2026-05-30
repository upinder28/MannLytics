import { useState } from "react";

export default function JournalInput({ onSubmit, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
  };

  return (
    <div style={container}>
      <h3>Daily Mental Health Journal</h3>

      <textarea
        rows="6"
        placeholder="Write how you feel today..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={textarea}
      />

      <button onClick={handleSubmit} disabled={loading} style={button}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  );
}

const container = {
  marginBottom: "30px",
};

const textarea = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const button = {
  marginTop: "10px",
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "white",
  cursor: "pointer",
};