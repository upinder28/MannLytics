import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { jsPDF } from "jspdf";
import AppNavbar from "../Components/AppNavbar";
import {
  FaArrowLeft,
  FaArrowUp,
  FaBookOpen,
  FaBookmark,
  FaBrain,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaDownload,
  FaExclamationTriangle,
  FaFire,
  FaHeart,
  FaLeaf,
  FaMoon,
  FaRegBookmark,
  FaSearch,
  FaSmile,
  FaSun,
  FaTimes,
  FaBolt,
  FaWind,
  FaBalanceScale,
  FaFilter,
} from "react-icons/fa";

const CONDITIONS = [
  {
    id: "depression",
    label: "Depression",
    emoji: "💙",
    icon: FaBrain,
    color: "from-blue-500 to-indigo-500",
    tag: "Condition",
    tagColor: "bg-blue-100 text-blue-700",
    definition:
      "Depression is a common but serious mood disorder that causes persistent sadness, emptiness, and loss of interest. It affects emotions, thinking, motivation, and everyday functioning.",
    overview:
      "Depression is more than feeling sad for a day or two. It can affect sleep, appetite, concentration, self-worth, and the ability to enjoy ordinary life. It may develop gradually or feel sudden, and it often needs active support rather than willpower alone.",
    dailyImpact:
      "Daily tasks such as getting out of bed, responding to messages, studying, working, bathing, or making decisions may start to feel unusually heavy. Relationships can also suffer because the person may withdraw or feel emotionally numb.",
    symptoms: [
      "Persistent sadness or empty mood lasting more than 2 weeks",
      "Loss of interest in activities once enjoyed",
      "Fatigue and decreased energy",
      "Difficulty concentrating, remembering, or making decisions",
      "Changes in appetite or weight",
      "Sleep disturbances — sleeping too much or too little",
      "Feelings of worthlessness or excessive guilt",
      "Thoughts of death or suicide",
    ],
    feels:
      "It can feel like carrying a heavy weight every day. Simple tasks feel exhausting. You may feel disconnected from people around you, even when surrounded by others.",
    coping: [
      "Maintain a daily routine — even small structure helps",
      "Exercise regularly — even a 20-minute walk improves mood",
      "Stay connected with trusted friends or family",
      "Limit alcohol and avoid substances",
      "Practice mindfulness or gentle breathing exercises",
      "Write in a journal to process your thoughts",
    ],
    seek:
      "If symptoms last more than 2 weeks, interfere with daily life, or include thoughts of self-harm, please consult a mental health professional immediately.",
    related: ["anxiety", "sadness", "ptsd"],
  },
  {
    id: "anxiety",
    label: "Anxiety",
    emoji: "😰",
    icon: FaBolt,
    color: "from-violet-500 to-purple-500",
    tag: "Condition",
    tagColor: "bg-violet-100 text-violet-700",
    definition:
      "Anxiety is a stress response that becomes a problem when it is excessive, persistent, and starts interfering with life. It often includes intense worry plus physical symptoms.",
    overview:
      "Everyone feels anxious sometimes, but an anxiety disorder can make everyday situations feel threatening even when no immediate danger exists. The mind and body can stay in a constant state of alertness.",
    dailyImpact:
      "It may affect work, sleep, social life, travel, conversations, concentration, and confidence. People often begin avoiding places or situations that trigger fear, which can gradually shrink their world.",
    symptoms: [
      "Excessive worry that is hard to control",
      "Restlessness or feeling on edge",
      "Rapid heartbeat or shortness of breath",
      "Sweating, trembling, or dizziness",
      "Difficulty sleeping due to racing thoughts",
      "Avoiding situations that trigger anxiety",
      "Muscle tension or headaches",
      "Irritability",
    ],
    feels:
      "Anxiety can feel like your mind is always running worst-case scenarios. Your body may feel tense even when there is no real danger. It can be exhausting to feel constantly alert.",
    coping: [
      "Practice box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s",
      "Ground yourself using the 5-4-3-2-1 technique",
      "Limit caffeine and sugar intake",
      "Challenge anxious thoughts by asking 'Is this realistic?'",
      "Regular physical activity reduces anxiety significantly",
      "Reduce screen time, especially before bed",
    ],
    seek:
      "Seek help if anxiety is preventing you from working, socializing, or completing daily tasks, or if you experience panic attacks.",
    related: ["panic-disorder", "ocd", "stress"],
  },
  {
    id: "stress",
    label: "Stress",
    emoji: "😣",
    icon: FaFire,
    color: "from-orange-500 to-amber-500",
    tag: "Emotion",
    tagColor: "bg-orange-100 text-orange-700",
    definition:
      "Stress is the body's response to pressure, change, or challenge. It can be mental, emotional, or physical, and can build up quietly over time.",
    overview:
      "Stress itself is not always harmful, but chronic stress can begin affecting the body, mood, memory, sleep, and patience. It often develops when demands keep exceeding recovery time.",
    dailyImpact:
      "When stress stays high for too long, people may become reactive, forgetful, tired, unmotivated, or physically tense. It can reduce productivity while also making rest feel difficult.",
    symptoms: [
      "Feeling overwhelmed or out of control",
      "Difficulty relaxing or quieting the mind",
      "Low energy and constant fatigue",
      "Headaches, upset stomach, or chest pain",
      "Procrastination or neglecting responsibilities",
      "Increased use of alcohol, cigarettes, or food",
      "Mood swings and irritability",
      "Poor concentration",
    ],
    feels:
      "Stress often feels like too much to handle at once. Your mind races between tasks, deadlines, and responsibilities. Even rest can feel unproductive when you are stressed.",
    coping: [
      "Break large tasks into smaller, manageable steps",
      "Prioritize and learn to say no when overwhelmed",
      "Take regular short breaks during work",
      "Talk to someone you trust about what is bothering you",
      "Spend time in nature or do something creative",
      "Sleep 7-8 hours — sleep is the most powerful stress reliever",
    ],
    seek:
      "Seek help if stress is causing physical symptoms, affecting your relationships, or lasting for several weeks without relief.",
    related: ["anxiety", "anger", "panic-disorder"],
  },
  {
    id: "suicidal",
    label: "Suicidal Ideation",
    emoji: "🆘",
    icon: FaExclamationTriangle,
    color: "from-red-500 to-rose-600",
    tag: "Crisis",
    tagColor: "bg-red-100 text-red-700",
    definition:
      "Suicidal ideation refers to thoughts about ending one's life. It can range from fleeting thoughts to active planning and always deserves serious, immediate attention.",
    overview:
      "Suicidal thoughts often grow from unbearable emotional pain, hopelessness, trauma, shame, or feeling like a burden. These thoughts are dangerous, but they are also treatable and survivable with immediate support.",
    dailyImpact:
      "A person may withdraw, stop planning for the future, give things away, say goodbye indirectly, or seem suddenly calm after deep distress. Even subtle signs should be taken seriously.",
    symptoms: [
      "Talking about wanting to die or to kill oneself",
      "Looking for ways to end one's life",
      "Talking about being a burden to others",
      "Withdrawing from friends, family, and activities",
      "Giving away prized possessions",
      "Saying goodbye to people as if it were the last time",
      "Extreme mood swings — sudden calmness after depression",
      "Expressing feelings of hopelessness or having no reason to live",
    ],
    feels:
      "People experiencing suicidal thoughts often feel trapped, hopeless, and like a burden. The pain feels unbearable and permanent. But these feelings are temporary and treatable.",
    coping: [
      "Reach out to a trusted person immediately",
      "Do not stay alone if you feel unsafe",
      "Move away from anything that could be used for self-harm",
      "Focus only on getting through the next few minutes or hour",
      "Say out loud what you are feeling to someone you trust",
      "Seek urgent professional or emergency support right away",
    ],
    seek:
      "This is an emergency. Please seek immediate support from a trusted person, emergency service, or a qualified crisis support professional right away.",
    crisis: true,
    related: ["depression", "bipolar"],
  },
  {
    id: "sadness",
    label: "Sadness",
    emoji: "😢",
    icon: FaHeart,
    color: "from-sky-500 to-blue-400",
    tag: "Emotion",
    tagColor: "bg-sky-100 text-sky-700",
    definition:
      "Sadness is a normal human emotion usually linked to loss, disappointment, hurt, or change. It is different from depression because it is often connected to a clear cause and tends to soften with time.",
    overview:
      "Sadness is not a failure or weakness. It is part of emotional processing. The goal is not always to remove sadness immediately, but to understand it and move through it safely.",
    dailyImpact:
      "People may cry more, feel quieter, isolate briefly, or have reduced energy and interest. They may still function, but with a noticeable emotional heaviness.",
    symptoms: [
      "Feeling low, tearful, or heavy-hearted",
      "Reduced motivation or energy",
      "Wanting to be alone or withdraw temporarily",
      "Replaying painful memories or events",
      "Loss of appetite or comfort eating",
      "Difficulty finding joy in usual activities",
    ],
    feels:
      "Sadness feels like a quiet heaviness. It often comes with a need to cry, reflect, or be alone. It is a natural response to loss, disappointment, or change.",
    coping: [
      "Allow yourself to feel sad — suppressing it makes it worse",
      "Talk to someone you trust about how you feel",
      "Listen to music that matches or gently lifts your mood",
      "Do something kind for yourself — rest, a warm drink, a walk",
      "Write about what you are feeling without judgment",
      "Give yourself time — sadness naturally passes",
    ],
    seek:
      "If sadness persists for more than 2 weeks without a clear cause, or if it is interfering with daily life, consider speaking with a counselor.",
    related: ["depression", "stress", "normal"],
  },
  {
    id: "anger",
    label: "Anger",
    emoji: "😠",
    icon: FaFire,
    color: "from-red-400 to-orange-500",
    tag: "Emotion",
    tagColor: "bg-red-100 text-red-700",
    definition:
      "Anger is a normal emotion that signals frustration, injustice, hurt, or threat. It becomes concerning when it is frequent, intense, or expressed destructively.",
    overview:
      "Anger often sits on top of more vulnerable emotions like fear, shame, sadness, or feeling unheard. Learning to notice what anger is protecting can reduce impulsive reactions.",
    dailyImpact:
      "Unmanaged anger can damage trust, communication, decision-making, and emotional safety. It may also affect sleep, blood pressure, and relationships at home or work.",
    symptoms: [
      "Feeling irritated, frustrated, or furious",
      "Increased heart rate and muscle tension",
      "Clenching jaw or fists",
      "Saying or doing things you later regret",
      "Difficulty letting go of grievances",
      "Feeling misunderstood or disrespected",
    ],
    feels:
      "Anger can feel like a surge of heat or pressure building inside. It often masks other emotions like hurt, fear, or embarrassment. It demands to be expressed but benefits from being managed.",
    coping: [
      "Pause before reacting — count to 10 or leave the room",
      "Identify the real emotion underneath the anger",
      "Exercise to release physical tension",
      "Write down what triggered you before responding",
      "Practice assertive communication instead of aggression",
      "Use deep breathing to calm your nervous system",
    ],
    seek:
      "Seek help if anger is damaging your relationships, causing you to act violently, or feels completely out of control.",
    related: ["stress", "anxiety", "bipolar"],
  },
  {
    id: "normal",
    label: "Normal / Wellness",
    emoji: "😊",
    icon: FaSmile,
    color: "from-green-500 to-emerald-400",
    tag: "Wellness",
    tagColor: "bg-green-100 text-green-700",
    definition:
      "Wellness refers to a generally stable emotional state where a person can manage everyday challenges, recover from setbacks, and stay connected with life.",
    overview:
      "Mental wellness does not mean being happy all the time. It means being able to experience a full range of emotions without constantly feeling overwhelmed or stuck.",
    dailyImpact:
      "People in a healthier state usually manage responsibilities more consistently, maintain relationships more easily, and recover more smoothly after stress.",
    symptoms: [
      "Feeling generally content and stable",
      "Able to manage daily responsibilities",
      "Maintaining healthy relationships",
      "Experiencing a range of emotions without being overwhelmed",
      "Recovering from setbacks in a reasonable time",
      "Feeling a sense of purpose or meaning",
    ],
    feels:
      "Wellness feels like being grounded. You can handle challenges without being overwhelmed. You feel connected to yourself and others, and life feels manageable.",
    coping: [
      "Maintain your current healthy habits and routines",
      "Continue journaling and self-reflection",
      "Invest in relationships that support your wellbeing",
      "Set meaningful goals and celebrate small wins",
      "Practice gratitude — write 3 things you are thankful for daily",
      "Keep learning about mental health to stay aware",
    ],
    seek:
      "Even when feeling well, regular mental health check-ins are valuable. Consider speaking with a counselor proactively, not just in crisis.",
    related: ["sadness", "stress", "anxiety"],
  },
  {
    id: "ptsd",
    label: "PTSD",
    emoji: "🪖",
    icon: FaExclamationTriangle,
    color: "from-fuchsia-500 to-pink-500",
    tag: "Condition",
    tagColor: "bg-fuchsia-100 text-fuchsia-700",
    definition:
      "Post-traumatic stress disorder can develop after experiencing or witnessing trauma. It may involve intrusive memories, avoidance, heightened alertness, and emotional changes.",
    overview:
      "PTSD is not just remembering something painful. The nervous system may continue responding as if danger is still present, even long after the event is over.",
    dailyImpact:
      "Triggers such as sounds, smells, locations, or conversations may bring sudden fear, shutdown, flashbacks, or physical distress. Sleep and trust often become harder too.",
    symptoms: [
      "Intrusive memories, nightmares, or flashbacks",
      "Avoiding reminders of the trauma",
      "Feeling constantly on guard or easily startled",
      "Difficulty sleeping or concentrating",
      "Emotional numbness or detachment",
      "Irritability or angry outbursts",
      "Guilt, shame, or blame related to the event",
      "Strong physical reactions to reminders",
    ],
    feels:
      "PTSD can feel like the body and mind are still stuck in danger even when the event is over. Triggers can bring intense fear, panic, or emotional shutdown very quickly.",
    coping: [
      "Create a safety routine for overwhelming moments",
      "Use grounding techniques to reconnect with the present",
      "Keep track of triggers and early warning signs",
      "Prioritize sleep and gentle daily structure",
      "Reach out to trauma-informed support when possible",
      "Remind yourself that trauma reactions are real and treatable",
    ],
    seek:
      "Seek professional help if trauma symptoms are persistent, worsening, or interfering with work, relationships, sleep, or safety.",
    related: ["anxiety", "depression", "panic-disorder"],
  },
  {
    id: "bipolar",
    label: "Bipolar Disorder",
    emoji: "🎭",
    icon: FaBalanceScale,
    color: "from-cyan-500 to-blue-500",
    tag: "Condition",
    tagColor: "bg-cyan-100 text-cyan-700",
    definition:
      "Bipolar disorder is a mood condition involving episodes of depression and periods of unusually elevated, energized, or irritable mood.",
    overview:
      "These mood shifts are stronger than ordinary ups and downs. They can affect sleep, judgment, spending, confidence, activity level, and safety.",
    dailyImpact:
      "A person may swing between periods of high drive and reduced sleep, and periods of deep fatigue or hopelessness. This can disrupt work, relationships, and routine stability.",
    symptoms: [
      "Periods of unusually high energy or agitation",
      "Needing much less sleep without feeling tired",
      "Racing thoughts or rapid speech",
      "Impulsive decisions or risky behavior",
      "Episodes of sadness, emptiness, or hopelessness",
      "Noticeable shifts in mood, activity, or confidence",
      "Difficulty functioning consistently over time",
      "Changes in focus, motivation, or judgment",
    ],
    feels:
      "Bipolar disorder can feel unpredictable. At one time you may feel intensely driven, restless, or invincible, and at another deeply low, exhausted, or disconnected.",
    coping: [
      "Track mood, sleep, and energy patterns regularly",
      "Protect sleep as a priority",
      "Reduce alcohol and drug use",
      "Ask trusted people to help notice early changes",
      "Maintain medication and therapy routines if prescribed",
      "Build structured daily rhythms around meals, sleep, and activity",
    ],
    seek:
      "Seek help if mood highs or lows are affecting safety, work, money decisions, relationships, or sleep, or if symptoms are becoming more intense.",
    related: ["depression", "anger", "suicidal"],
  },
  {
    id: "ocd",
    label: "OCD",
    emoji: "🔁",
    icon: FaBrain,
    color: "from-teal-500 to-emerald-500",
    tag: "Condition",
    tagColor: "bg-teal-100 text-teal-700",
    definition:
      "Obsessive-compulsive disorder involves unwanted intrusive thoughts and repetitive behaviors or mental rituals done to reduce distress.",
    overview:
      "OCD is not simply liking things neat or organized. It usually involves a distress cycle where intrusive thoughts create anxiety and compulsions temporarily reduce it.",
    dailyImpact:
      "Rituals can consume time, increase exhaustion, create shame, and interrupt normal tasks. Reassurance-seeking and avoidance may also quietly grow over time.",
    symptoms: [
      "Repeated intrusive thoughts that feel hard to dismiss",
      "Checking, washing, counting, or arranging rituals",
      "Fear that something bad will happen if rituals are not done",
      "Spending significant time on compulsions",
      "Seeking repeated reassurance",
      "Distress when routines are interrupted",
      "Recognizing the thoughts or behaviors feel excessive",
      "Daily functioning affected by obsession-compulsion cycles",
    ],
    feels:
      "OCD can feel like getting trapped in a loop where anxiety rises unless a ritual is done, even when you know logically it may not make sense.",
    coping: [
      "Notice and name the obsession-compulsion cycle",
      "Delay compulsions briefly instead of aiming for perfection immediately",
      "Reduce reassurance-seeking where possible",
      "Track triggers and repetitive patterns",
      "Practice tolerating uncertainty in small, safe ways",
      "Seek evidence-based support such as ERP-informed care",
    ],
    seek:
      "Seek help if repetitive thoughts or rituals are taking significant time, causing distress, or limiting normal life activities.",
    related: ["anxiety", "panic-disorder", "stress"],
  },
  {
    id: "panic-disorder",
    label: "Panic Disorder",
    emoji: "💨",
    icon: FaWind,
    color: "from-rose-500 to-orange-500",
    tag: "Condition",
    tagColor: "bg-rose-100 text-rose-700",
    definition:
      "Panic disorder involves repeated panic attacks and ongoing fear about having more attacks. Panic attacks can be sudden and physically intense.",
    overview:
      "Panic attacks often feel catastrophic in the moment, even when there is no immediate external danger. Fear of future attacks can become almost as disabling as the attacks themselves.",
    dailyImpact:
      "People may start avoiding crowds, commuting, travelling alone, exercise, or certain places where they once panicked. Life can become organized around fear prevention.",
    symptoms: [
      "Sudden racing heart, chest tightness, or trembling",
      "Shortness of breath or feeling like you cannot get enough air",
      "Dizziness, sweating, or tingling sensations",
      "Feeling detached, unreal, or out of control",
      "Fear of dying, fainting, or losing control",
      "Avoiding places or situations associated with past attacks",
      "Persistent worry about the next attack",
      "Major distress caused by the unpredictability of episodes",
    ],
    feels:
      "A panic attack can feel terrifying and immediate, as though something catastrophic is happening in the body. Afterwards, many people feel drained and fearful of it happening again.",
    coping: [
      "Remind yourself that panic peaks and passes",
      "Lengthen your exhale during breathing",
      "Ground yourself using what you can see and feel",
      "Reduce avoidance gradually with support",
      "Keep a short panic-response plan on your phone",
      "Limit stimulants if they worsen physical symptoms",
    ],
    seek:
      "Seek help if panic attacks are recurring, causing avoidance, or making you fear normal routines like travel, work, or being alone.",
    related: ["anxiety", "ocd", "ptsd"],
  },
];

