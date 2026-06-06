// const express = require("express");
// const router = express.Router();
// const OpenAI = require("openai");
// const Chat = require("../models/Chat"); // ✅ IMPORTANT

// const client = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: "https://openrouter.ai/api/v1"
// });


// // ✅ AI CHAT (Streaming)
// router.post("/chat", async (req, res) => {
//   try {
//     const { message, chatId, userEmail, history } = req.body;

//     const conversationHistory = (history || []).map(m => ({
//       role: m.sender === "user" ? "user" : "assistant",
//       content: m.text
//     }));

//     // Generate title for new chat
//     let chatTitle = null;
//     const isNewChat = !chatId;
//     if (isNewChat) {
//       const titleCompletion = await client.chat.completions.create({
//         model: "openrouter/auto",
//         max_tokens: 10,
//         messages: [
//           { role: "system", content: "You are a chat title generator. Generate a short, meaningful 3-5 word title that captures the emotional topic of the user's message. Examples: 'Feeling Anxious About Work', 'Struggling With Sleep', 'Dealing With Loneliness', 'Stress About Exams'. Return ONLY the title, nothing else. No quotes, no punctuation at end." },
//           { role: "user", content: message }
//         ]
//       });
//       chatTitle = titleCompletion.choices[0].message.content.trim();
//     }

//     // Create or find chat first to get chatId
//     let chat;
//     if (chatId) {
//       chat = await Chat.findById(chatId);
//       chat.messages.push({ sender: "user", text: message });
//     } else {
//       chat = new Chat({ userEmail, title: chatTitle, messages: [{ sender: "user", text: message }] });
//       await chat.save();
//     }

//     // Set headers for SSE streaming
//     res.setHeader("Content-Type", "text/event-stream");
//     res.setHeader("Cache-Control", "no-cache");
//     res.setHeader("Connection", "keep-alive");

//     // Send chatId and title first
//     res.write(`data: ${JSON.stringify({ type: "meta", chatId: chat._id, chatTitle })}\n\n`);

//     const stream = await client.chat.completions.create({
//       model: "openrouter/auto",
//       stream: true,
//       max_tokens: 300,
//       messages: [
//         { role: "system", content: `You are Mannlytics, a mental wellness companion. Follow these rules strictly:
// 1. If the user message is ONLY a greeting (hi, hello, hey, hii, etc.) — respond with ONLY a short warm greeting and ask how they are feeling. Do NOT mention helplines, do NOT introduce yourself in detail, do NOT say anything extra.
// 2. For emotional messages — respond with empathy in 2-3 sentences.
// 3. ONLY if user EXPLICITLY uses words like suicide, suicidal, want to die, kill myself, end my life, self-harm — then provide helplines (iCall: 9152987821, Vandrevala Foundation: 1860-2662-345). Do NOT mention helplines for sadness, stress, anxiety, or any other emotion.` },
//         ...conversationHistory,
//         { role: "user", content: message }
//       ]
//     });

//     let botReply = "";
//     for await (const chunk of stream) {
//       const token = chunk.choices[0]?.delta?.content || "";
//       if (token) {
//         botReply += token;
//         res.write(`data: ${JSON.stringify({ type: "token", token })}\n\n`);
//       }
//     }

//     // Save bot reply to DB
//     chat.messages.push({ sender: "bot", text: botReply });
//     await chat.save();

//     res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
//     res.end();

//   } catch (error) {
//     console.error(error);
//     res.write(`data: ${JSON.stringify({ type: "error", message: "AI error" })}\n\n`);
//     res.end();
//   }
// });


// // ✅ NEW CHAT CREATE
// router.post("/newChat", async (req, res) => {
//   try {
//     const { userEmail } = req.body;

//     const newChat = new Chat({
//       userEmail,
//       messages: []
//     });

//     await newChat.save();

//     res.json(newChat);
//   } catch (err) {
//     res.status(500).json({ error: "Error creating chat" });
//   }
// });


// // ✅ SAVE CHAT
// router.post("/saveChat", async (req, res) => {
//   try {
//     const { chatId, messages } = req.body;

//     await Chat.findByIdAndUpdate(chatId, { messages });

//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: "Error saving chat" });
//   }
// });


// // ✅ GET ALL CHATS
// router.get("/chats/:email", async (req, res) => {
//   try {
//     const chats = await Chat.find({
//       userEmail: req.params.email
//     }).sort({ createdAt: -1 });

//     res.json(chats);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching chats" });
//   }
// });


// // ✅ DELETE CHAT
// router.delete("/chat/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!/^[a-f\d]{24}$/i.test(id)) return res.status(400).json({ error: "Invalid chat id" });

//     const userEmail = req.headers["x-user-email"];
//     const chat = await Chat.findById(id);
//     if (!chat) return res.status(404).json({ error: "Chat not found" });
//     if (chat.userEmail !== userEmail) return res.status(403).json({ error: "Unauthorized" });

//     await Chat.findByIdAndDelete(id);
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: "Error deleting chat" });
//   }
// });

// module.exports = router;



router.post("/chat", async (req, res) => {
  try {
    console.log("========== CHAT REQUEST ==========");
    console.log(
      "OPENROUTER_API_KEY:",
      process.env.OPENROUTER_API_KEY ? "FOUND" : "MISSING"
    );

    const { message, chatId, userEmail, history } = req.body;

    const conversationHistory = (history || []).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    let chatTitle = null;
    const isNewChat = !chatId;

    if (isNewChat) {
      const titleCompletion = await client.chat.completions.create({
        model: "openrouter/auto",
        max_tokens: 10,
        messages: [
          {
            role: "system",
            content:
              "Generate a short 3-5 word title. Return only title.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

      chatTitle =
        titleCompletion.choices?.[0]?.message?.content?.trim() ||
        "New Chat";
    }

    let chat;

    if (chatId) {
      chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({
          error: "Chat not found",
        });
      }

      chat.messages.push({
        sender: "user",
        text: message,
      });
    } else {
      chat = new Chat({
        userEmail,
        title: chatTitle,
        messages: [
          {
            sender: "user",
            text: message,
          },
        ],
      });

      await chat.save();
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(
      `data: ${JSON.stringify({
        type: "meta",
        chatId: chat._id,
        chatTitle,
      })}\n\n`
    );

    const stream = await client.chat.completions.create({
      model: "openrouter/auto",
      stream: true,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You are Mannlytics, a mental wellness companion.",
        },
        ...conversationHistory,
        {
          role: "user",
          content: message,
        },
      ],
    });

    let botReply = "";

    for await (const chunk of stream) {
      const token = chunk.choices?.[0]?.delta?.content || "";

      if (token) {
        botReply += token;

        res.write(
          `data: ${JSON.stringify({
            type: "token",
            token,
          })}\n\n`
        );
      }
    }

    chat.messages.push({
      sender: "bot",
      text: botReply,
    });

    await chat.save();

    console.log("Chat saved successfully");

    res.write(
      `data: ${JSON.stringify({
        type: "done",
      })}\n\n`
    );

    res.end();
  } catch (error) {
    console.error("========== CHAT ERROR ==========");
    console.error(error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    res.write(
      `data: ${JSON.stringify({
        type: "error",
        message: error.message,
        details: error.response?.data || null,
      })}\n\n`
    );

    res.end();
  }
});