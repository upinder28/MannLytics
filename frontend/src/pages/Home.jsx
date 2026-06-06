import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppNavbar from "../Components/AppNavbar";

import {
  FaArrowRight,
  FaBrain,
  FaChartBar,
  FaCheckCircle,
  FaChevronDown,
  FaLock,
  FaRobot,
  FaShieldAlt,
  FaUserFriends,
} from "react-icons/fa";

import picbenifits from "../assets/Pic Benifits.jpeg";
import picdetect from "../assets/Pic Detect.jpeg";
import picworking from "../assets/assesment.jpeg";
import picaipowered from "../assets/visual display.png";
import pic from "../assets/logo pic.png";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Support", href: "/support" },
  { label: "Dashboard", href: "/dashboard" },
];

const featureCards = [
  {
    title: "Emotion Detection",
    eyebrow: "Core intelligence",
    desc: "Detect emotional tone and patterns from your written thoughts. Understand stress, anxiety, and mood signals with clarity.",
    detail: "Turn journal entries into meaningful emotional signals.",
    points: [
      "Reads emotional tone and deeper context",
      "Highlights stress, sadness, and anxiety signals",
    ],
    icon: FaBrain,
    color: "from-indigo-500 via-blue-500 to-cyan-400",
    route: "/dashboard",
  },
  {
    title: "AI Assistant",
    eyebrow: "Interactive support",
    desc: "Chat with an AI companion for real-time emotional guidance. Get supportive responses and gentle next-step suggestions.",
    detail: "Helpful support while you reflect in real time.",
    points: [
      "Conversational and easy to use",
      "Delivers feedback without feeling overwhelming",
    ],
    icon: FaRobot,
    color: "from-indigo-500 via-blue-500 to-cyan-400",
  },
  {
    title: "Mental Health Library",
    eyebrow: "Knowledge hub",
    desc: "Explore curated articles and guides on anxiety, depression, stress, and emotional wellbeing — all in one trusted place.",
    detail: "Learn, understand, and grow with trusted mental health content.",
    points: [
      "Browse topics like anxiety, depression, and stress",
      "Access trusted guides and self-help resources",
    ],
    icon: FaChartBar,
    color: "from-indigo-500 via-blue-500 to-cyan-400",
  },
  {
    title: "Support Guidance",
    eyebrow: "Next-step support",
    desc: "Find the right support path when you need it most. Explore trusted helplines, therapists, and guided wellness options.",
    detail: "Connect emotional insight with trusted support choices.",
    points: [
      "Explore therapist and helpline options",
      "Feel guided toward the right support path",
    ],
    icon: FaUserFriends,
    color: "from-indigo-500 via-blue-500 to-cyan-400",
    route: "/support",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Write What's on Your Mind",
    text: "Enter your thoughts, feelings, or daily reflections in natural language — no structure needed.",
  },
  {
    step: "02",
    title: "AI Analyzes Your Emotions",
    text: "The AI reads your text and detects emotional tone, intensity, stress signals, and mood patterns.",
  },
  {
    step: "03",
    title: "Receive Your Emotional Insights",
    text: "Get a clear emotional summary with risk level, mood breakdown, and helpful next-step guidance.",
  },
];

const benefits = [
  "Write freely and get instant emotional analysis in seconds",
  "Identify stress, anxiety, and mood patterns over time",
  "Your data stays private — no sharing, no tracking",
  "Visual progress charts help you see your wellness journey",
  "Access therapist links and helplines directly from the platform",
];