const TIPS = [
  {
    emoji: "💧",
    tip: "Drink water first thing in the morning — dehydration can worsen fatigue, mood, and focus.",
  },
  {
    emoji: "🌿",
    tip: "Step outside for 10 minutes daily — natural light can support sleep rhythm and emotional balance.",
  },
  {
    emoji: "📵",
    tip: "Reduce screens before bedtime — better sleep often improves mood regulation.",
  },
  {
    emoji: "🧘",
    tip: "Pause for 3 slow breaths before reacting — it gives your nervous system a chance to settle.",
  },
  {
    emoji: "✍️",
    tip: "Name your feeling in one sentence each day — awareness usually comes before healing.",
  },
];

const MYTHS_FACTS = [
  {
    myth: "Mental health problems are rare.",
    fact: "They are common and can affect people of any age, background, or personality type.",
  },
  {
    myth: "Anxiety is just overthinking.",
    fact: "Anxiety can involve strong physical symptoms, nervous system activation, and significant daily impairment.",
  },
  {
    myth: "OCD means liking cleanliness or order.",
    fact: "OCD involves distressing obsessions and compulsions, not just neatness.",
  },
  {
    myth: "If someone looks fine, they must be fine.",
    fact: "Many people function outwardly while struggling internally for a long time.",
  },
  {
    myth: "Talking about suicidal thoughts gives people the idea.",
    fact: "Compassionate, direct conversation can reduce isolation and help someone get support.",
  },
  {
    myth: "Breathing exercises fix every crisis.",
    fact: "Breathing can help regulate the body, but some situations need urgent professional or emergency support.",
  },
];

