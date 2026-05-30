// // function Chatbot() {
// //     return (
// //       <div>
// //         <h2>AI Chatbot</h2>
// //         <p>Chatbot working...</p>
// //       </div>
// //     );
// //   }
  
// //   export default Chatbot;



// import { useState } from "react";
// import axios from "axios";

// function Chatbot() {

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {

//     if (!input.trim()) return;

//     const userMessage = {
//       sender: "user",
//       text: input
//     };

//     setMessages(prev => [...prev, userMessage]);

//     try {

//       const res = await axios.post(
//         "http://localhost:5000/api/chat",
//         { message: input }
//       );

//       const botMessage = {
//         sender: "bot",
//         text: res.data.reply
//       };

//       setMessages(prev => [...prev, botMessage]);

//     } catch (error) {

//       console.error(error);

//       setMessages(prev => [
//         ...prev,
//         { sender: "bot", text: "Server error. Try again." }
//       ]);

//     }

//     setInput("");

//   };

//   return (

//     <div>

//       <div style={{
//         height: "300px",
//         overflowY: "auto",
//         border: "1px solid #ddd",
//         padding: "10px",
//         borderRadius: "10px",
//         marginBottom: "10px",
//         background: "#f8fbff"
//       }}>

//         {messages.map((msg, index) => (

//           <div
//             key={index}
//             style={{
//               textAlign: msg.sender === "user" ? "right" : "left",
//               marginBottom: "8px"
//             }}
//           >

//             <span style={{
//               background: msg.sender === "user" ? "#6366f1" : "#e5e7eb",
//               color: msg.sender === "user" ? "white" : "black",
//               padding: "8px 12px",
//               borderRadius: "12px",
//               display: "inline-block"
//             }}>
//               {msg.text}
//             </span>

//           </div>

//         ))}

//       </div>

//       <div style={{ display: "flex", gap: "10px" }}>

//         <input
//           type="text"
//           placeholder="Tell me how you're feeling..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           style={{
//             flex: 1,
//             padding: "10px",
//             borderRadius: "8px",
//             border: "1px solid #ccc"
//           }}
//         />

//         <button
//           onClick={sendMessage}
//           style={{
//             background: "#6366f1",
//             color: "white",
//             border: "none",
//             padding: "10px 16px",
//             borderRadius: "8px",
//             cursor: "pointer"
//           }}
//         >
//           Send
//         </button>

//       </div>

//     </div>

//   );
// }

// export default Chatbot;