const faqItems = [
  {
    question: "How does Mannlytics detect emotions?",
    answer:
      "Mannlytics analyzes written text using natural language processing and AI models to understand emotional tone, intensity, and context.",
  },
  {
    question: "Is my personal data secure?",
    answer:
      "Yes, the platform is designed with a privacy-conscious approach so users feel safer while reflecting on sensitive emotions and experiences.",
  },
  {
    question: "Can Mannlytics replace a therapist or doctor?",
    answer:
      "No. Mannlytics is a supportive emotional-awareness tool and not a substitute for professional medical or mental health care.",
  },
  {
    question: "Who can use this platform?",
    answer:
      "Students, professionals, and anyone interested in understanding emotional well-being through written reflection can use the platform.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [currentUser, setCurrentUser] = useState(() =>
    sessionStorage.getItem("currentUser")
  );

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  useEffect(() => {
    const userEmail = sessionStorage.getItem("currentUser");
    setCurrentUser(userEmail);

    const handleLogout = () => {
      setCurrentUser(null);
    };
    window.addEventListener("userLogout", handleLogout);
    return () => window.removeEventListener("userLogout", handleLogout);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleProtectedRoute = (path) => {
    const currentToken = sessionStorage.getItem("token");

    if (!currentToken) {
      navigate("/login", { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  const revealClass = (id) =>
    visibleSections[id]
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-8";

  const pageBg = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-100 text-slate-800";

  const softCardBg = darkMode
    ? "bg-gray-800/95 border-gray-700 text-white"
    : "bg-white/80 border-white/80 text-slate-800";
  const mutedText = darkMode ? "text-gray-300" : "text-slate-600";
  const subtleText = darkMode ? "text-gray-400" : "text-slate-500";
  const headingText = darkMode ? "text-white" : "text-slate-900";
  const pillBg = darkMode
    ? "bg-gray-800 text-cyan-300 border-gray-700"
    : "bg-blue-100/80 text-blue-700 border-blue-200";
  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden pt-20 transition-colors duration-500 ${pageBg}`}
    >
      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-indigo-400/50 animate-fade-in-up"
        >
          ↑
        </button>
      )}

      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute left-[-8%] top-[-4%] h-72 w-72 animate-pulse rounded-full blur-3xl ${
            darkMode ? "bg-indigo-900/30" : "bg-blue-300/35"
          }`}
        />
        <div
          className={`absolute right-[-8%] top-[10%] h-96 w-96 animate-pulse rounded-full blur-3xl ${
            darkMode ? "bg-cyan-900/20" : "bg-indigo-300/30"
          }`}
        />
        <div
          className={`absolute bottom-[-12%] left-[18%] h-80 w-80 animate-pulse rounded-full blur-3xl ${
            darkMode ? "bg-sky-900/20" : "bg-cyan-200/30"
          }`}
        />
      </div>

      <AppNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} showGetStarted={true} />



      <section
        id="home"
        data-reveal
        className={`grid w-full gap-8 px-4 py-8 transition-all duration-1000 md:grid-cols-2 md:px-10 md:py-14 xl:px-16 2xl:px-24 ${revealClass(
          "home"
        )}`}
      >
        <div className="flex flex-col justify-center">
          <div
            className={`mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-sm animate-fade-in-down ${pillBg}`}
          >
            <FaShieldAlt />
            Trusted AI support for emotional insight
          </div>

          <h1
            className={`max-w-2xl text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl ${headingText}`}
          >
            <span className="inline-block animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
              Your Mind Speaks Every Day.
            </span>
            <span className="block animated-gradient-text pb-2 animate-fade-in-up" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
              Mannlytics Helps You Listen.
            </span>
          </h1>

          <p className={`mt-5 max-w-lg text-base leading-7 animate-fade-in-up ${mutedText}`} style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
            Just write what's on your mind. Mannlytics analyzes your emotions, detects patterns, and guides you toward better mental wellbeing.
          </p>

          <div className="mt-8 flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
            <div className="flex flex-wrap gap-4">
            {!currentUser ? (
              <>
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 px-7 py-3.5 font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-[1.02] cta-glow"
                >
                  Start Free
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className={`rounded-full border px-7 py-3.5 font-medium transition duration-300 hover:-translate-y-1 ${
                    darkMode
                      ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                      : "border-indigo-200 bg-white/80 text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={() => handleProtectedRoute("/dashboard")}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 px-7 py-3.5 font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-[1.02] cta-glow"
              >
                Go to Dashboard
                <FaArrowRight className="transition group-hover:translate-x-1" />
              </button>
            )}
            </div>
            <div>
            <button
              onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })}
              className={`rounded-full border px-7 py-3.5 font-medium transition duration-300 hover:-translate-y-1 ${
                darkMode
                  ? "border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
                  : "border-indigo-200 bg-white/80 text-indigo-700 hover:bg-indigo-50"
              }`}
            >
              See How It Works ↓
            </button>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-2xl pt-16">
            <div className="absolute right-8 top-0 z-20 block">
              <div
                className={`flex items-center gap-2 rounded-full px-4 py-2 shadow-xl animate-[float_1.8s_ease-in-out_infinite] ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white/85 text-slate-700"
                }`}
              >
                <FaLock className="text-indigo-600" />
                <span className="text-sm font-medium">Private Session</span>
              </div>
            </div>

            <div
              className={`absolute -inset-4 top-12 rounded-[2.5rem] blur-2xl ${
                darkMode
                  ? "bg-gradient-to-r from-indigo-900/30 via-cyan-900/20 to-sky-900/20"
                  : "bg-gradient-to-r from-indigo-200/50 via-blue-200/40 to-cyan-200/50"
              }`}
            />

            <div
              className={`relative overflow-hidden rounded-[2rem] border p-3 shadow-[0_30px_80px_rgba(99,102,241,0.20)] animate-float ${
                darkMode ? "border-gray-700 bg-gray-800/70" : "border-white/80 bg-white/70"
              }`}
            >
              <img
                src={picdetect}
                alt="AI mental health analysis"
                className="h-[220px] sm:h-[320px] md:h-[480px] w-full rounded-[1.5rem] object-cover transition duration-700 hover:scale-105"
              />

              <div
                className={`absolute inset-x-6 bottom-6 rounded-2xl border p-5 shadow-lg ${
                  darkMode
                    ? "border-gray-700 bg-gray-900/85 text-white"
                    : "border-blue-100 bg-white/85 text-slate-800"
                }`}
              >
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-500">
                  Platform Insight
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Reflect. Understand. Feel better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section
        id="features"
        data-reveal
        className={`w-full px-6 py-10 transition-all duration-1000 md:px-10 xl:px-16 2xl:px-24 ${revealClass(
          "features"
        )}`}
      >
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <h2 className={`text-3xl font-bold md:text-4xl ${headingText}`}>
            Smart tools built to turn your thoughts into meaningful emotional insights
          </h2>
          <p className={`mt-5 leading-7 ${mutedText}`}>
            From your first journal entry to long-term progress — these features are built to support every step of your wellness journey.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {featureCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`group relative overflow-hidden rounded-[2rem] border p-5 shadow-[0_14px_38px_rgba(99,102,241,0.10)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(99,102,241,0.18)] ${softCardBg}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-[0.06]`} />
                <div className={`absolute right-0 top-0 h-36 w-36 translate-x-1/4 -translate-y-1/4 rounded-full blur-3xl ${darkMode ? "bg-white/5" : "bg-white/60"}`} />

                <div className="relative">
                  <div className="flex items-center mb-5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                      darkMode ? "border-white/10 bg-white/5 text-cyan-300" : "border-white/70 bg-white/80 text-slate-600"
                    }`}>
                      {item.eyebrow}
                    </span>
                  </div>

                  <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-3xl text-white shadow-lg`}>
                    <Icon />
                  </div>

                  <h3 className={`text-xl font-semibold ${headingText}`}>{item.title}</h3>
                  <p className={`mt-3 text-base leading-7 ${mutedText}`}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>



      <section
  id="ai-detection"
  data-reveal
  className={`grid w-full items-center gap-14 px-6 py-20 transition-all duration-1000 md:grid-cols-2 md:px-10 xl:px-16 2xl:px-24 ${revealClass(
    "ai-detection"
  )}`}
>
  {/* IMAGE SIDE - LEFT */}
  <div
    className={`overflow-hidden rounded-[2rem] border p-1.5 shadow-[0_25px_60px_rgba(99,102,241,0.16)] max-w-3xl mx-auto w-full ${
      darkMode ? "border-gray-700 bg-gray-800/75" : "border-white/80 bg-white/75"
    }`}
  >
    <img
      src={picaipowered}
      alt="AI powered mental health detection"
      className="w-full h-auto object-contain rounded-[1.5rem]"
    />
  </div>

  {/* CONTENT SIDE - RIGHT */}
  <div>
    <h2 className={`text-4xl font-bold md:text-5xl ${headingText}`}>
      See Your Emotions in Real Time
    </h2>
    <p className={`mt-5 text-base leading-7 ${mutedText}`}>
      As soon as you write, Mannlytics processes your text and displays your emotional state, risk level, and mood intensity — all in one clear view.
    </p>
    <div className="mt-8 space-y-3">
      {[
        "Emotion Pulse card detects joy, sadness, stress, and anxiety",
        "Risk Level score shows emotional intensity from low to high",
        "Results update instantly after every journal entry",
        "Clean visual layout makes insights easy to read and act on",
      ].map((point) => (
        <div
          key={point}
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${softCardBg}`}
        >
          <FaCheckCircle className="mt-1 shrink-0 text-indigo-500" />
          <p className={`text-sm ${mutedText}`}>{point}</p>
        </div>
      ))}
    </div>
  </div>
</section>



      <section
        id="how-ai-works"
        data-reveal
        className={`grid w-full items-center gap-14 px-6 py-20 transition-all duration-1000 md:grid-cols-2 md:px-10 xl:px-16 2xl:px-24 ${revealClass(
          "how-ai-works"
        )}`}
      >
        <div>
          <h2 className={`text-4xl font-bold md:text-5xl ${headingText}`}>
            From Your Words to Emotional Clarity — in 3 Simple Steps
          </h2>
          <p className={`mt-6 text-lg leading-8 ${mutedText}`}>
            From a single journal entry to deep emotional awareness — it takes just seconds.
          </p>

          <div className="mt-10 space-y-5">
            {processSteps.map((item) => (
              <div
                key={item.step}
                className={`flex gap-4 rounded-[1.6rem] border p-5 shadow-sm transition hover:-translate-y-1 ${softCardBg}`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 font-bold text-white shadow-md">
                  {item.step}
                </div>

                <div>
                  <h3 className={`text-lg font-semibold ${headingText}`}>{item.title}</h3>
                  <p className={`mt-2 leading-7 ${mutedText}`}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            className={`overflow-hidden rounded-[2rem] border p-3 shadow-[0_25px_60px_rgba(99,102,241,0.16)] w-full ${
              darkMode ? "border-gray-700 bg-gray-800/75" : "border-white/80 bg-white/75"
            }`}
          >
            <img
              src={picworking}
              alt="How Mannlytics works"
              className="w-full h-auto rounded-[1.5rem] object-contain transition duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      <section
        id="faq"
        data-reveal
        className={`w-full px-6 py-10 transition-all duration-1000 md:px-10 xl:px-16 2xl:px-24 ${revealClass("faq")}`}
      >
        {/* Header */}
        <div className="mb-14 flex flex-col items-center text-center">
          <h2 className={`max-w-2xl text-4xl font-bold md:text-5xl ${headingText}`}>
            Common questions about Mannlytics
          </h2>
          <p className={`mt-5 max-w-xl text-lg leading-8 ${mutedText}`}>
            Everything you need to know before you start — answered simply and honestly.
          </p>
        </div>

        {/* Two-column FAQ grid */}
        <div className="flex flex-col gap-5">
          {faqItems.map((item, index) => (
            <div
              key={item.question}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
              className={`group cursor-pointer overflow-hidden rounded-[1.8rem] border shadow-[0_8px_30px_rgba(99,102,241,0.08)] transition-all duration-300 hover:shadow-[0_14px_40px_rgba(99,102,241,0.15)] hover:-translate-y-1 ${
                openFaq === index
                  ? darkMode
                    ? "border-indigo-700 bg-gray-800"
                    : "border-indigo-300 bg-white"
                  : softCardBg
              }`}
            >
              {/* Question row */}
              <div className="flex items-start justify-between gap-4 px-7 py-6">
                <div className="flex items-start gap-4">
                  <span className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    openFaq === index
                      ? "bg-indigo-600 text-white"
                      : darkMode
                      ? "bg-gray-700 text-indigo-400"
                      : "bg-indigo-50 text-indigo-600"
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`text-lg font-semibold leading-snug md:text-2xl ${headingText}`}>
                    {item.question}
                  </span>
                </div>
                <FaChevronDown
                  className={`mt-1 flex-shrink-0 text-indigo-500 transition-transform duration-300 ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Answer */}
              {openFaq === index && (
                <div className={`border-t px-7 pb-6 pt-5 text-lg leading-8 md:text-xl ${
                  darkMode ? "border-gray-700 text-gray-300" : "border-indigo-100 text-slate-600"
                }`}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section
        id="benefits"
        data-reveal
        className={`grid w-full items-center gap-14 px-6 py-20 transition-all duration-1000 md:grid-cols-2 md:px-10 xl:px-16 2xl:px-24 ${revealClass(
          "benefits"
        )}`}
      >
        <div
          className={`overflow-hidden rounded-[2rem] border p-3 shadow-[0_25px_60px_rgba(99,102,241,0.16)] ${
            darkMode ? "border-gray-700 bg-gray-800/75" : "border-white/80 bg-white/75"
          }`}
        >
          <img
            src={picbenifits}
            alt="Benefits of Mannlytics"
            className="h-[300px] md:h-[510px] w-full rounded-[1.5rem] object-cover transition duration-700 hover:scale-105"
          />
        </div>

        <div>
          <h2 className={`text-4xl font-bold md:text-5xl ${headingText}`}>
            Built for people who want to understand themselves better
          </h2>
          <p className={`mt-6 text-lg leading-8 ${mutedText}`}>
            Mannlytics is private, fast, and designed to feel safe — so you can reflect honestly without feeling judged or overwhelmed.
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((item) => (
              <div
                key={item}
                className={`flex items-start gap-3 rounded-2xl border p-4 shadow-sm ${softCardBg}`}
              >
                <FaCheckCircle className="mt-1 text-indigo-500" />
                <p className={mutedText}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-6 pb-8 md:px-10 xl:px-16 2xl:px-24">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/60 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 p-8 shadow-2xl md:p-12">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-10 left-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Ready to begin?</p>
              <h3 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                Start understanding yourself better today
              </h3>
              <p className="mt-4 max-w-2xl text-blue-50">
                Write your first journal entry and let Mannlytics help you make sense of how you feel.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              {!currentUser ? (
                <Link to="/signup" className="rounded-full bg-white px-6 py-3 font-semibold text-indigo-600 shadow-lg transition hover:scale-105">
                  Get Started Free
                </Link>
              ) : (
                <button onClick={() => handleProtectedRoute("/dashboard")} className="rounded-full bg-white px-6 py-3 font-semibold text-indigo-600 shadow-lg transition hover:scale-105">
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
        <p className={`mt-6 text-center text-sm ${subtleText}`}>
          Mannlytics is a self-awareness tool and not a substitute for professional medical advice or therapy.
        </p>
      </section>

      <footer
        id="footer"
        className={`mt-10 border-t px-6 py-14 md:px-10 xl:px-16 2xl:px-24 ${
          darkMode ? "border-gray-700 bg-gray-900" : "border-indigo-100 bg-white/60"
        }`}
      >
        <div className="grid w-full gap-12 md:grid-cols-3">
          <div>
            <a href="#home" className="flex items-center gap-3">
              <img
                src={pic}
                alt="Mannlytics Logo"
                className="h-14 w-14 rounded-2xl object-contain shadow-sm"
              />
              <div>
                <h3 className="text-2xl font-bold text-indigo-600">Mannlytics</h3>
                <p className={`text-sm ${subtleText}`}>
                  AI-Powered Emotional Intelligence
                </p>
              </div>
            </a>

            <p className={`mt-5 leading-7 pl-4 ${mutedText}`}>
              Your personal space to reflect, understand emotions, and take care of your mental wellbeing.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <h4 className={`text-lg font-semibold ${headingText}`}>Quick Links</h4>
            <div className="mt-5 flex flex-col gap-3 items-center">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() =>
                    link.label === "Dashboard"
                      ? handleProtectedRoute(link.href)
                      : link.href.startsWith("/")
                      ? navigate(link.href)
                      : document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" })
                  }
                  className={`w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-left text-sm font-medium transition-all duration-200 hover:underline ${
                    darkMode ? "text-gray-500 hover:text-indigo-400" : "text-slate-400 hover:text-indigo-600"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <h4 className={`text-lg font-semibold ${headingText}`}>Contact</h4>
            <div className={`mt-5 space-y-3 text-center ${mutedText}`}>
              <p>
                Email:{" "}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=support.mhealth@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline transition hover:text-indigo-700"
                >
                  support.mhealth@gmail.com
                </a>
              </p>

              <p>India</p>
            </div>
          </div>
        </div>

        <div
          className={`mt-12 border-t pt-6 text-center text-sm ${
            darkMode ? "border-gray-700 text-gray-400" : "border-indigo-100 text-slate-500"
          }`}
        >
          © {new Date().getFullYear()} Mannlytics. All rights reserved.
          <br />
          Developed by Upinder Kaur, Yashika Taneja 
        </div>
      </footer>

      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes cta-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5), 0 8px 30px rgba(99,102,241,0.35); }
          50% { box-shadow: 0 0 0 10px rgba(99,102,241,0), 0 8px 30px rgba(99,102,241,0.35); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease both;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s ease both;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .cta-glow {
          animation: cta-pulse 2.5s ease-in-out infinite;
        }
        .animated-gradient-text {
          background: linear-gradient(270deg, #6366f1, #3b82f6, #06b6d4, #6366f1);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 4s ease infinite;
        }

      `}</style>
    </div>
  );
}