const FILTERS = ["All", "Condition", "Emotion", "Wellness", "Crisis"];
const SORT_OPTIONS = ["Recommended", "A-Z", "Saved First"];
const SECTION_META = {
  overview: { label: "Overview", title: "Overview" },
  impact: { label: "Daily Impact", title: "Daily Impact" },
  symptoms: { label: "Symptoms", title: "Symptoms" },
  feels: { label: "What It Feels Like", title: "What It Feels Like" },
  coping: { label: "Coping Strategies", title: "Coping Strategies" },
  seek: { label: "When To Seek Help", title: "When To Seek Help" },
};

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function createPdf(title) {
  const pdf = new jsPDF("p", "mm", "a4");
  pdf.setProperties({ title });
  return pdf;
}

function addWrappedText(pdf, text, x, y, maxWidth, lineHeight = 7, fontSize = 12) {
  pdf.setFontSize(fontSize);
  const lines = pdf.splitTextToSize(text, maxWidth);
  let currentY = y;

  lines.forEach((line) => {
    if (currentY > 280) {
      pdf.addPage();
      currentY = 20;
    }
    pdf.text(line, x, currentY);
    currentY += lineHeight;
  });

  return currentY;
}

function addBulletList(pdf, items, x, y, maxWidth) {
  let currentY = y;
  items.forEach((item) => {
    currentY = addWrappedText(pdf, `• ${item}`, x, currentY, maxWidth, 7, 11);
    currentY += 1;
  });
  return currentY;
}

