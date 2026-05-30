require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const SafeSpaceItem = require("../models/SafeSpaceItem");

const data = [
  // mini-games
  { title: "Color Match Calm", description: "A light focus game to gently shift your attention.", category: "mini-games", mediaType: "game", url: "https://www.crazygames.com/" },
  { title: "Puzzle Break", description: "A simple brain game for a calm mental reset.", category: "mini-games", mediaType: "game", url: "https://poki.com/" },
  { title: "Memory Relax", description: "A short memory challenge to refresh your mind.", category: "mini-games", mediaType: "game", url: "https://www.memozor.com/" },

  // music
  { title: "Soft Rain Ambience", description: "Gentle rain sounds for calm and comfort.", category: "music", mediaType: "audio", duration: "10 min", url: "https://www.youtube.com/results?search_query=soft+rain+sounds" },
  { title: "Piano Peace", description: "Slow piano tones for relaxation.", category: "music", mediaType: "audio", duration: "8 min", url: "https://www.youtube.com/results?search_query=calm+piano+music" },
  { title: "Nature Calm", description: "Birds, breeze, and nature sounds to relax.", category: "music", mediaType: "audio", duration: "12 min", url: "https://www.youtube.com/results?search_query=nature+relaxing+sounds" },

  // meditation
  { title: "5-Minute Calm Reset", description: "A short guided meditation for grounding.", category: "meditation", mediaType: "video", duration: "5 min", url: "https://www.youtube.com/results?search_query=5+minute+guided+meditation" },
  { title: "Morning Mindfulness", description: "Start gently with a focused meditation session.", category: "meditation", mediaType: "video", duration: "7 min", url: "https://www.youtube.com/results?search_query=morning+mindfulness+meditation" },
  { title: "Sleep Relaxation", description: "A soft meditation session to reduce night anxiety.", category: "meditation", mediaType: "video", duration: "10 min", url: "https://www.youtube.com/results?search_query=sleep+meditation+for+anxiety" },

  // therapy
  { title: "Grounding for Panic", description: "Quick grounding support for panic moments.", category: "therapy", mediaType: "video", duration: "6 min", url: "https://www.youtube.com/results?search_query=panic+attack+grounding+exercise" },
  { title: "Overthinking Relief", description: "Therapy-style support for racing thoughts.", category: "therapy", mediaType: "video", duration: "8 min", url: "https://www.youtube.com/results?search_query=overthinking+relief+therapy" },
  { title: "Anxiety Reset", description: "A gentle calming session for anxious moments.", category: "therapy", mediaType: "video", duration: "7 min", url: "https://www.youtube.com/results?search_query=anxiety+relief+session" },

  // funny-videos
  { title: "Cute Animal Moments", description: "A cheerful break to lift your mood.", category: "funny-videos", mediaType: "video", url: "https://www.youtube.com/results?search_query=funny+animal+videos" },
  { title: "Funny Kids Compilation", description: "Light and playful videos for a quick smile.", category: "funny-videos", mediaType: "video", url: "https://www.youtube.com/results?search_query=funny+kids+videos" },
  { title: "Comedy Shorts", description: "Small, funny clips for a stress break.", category: "funny-videos", mediaType: "video", url: "https://www.youtube.com/results?search_query=funny+short+videos" },

  // dance-videos
  { title: "Feel-Good Dance Break", description: "A positive movement break to refresh your energy.", category: "dance-videos", mediaType: "video", url: "https://www.youtube.com/results?search_query=feel+good+dance+workout" },
  { title: "Happy Dance Session", description: "Move a little and shake off stress.", category: "dance-videos", mediaType: "video", url: "https://www.youtube.com/results?search_query=happy+dance+video" },
  { title: "Fun Zumba Break", description: "A short dance routine for mood lifting.", category: "dance-videos", mediaType: "video", url: "https://www.youtube.com/results?search_query=zumba+fun+beginner" },

  // breathing
  { title: "Box Breathing", description: "Inhale 4, hold 4, exhale 4, hold 4.", category: "breathing", mediaType: "text", duration: "3 min" },
  { title: "4-4-6 Breathing", description: "Inhale for 4, hold for 4, exhale for 6.", category: "breathing", mediaType: "text", duration: "2 min" },
  { title: "Slow Deep Breathing", description: "Breathe in deeply and exhale slowly for calm.", category: "breathing", mediaType: "text", duration: "5 min" },

  // affirmations
  { title: "You are safe right now.", description: "Pause, breathe, and remind yourself that this feeling will pass.", category: "affirmations", mediaType: "text" },
  { title: "You are doing your best.", description: "Even small steps matter. You are trying, and that counts.", category: "affirmations", mediaType: "text" },
  { title: "This moment is temporary.", description: "Let yourself slow down. Calm can return gradually.", category: "affirmations", mediaType: "text" },
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected");

    const ops = data.map((item) => ({
      updateOne: {
        filter: { title: item.title, category: item.category },
        update: { $set: item },
        upsert: true,
      },
    }));

    const result = await SafeSpaceItem.bulkWrite(ops);
    console.log(`✅ Seed done: ${result.upsertedCount} inserted, ${result.modifiedCount} updated`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

run();