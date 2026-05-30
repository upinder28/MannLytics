// const axios = require("axios");

// app.post("/api/chat", async (req, res) => {

//   const response = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "mistralai/mistral-7b-instruct",
//       messages: [{ role: "user", content: req.body.message }]
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`
//       }
//     }
//   );

//   res.json({ reply: response.data.choices[0].message.content });

// });