function addSectionHeading(pdf, heading, y) {
  let currentY = y;
  if (currentY > 270) {
    pdf.addPage();
    currentY = 20;
  }
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(heading, 15, currentY);
  pdf.setFont("helvetica", "normal");
  return currentY + 8;
}

function addArticleToPdf(pdf, item, sectionKey) {
  let y = 20;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text(`${item.emoji} ${item.label}`, 15, y);
  y += 10;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(`Category: ${item.tag}`, 15, y);
  y += 10;

  y = addSectionHeading(pdf, "Definition", y);
  y = addWrappedText(pdf, item.definition, 15, y, 180, 7, 11);
  y += 4;

  const writeSection = (title, content, isList = false) => {
    y = addSectionHeading(pdf, title, y);
    y = isList
      ? addBulletList(pdf, content, 15, y, 180)
      : addWrappedText(pdf, content, 15, y, 180, 7, 11);
    y += 4;
  };

  if (!sectionKey || sectionKey === "overview") writeSection("Overview", item.overview);
  if (!sectionKey || sectionKey === "impact") writeSection("Daily Impact", item.dailyImpact);
  if (!sectionKey || sectionKey === "symptoms") writeSection("Symptoms", item.symptoms, true);
  if (!sectionKey || sectionKey === "feels") writeSection("What It Feels Like", item.feels);
  if (!sectionKey || sectionKey === "coping") writeSection("Coping Strategies", item.coping, true);
  if (!sectionKey || sectionKey === "seek") writeSection("When To Seek Help", item.seek);
}

export default function MentalHealthLibrary() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState("Recommended");
  const [activeSectionById, setActiveSectionById] = useState({});
  const [savedItems, setSavedItems] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const token = sessionStorage.getItem("token");
  const currentUserEmail = sessionStorage.getItem("currentUser") || localStorage.getItem("currentUser");
  const isLoggedIn = !!token;
  const [showTop, setShowTop] = useState(false);

  const [breathingPhase, setBreathingPhase] = useState("Ready");
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [mythIndex, setMythIndex] = useState(0);

  // Sync dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // Load saved items — from backend if logged in, else localStorage
  useEffect(() => {
    if (isLoggedIn) {
      setSavedLoading(true);
      fetch("http://localhost:5000/api/library/saved", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setSavedItems(data.saved || []))
        .catch(() => {})
        .finally(() => setSavedLoading(false));
    } else {
      try {
        const raw = localStorage.getItem("mentalLibrarySaved");
        setSavedItems(raw ? JSON.parse(raw) : []);
      } catch {
        setSavedItems([]);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isBreathing) return undefined;

    const steps = [
      { label: "Inhale", delay: 4000 },
      { label: "Hold", delay: 4000 },
      { label: "Exhale", delay: 6000 },
      { label: "Hold", delay: 2000 },
    ];

    let timeoutId;
    let cancelled = false;
    let current = 0;

    const run = () => {
      if (cancelled) return;
      const step = steps[current];
      setBreathingPhase(step.label);
      timeoutId = setTimeout(() => {
        current = (current + 1) % steps.length;
        if (current === 0) setBreathingCycle((prev) => prev + 1);
        run();
      }, step.delay);
    };

    run();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isBreathing]);

  const counts = useMemo(() => {
    return FILTERS.reduce((acc, filter) => {
      acc[filter] =
        filter === "All"
          ? CONDITIONS.length
          : CONDITIONS.filter((item) => item.tag === filter).length;
      return acc;
    }, {});
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    let result = CONDITIONS.filter((item) => {
      const content = [
        item.label,
        item.tag,
        item.definition,
        item.overview,
        item.dailyImpact,
        item.feels,
        item.seek,
        ...item.symptoms,
        ...item.coping,
      ]
        .join(" ")
        .toLowerCase();

      const matchSearch = !term || content.includes(term);
      const matchFilter = activeFilter === "All" || item.tag === activeFilter;
      return matchSearch && matchFilter;
    });

    if (sortBy === "A-Z") {
      result = [...result].sort((a, b) => a.label.localeCompare(b.label));
    }

    if (sortBy === "Saved First") {
      result = [...result].sort((a, b) => {
        const aSaved = savedItems.includes(a.id) ? 1 : 0;
        const bSaved = savedItems.includes(b.id) ? 1 : 0;
        return bSaved - aSaved;
      });
    }

    if (sortBy === "Recommended") {
      const priority = { Crisis: 0, Condition: 1, Emotion: 2, Wellness: 3 };
      result = [...result].sort((a, b) => priority[a.tag] - priority[b.tag]);
    }

    return result;
  }, [search, activeFilter, sortBy, savedItems]);

  const featuredTip = TIPS[new Date().getDate() % TIPS.length];
  const getActiveSection = (id) => activeSectionById[id] || "overview";

  const setActiveSection = (id, section) => {
    setActiveSectionById((prev) => ({ ...prev, [id]: section }));
  };

  const toggleSaved = async (id) => {
    if (isLoggedIn) {
      // Optimistic update
      setSavedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
      try {
        await fetch("http://localhost:5000/api/library/saved/toggle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ conditionId: id }),
        });
      } catch {
        // Revert on failure
        setSavedItems((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
      }
    } else {
      setSavedItems((prev) => {
        const updated = prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
        localStorage.setItem("mentalLibrarySaved", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const openRelated = (id) => {
    setExpanded(id);
    setActiveSection(id, "overview");
    const el = document.getElementById(`condition-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const exportFullLibrary = () => {
    const pdf = createPdf("Mental Health Library");
    filtered.forEach((item, index) => {
      if (index !== 0) pdf.addPage();
      addArticleToPdf(pdf, item);
    });
    pdf.save(`mental-health-library-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportFullArticle = (item) => {
    const pdf = createPdf(item.label);
    addArticleToPdf(pdf, item);
    pdf.save(`${slugify(item.label)}-article.pdf`);
  };

  const exportArticleSection = (item, sectionKey) => {
    const pdf = createPdf(`${item.label} ${SECTION_META[sectionKey].title}`);
    addArticleToPdf(pdf, item, sectionKey);
    pdf.save(`${slugify(item.label)}-${slugify(SECTION_META[sectionKey].title)}.pdf`);
  };

  const bg = darkMode
    ? "bg-slate-950 text-white"
    : "bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.14),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f4f8ff_40%,#ffffff_100%)] text-slate-800";

  const card = darkMode
    ? "bg-slate-900/82 border-slate-800"
    : "bg-white/92 border-white shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur";

  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const heading = darkMode ? "text-white" : "text-slate-900";
  const panel = darkMode ? "bg-slate-900/70 border-slate-800" : "bg-white/82 border-white";

  return (
    <div className={`min-h-screen ${bg}`}>
      <AppNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div className="px-3 pb-16 pt-28 sm:px-5 lg:px-6 2xl:px-10">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FaArrowLeft className="text-xs" />
                Back
              </button>

              <button
                type="button"
                onClick={toggleDarkMode}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon className="text-slate-700" />}
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>

            <button
              type="button"
              onClick={exportFullLibrary}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <FaDownload className="text-xs" />
              Export Full Library PDF
            </button>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={`relative overflow-hidden rounded-[32px] border p-6 md:p-8 xl:p-10 ${panel}`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.16),_transparent_30%)]" />
            <div className="relative grid gap-8 xl:grid-cols-[1.45fr_0.8fr]">
              <div>
                <div className="mb-4 flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700">
                    📚 Mental Health Library
                  </span>
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                    {CONDITIONS.length} topics · Free to read
                  </span>
                </div>

                <h1 className={`max-w-5xl text-4xl font-black leading-tight md:text-5xl 2xl:text-6xl ${heading}`}>
                  What are you{" "}
                  <HeroTypewriter
                    words={["feeling today?", "going through?", "curious about?", "trying to understand?"]}
                    darkMode={darkMode}
                  />
                </h1>

                <p className={`mt-5 max-w-3xl text-base leading-8 md:text-lg ${muted}`}>
                  This library covers 11 mental health topics — from everyday emotions to clinical conditions. Read symptoms, lived experiences, coping strategies, and know when to seek help.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {["😔 Feeling low?", "😰 Feeling anxious?", "😣 Stressed out?", "🆘 In crisis?"].map((label, i) => {
                    const targets = ["depression", "anxiety", "stress", "suicidal"];
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ y: -2, scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => {
                          setExpanded(targets[i]);
                          setActiveSection(targets[i], "overview");
                          setTimeout(() => {
                            document.getElementById(`condition-${targets[i]}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 100);
                        }}
                        className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                          darkMode
                            ? "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                            : "border border-slate-200 bg-white text-slate-700 shadow-sm hover:shadow-md hover:bg-slate-50"
                        }`}
                      >
                        {label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                <TopStat icon={FaBookOpen} label="Topics" value={CONDITIONS.length} darkMode={darkMode} />
                <TopStat icon={FaLeaf} label="Saved" value={savedItems.length} darkMode={darkMode} />
                <TopStat icon={FaCheckCircle} label="Categories" value={FILTERS.length - 1} darkMode={darkMode} />
              </div>
            </div>
          </motion.section>

          <section className="mt-8 grid gap-6 2xl:grid-cols-[320px_minmax(0,1fr)_360px]">
            <motion.aside
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="2xl:sticky 2xl:top-28 2xl:self-start"
            >
              <div className={`rounded-[26px] border p-5 ${card}`}>
                <div className="mb-4 flex items-center gap-2">
                  <div className={`rounded-full p-2 ${darkMode ? "bg-slate-800 text-sky-300" : "bg-sky-50 text-sky-600"}`}>
                    <FaFilter className="text-sm" />
                  </div>
                  <h2 className={`text-lg font-black ${heading}`}>Explore</h2>
                </div>

                <div className="relative">
                  <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${muted}`} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search topics..."
                    className={`w-full rounded-2xl border py-3 pl-11 pr-12 text-sm outline-none transition focus:ring-2 focus:ring-indigo-300 ${
                      darkMode
                        ? "border-slate-700 bg-slate-950 text-white placeholder-slate-500"
                        : "border-slate-200 bg-white text-slate-800 placeholder-slate-400"
                    }`}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 transition ${
                        darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  )}
                </div>

                <div className="mt-5">
                  <p className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${muted}`}>Filters</p>
                  <div className="flex flex-wrap gap-2">
                    {FILTERS.map((filter) => {
                      const active = activeFilter === filter;
                      return (
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          key={filter}
                          type="button"
                          onClick={() => setActiveFilter(filter)}
                          className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                            active
                              ? "bg-indigo-600 text-white shadow"
                              : darkMode
                              ? "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {filter} ({counts[filter]})
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <p className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${muted}`}>Sort</p>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none ${
                      darkMode
                        ? "border-slate-700 bg-slate-950 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${darkMode ? "border-slate-700 bg-slate-950 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </div>

                <button
                  type="button"
                  onClick={exportFullLibrary}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  <FaDownload className="text-xs" />
                  Export Full Library
                </button>
              </div>
            </motion.aside>

            <div>
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="mb-5">
                  <h2 className={`text-2xl font-black ${heading}`}>Quick Mental Health Tips</h2>
                  <p className={`mt-1 text-sm ${muted}`}>Small daily actions that support emotional balance.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {TIPS.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3, delay: index * 0.04 }}
                      viewport={{ once: true }}
                      className={`rounded-[22px] border p-5 ${card}`}
                    >
                      <div className="text-3xl">{tip.emoji}</div>
                      <p className={`mt-3 text-sm leading-6 ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                        {tip.tip}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              <div className="space-y-5">
                {filtered.map((item, index) => {
                  const Icon = item.icon;
                  const isOpen = expanded === item.id;
                  const isSaved = savedItems.includes(item.id);
                  const activeSection = getActiveSection(item.id);

                  return (
                    <motion.article
                      id={`condition-${item.id}`}
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.12 }}
                      transition={{ duration: 0.35, delay: index * 0.02 }}
                      className={`overflow-hidden rounded-[26px] border ${card} ${item.crisis ? "ring-1 ring-red-200" : ""}`}
                    >
                      <div className="p-5 md:p-6 xl:p-7">
                        <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
                          <div className="flex gap-4">
                            <motion.div
                              whileHover={{ scale: 1.05, rotate: 1 }}
                              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${item.color} text-2xl text-white shadow-lg`}
                            >
                              <Icon />
                            </motion.div>

                            <div>
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${item.tagColor}`}>
                                  {item.tag}
                                </span>
                                {item.crisis && (
                                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
                                    High Priority Topic
                                  </span>
                                )}
                                {isSaved && (
                                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${darkMode ? "bg-amber-900/40 text-amber-300" : "bg-amber-100 text-amber-700"}`}>
                                    Saved
                                  </span>
                                )}
                              </div>

                              <h2 className={`text-2xl font-black xl:text-3xl ${heading}`}>
                                {item.emoji} {item.label}
                              </h2>
                              <p className={`mt-2 max-w-5xl text-sm leading-7 xl:text-[15px] ${muted}`}>
                                {item.definition}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 2xl:max-w-[430px] 2xl:justify-end">
                            <button
                              type="button"
                              onClick={() => exportFullArticle(item)}
                              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                                darkMode
                                  ? "border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <FaDownload className="text-xs" />
                              Export Full Article
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleSaved(item.id)}
                              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                                darkMode
                                  ? "border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {isSaved ? <FaBookmark className="text-amber-500" /> : <FaRegBookmark />}
                              {isSaved ? "Saved" : "Save"}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setExpanded(isOpen ? null : item.id);
                                if (!isOpen) setActiveSection(item.id, getActiveSection(item.id));
                              }}
                              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                                isOpen
                                  ? "bg-indigo-600 text-white"
                                  : darkMode
                                  ? "border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {isOpen ? "Collapse" : "Read More"}
                              {isOpen ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                            </button>
                          </div>
                        </div>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className={`mt-6 border-t pt-6 ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                  <div className="flex flex-wrap gap-2">
                                    {Object.entries(SECTION_META).map(([key, meta]) => (
                                      <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        key={key}
                                        type="button"
                                        onClick={() => setActiveSection(item.id, key)}
                                        className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                                          activeSection === key
                                            ? "bg-indigo-600 text-white"
                                            : darkMode
                                            ? "border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                      >
                                        {meta.label}
                                      </motion.button>
                                    ))}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => exportArticleSection(item, activeSection)}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                                      darkMode
                                        ? "border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                  >
                                    <FaDownload className="text-xs" />
                                    Export This Section
                                  </button>
                                </div>

                                <div className="mt-5">
                                  <AnimatePresence mode="wait">
                                    <motion.div
                                      key={activeSection}
                                      initial={{ opacity: 0, y: 8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -8 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      {activeSection === "overview" && (
                                        <div className={`rounded-2xl p-5 text-sm leading-7 xl:text-[15px] ${darkMode ? "bg-slate-900/70 text-slate-200" : "bg-indigo-50 text-slate-700"}`}>
                                          {item.overview}
                                        </div>
                                      )}

                                      {activeSection === "impact" && (
                                        <div className={`rounded-2xl p-5 text-sm leading-7 xl:text-[15px] ${darkMode ? "bg-slate-900/70 text-slate-200" : "bg-sky-50 text-slate-700"}`}>
                                          {item.dailyImpact}
                                        </div>
                                      )}

                                      {activeSection === "symptoms" && (
                                        <ul className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                                          {item.symptoms.map((symptom, i) => (
                                            <li
                                              key={i}
                                              className={`rounded-2xl border p-4 text-sm leading-6 ${
                                                darkMode
                                                  ? "border-slate-800 bg-slate-900/70 text-slate-200"
                                                  : "border-slate-100 bg-slate-50 text-slate-700"
                                              }`}
                                            >
                                              <span className="mr-2 font-bold text-indigo-500">•</span>
                                              {symptom}
                                            </li>
                                          ))}
                                        </ul>
                                      )}

                                      {activeSection === "feels" && (
                                        <div className={`rounded-2xl border-l-4 border-indigo-500 p-5 text-sm leading-7 xl:text-[15px] ${darkMode ? "bg-slate-900/70 text-slate-200" : "bg-indigo-50 text-slate-700"}`}>
                                          {item.feels}
                                        </div>
                                      )}

                                      {activeSection === "coping" && (
                                        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                                          {item.coping.map((tip, i) => (
                                            <div
                                              key={i}
                                              className={`rounded-2xl p-4 text-sm leading-6 ${
                                                darkMode
                                                  ? "bg-emerald-950/20 text-slate-200"
                                                  : "bg-emerald-50 text-slate-700"
                                              }`}
                                            >
                                              <span className="mr-2 font-bold text-emerald-500">✓</span>
                                              {tip}
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {activeSection === "seek" && (
                                        <div className={`rounded-2xl border-l-4 p-5 ${item.crisis ? "border-red-500 bg-red-50" : "border-amber-400 bg-amber-50"}`}>
                                          <p className={`text-sm font-semibold leading-7 ${item.crisis ? "text-red-700" : "text-amber-800"}`}>
                                            {item.seek}
                                          </p>
                                        </div>
                                      )}
                                    </motion.div>
                                  </AnimatePresence>

                                  {item.related?.length > 0 && (
                                    <div className="mt-5">
                                      <p className={`mb-3 text-xs font-bold uppercase tracking-[0.18em] ${muted}`}>
                                        Related Topics
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {item.related.map((relatedId) => {
                                          const related = CONDITIONS.find((c) => c.id === relatedId);
                                          if (!related) return null;
                                          return (
                                            <motion.button
                                              whileHover={{ y: -1 }}
                                              whileTap={{ scale: 0.98 }}
                                              key={related.id}
                                              type="button"
                                              onClick={() => openRelated(related.id)}
                                              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                                                darkMode
                                                  ? "border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                                                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                              }`}
                                            >
                                              {related.emoji} {related.label}
                                            </motion.button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>

            <motion.aside
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-6 2xl:sticky 2xl:top-28 2xl:self-start"
            >
              <div className={`rounded-[24px] border p-5 ${card}`}>
                <p className={`text-sm font-bold uppercase tracking-[0.18em] ${muted}`}>
                  Tip of the Day
                </p>
                <div className="mt-3 text-3xl">{featuredTip.emoji}</div>
                <p className={`mt-3 text-sm leading-7 ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                  {featuredTip.tip}
                </p>
              </div>

              <div className={`rounded-[24px] border p-5 ${card}`}>
                <div className="flex items-center gap-2">
                  <div className={`rounded-full p-2 ${darkMode ? "bg-slate-800 text-cyan-300" : "bg-cyan-50 text-cyan-600"}`}>
                    <FaWind className="text-sm" />
                  </div>
                  <h3 className={`text-lg font-black ${heading}`}>Breathing Exercise</h3>
                </div>
                <p className={`mt-2 text-sm leading-6 ${muted}`}>
                  Use this guided rhythm when stress or panic feels physically intense.
                </p>

                <div className="mt-5 flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale:
                        isBreathing && breathingPhase === "Inhale"
                          ? 1.14
                          : isBreathing && breathingPhase === "Exhale"
                          ? 0.92
                          : 1,
                    }}
                    transition={{
                      duration:
                        breathingPhase === "Inhale"
                          ? 4
                          : breathingPhase === "Exhale"
                          ? 6
                          : 2,
                      ease: "easeInOut",
                    }}
                    className={`flex h-40 w-40 items-center justify-center rounded-full text-center shadow-inner ${
                      darkMode
                        ? "bg-gradient-to-br from-cyan-900 to-indigo-900 text-white"
                        : "bg-gradient-to-br from-cyan-100 to-indigo-100 text-slate-800"
                    }`}
                  >
                    <div>
                      <p className="text-lg font-black">{breathingPhase}</p>
                      <p className={`mt-1 text-xs ${muted}`}>Cycle {breathingCycle}</p>
                    </div>
                  </motion.div>

                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBreathingCycle(0);
                        setBreathingPhase("Inhale");
                        setIsBreathing(true);
                      }}
                      className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
                    >
                      {isBreathing ? "Restart" : "Start"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsBreathing(false);
                        setBreathingPhase("Ready");
                        setBreathingCycle(0);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                        darkMode
                          ? "border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Reset
                    </button>
                  </div>

                  <p className={`mt-4 text-center text-xs leading-6 ${muted}`}>
                    Rhythm: inhale 4s, hold 4s, exhale 6s, hold 2s.
                  </p>
                </div>
              </div>

              <div className={`rounded-[24px] border p-5 ${card}`}>
                <h3 className={`text-lg font-black ${heading}`}>Saved Topics</h3>
                {savedLoading ? (
                  <p className={`mt-3 text-sm ${muted}`}>Loading...</p>
                ) : savedItems.length === 0 ? (
                  <p className={`mt-3 text-sm leading-7 ${muted}`}>
                    {isLoggedIn ? "Save useful topics here so they are easier to revisit later." : "Log in to sync saved topics across devices."}
                  </p>
                ) : (
                  <div className="mt-4 space-y-2">
                    {CONDITIONS.filter((item) => savedItems.includes(item.id)).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openRelated(item.id)}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                          darkMode
                            ? "bg-slate-950 text-slate-200 hover:bg-slate-800"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>
                          {item.emoji} {item.label}
                        </span>
                        <FaChevronDown className="text-[10px]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.aside>
          </section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mt-10 rounded-[24px] border p-5 md:p-6 ${card}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className={`text-2xl font-black ${heading}`}>Myths vs Facts</h2>
                <p className={`mt-2 text-sm ${muted}`}>
                  Common misconceptions can delay understanding and support.
                </p>
              </div>
              <div className="flex gap-2">
                {MYTHS_FACTS.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setMythIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      mythIndex === index ? "bg-indigo-600" : darkMode ? "bg-slate-700" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mythIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="mt-5 grid gap-4 md:grid-cols-2"
              >
                <div className={`rounded-2xl p-5 ${darkMode ? "bg-rose-950/20" : "bg-rose-50"}`}>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-500">Myth</p>
                  <p className={`mt-3 text-sm leading-7 ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                    {MYTHS_FACTS[mythIndex].myth}
                  </p>
                </div>

                <div className={`rounded-2xl p-5 ${darkMode ? "bg-emerald-950/20" : "bg-emerald-50"}`}>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">Fact</p>
                  <p className={`mt-3 text-sm leading-7 ${darkMode ? "text-slate-200" : "text-slate-700"}`}>
                    {MYTHS_FACTS[mythIndex].fact}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.section>

          <p className={`mt-10 text-center text-xs leading-6 ${muted}`}>
            This library is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
            Always consult a qualified mental health professional for personal guidance.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-700"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeroTypewriter({ words, darkMode }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const current = words[wordIndex];
    let timeout;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === current.length) {
      // Last word — stop here
      if (wordIndex === words.length - 1) {
        setDone(true);
        return;
      }
      timeout = setTimeout(() => setDeleting(true), 1400);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIndex((prev) => prev + 1);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIndex, done, words]);

  return (
    <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
      {" "}{displayed}
      {!done && <span className={`animate-pulse ${darkMode ? "text-indigo-400" : "text-indigo-500"}`}>|</span>}
    </span>
  );
}

function TopStat({ icon: Icon, label, value, darkMode }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`rounded-2xl border px-4 py-4 ${
        darkMode ? "border-slate-800 bg-slate-950/80" : "border-white bg-white/85"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            darkMode ? "bg-slate-800 text-slate-200" : "bg-indigo-50 text-indigo-600"
          }`}
        >
          <Icon className="text-sm" />
        </div>
        <p className={`${darkMode ? "text-slate-400" : "text-slate-500"} text-xs font-bold uppercase tracking-[0.18em]`}>
          {label}
        </p>
      </div>
      <p className={`mt-3 text-2xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>{value}</p>
    </motion.div>
  );
}
