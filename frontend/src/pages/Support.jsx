import supportImg from "../assets/support.jpeg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../Components/AppNavbar";
import { FaGlobe, FaLinkedin, FaPhone, FaExternalLinkAlt, FaShieldAlt, FaArrowRight } from "react-icons/fa";

const supportHelplines = [
  {
    id: 1,
    title: "Tele-MANAS",
    number: "14416 / 1800-891-4416",
    callLink: "tel:14416",
    website: "https://telemanas.mohfw.gov.in/home",
    description: "Government mental health support for stress, anxiety, emotional distress, and crisis listening.",
    meta: "24x7 support • National service",
  },
  {
    id: 2,
    title: "KIRAN Mental Health Helpline",
    number: "1800-599-0019",
    callLink: "tel:18005990019",
    website: "https://nimhr.ac.in/",
    description: "National toll-free mental health helpline with multilingual support and accessible guidance.",
    meta: "24x7 support • Multilingual",
  },
  {
    id: 3,
    title: "Vandrevala Foundation",
    number: "99996-66555",
    callLink: "tel:9999666555",
    website: "https://www.vandrevalafoundation.com/",
    description: "Emotional support and crisis intervention through trained volunteers and support services.",
    meta: "24x7 support • Crisis assistance",
  },
];

const counselingCards = [
  {
    id: "SA",
    name: "Surbhi Anand",
    specialty: "Therapist, MindPeers",
    desc: "Specializes in stress, anxiety, and workplace mental health with a compassionate approach.",
    initials: "SA",
    profileLink: "https://www.mindpeers.co/surbhi-anand-0007",
    website: "https://www.mindpeers.co/",
    linkedin: "https://www.linkedin.com/company/mindpeersco/",
  },
  {
    id: "RC",
    name: "Rohan Chandak",
    specialty: "Therapist, MindPeers",
    desc: "Focuses on emotional resilience, relationship issues, and personal growth through therapy.",
    initials: "RC",
    profileLink: "https://www.mindpeers.co/rohan-0060",
    website: "https://www.mindpeers.co/",
    linkedin: "https://www.linkedin.com/company/mindpeersco/",
  },
  {
    id: "NK",
    name: "Dr. Nisha Khanna",
    specialty: "Psychologist / Counselling Psychologist",
    desc: "Expert in couples counseling, family therapy, and managing anxiety and depression.",
    initials: "NK",
    profileLink: "https://www.practo.com/gurgaon/doctor/nisha-khanna-1-psychiatrist?no_app_promo=true",
    website: "https://www.practo.com/",
    linkedin: "https://my.linkedin.com/company/practo-technologies-pvt-ltd",
  },
  {
    id: "SB",
    name: "Ms. Subhra Banerjee Paul",
    specialty: "Psychologist / Rehabilitation Therapist",
    desc: "Specializes in rehabilitation, trauma recovery, and cognitive behavioral therapy.",
    initials: "SB",
    profileLink: "https://www.practo.com/kolkata/therapist/subhra-banerjee-paul",
    website: "https://www.practo.com/",
    linkedin: "https://my.linkedin.com/company/practo-technologies-pvt-ltd",
  },
  {
    id: "SK",
    name: "Dr. Sebin S Kottaram",
    specialty: "Psychologist",
    desc: "Works with youth, adults, and families on emotional, behavioral, and online counseling needs.",
    initials: "SK",
    profileLink: "https://www.practo.com/kottayam/doctor/sebin-s-kottaram-psychologist",
    website: "https://www.practo.com/",
    linkedin: "https://my.linkedin.com/company/practo-technologies-pvt-ltd",
  },
  {
    id: "FR",
    name: "Dr. Finita Glory Roy",
    specialty: "Therapist / Adult Counselling",
    desc: "Provides adult counseling with focus on grief, life transitions, and emotional well-being.",
    initials: "FR",
    profileLink: "https://www.practo.com/chennai/therapist/finita-glory-roy-psychologist",
    website: "https://www.practo.com/",
    linkedin: "https://my.linkedin.com/company/practo-technologies-pvt-ltd",
  },
];

export default function Support() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("darkMode") === "true"; } catch { return false; }
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // fix 1 — scroll to top button
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fix 5 — scroll reveal
  useEffect(() => {
    const sections = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.12 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const revealClass = (id) =>
    visibleSections[id] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";

  const softCardBg = darkMode
    ? "bg-gray-800/95 border-gray-700 text-white"
    : "bg-white/90 border-white/80 text-slate-800";
  const mutedText = darkMode ? "text-gray-300" : "text-slate-600";
  const headingText = darkMode ? "text-white" : "text-slate-900";
  const pageBg = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-100 text-slate-800";

  return (
    <div className={`min-h-screen overflow-y-auto w-full overflow-x-hidden pt-24 ${pageBg}`}>

      {/* fix 1 — scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg transition-all duration-300 hover:scale-110"
        >
          ↑
        </button>
      )}

      {/* Background ambient blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute left-[-8%] top-[-4%] h-72 w-72 animate-pulse rounded-full blur-3xl ${darkMode ? "bg-indigo-900/30" : "bg-blue-300/35"}`} />
        <div className={`absolute right-[-8%] top-[10%] h-96 w-96 animate-pulse rounded-full blur-3xl ${darkMode ? "bg-cyan-900/20" : "bg-indigo-300/30"}`} />
        <div className={`absolute bottom-[-12%] left-[18%] h-80 w-80 animate-pulse rounded-full blur-3xl ${darkMode ? "bg-sky-900/20" : "bg-cyan-200/30"}`} />
      </div>

      <AppNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Hero */}
      <section
        id="hero"
        data-reveal
        className={`w-full px-6 py-14 md:px-12 xl:px-20 2xl:px-32 transition-all duration-1000 ${revealClass("hero")}`}
      >
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <h1 className={`text-4xl font-bold leading-tight md:text-5xl ${headingText}`}>
              Mental Health Support & Resources
            </h1>
            <p className={`mt-6 text-lg leading-8 ${mutedText}`}>
              Some days feel heavier than others, and that's completely okay. Whether you need someone to listen or professional guidance — verified helplines and trusted counselors are here, ready to support you every step of the way.
            </p>
          </div>

          {/* Right — image */}
          <div className="relative flex items-center justify-center">
            <div className={`absolute -left-5 top-8 h-24 w-24 rounded-full blur-2xl ${darkMode ? "bg-indigo-900/25" : "bg-blue-200/50"}`} />
            <div className={`relative w-[75%] rounded-[1.8rem] border p-[6px] shadow-[0_25px_60px_rgba(99,102,241,0.16)] animate-float ${darkMode ? "border-gray-700 bg-gray-800/75" : "border-white/80 bg-white/75"}`}>
              <div className="overflow-hidden rounded-[1.4rem]">
                <img
                  src={supportImg}
                  alt="A person receiving mental wellness support and guidance"
                  className="w-full h-auto block transition duration-700 hover:scale-105"
                  style={{ transform: "scaleX(-1) scale(1.09)", transformOrigin: "center center" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Helplines */}
      <section
        id="helplines"
        data-reveal
        className={`w-full px-6 py-6 md:px-12 xl:px-20 2xl:px-32 transition-all duration-1000 ${revealClass("helplines")}`}
      >
        <div className="mb-8">
          <h2 className={`text-3xl font-bold ${headingText}`}>Verified Mental Health Helplines</h2>
          <p className={`mt-2 text-base ${mutedText}`}>Free, confidential, and available 24×7.</p>
        </div>

        {/* fix 3 — md:grid-cols-3 so all 3 cards sit in one row */}
        <div className="grid gap-6 md:grid-cols-3">
          {supportHelplines.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col rounded-2xl border p-6 shadow-[0_8px_30px_rgba(99,102,241,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(99,102,241,0.16)] ${softCardBg}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className={`text-lg font-bold ${headingText}`}>{item.title}</h3>
                  <p className="mt-1 text-xs font-medium text-indigo-500">{item.meta}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${darkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-50 text-indigo-600"}`}>
                  Verified
                </span>
              </div>
              <p className={`mt-4 flex-1 text-sm leading-7 ${mutedText}`}>{item.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={item.callLink}
                  aria-label={`Call ${item.title} at ${item.number}`}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 px-4 py-2 text-xs font-semibold text-white shadow transition hover:scale-105"
                >
                  <FaPhone className="text-[10px]" /> {item.number}
                </a>
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition ${
                    darkMode ? "border-gray-600 bg-gray-700 text-white hover:bg-gray-600" : "border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  <FaExternalLinkAlt className="text-[10px]" /> Visit Website
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Counseling Cards */}
      <section
        id="counseling"
        data-reveal
        className={`w-full px-6 py-12 md:px-12 xl:px-20 2xl:px-32 transition-all duration-1000 ${revealClass("counseling")}`}
      >
        <div className="mb-8">
          <h2 className={`text-3xl font-bold ${headingText}`}>Professional Counselors & Therapists</h2>
          <p className={`mt-2 text-base ${mutedText}`}>
            Trusted therapists and counselors, here whenever you're ready to talk.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {counselingCards.map((item, index) => (
            <div
              key={item.id}
              className={`flex flex-col rounded-2xl border p-6 shadow-[0_8px_30px_rgba(99,102,241,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(99,102,241,0.16)] ${softCardBg}`}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 text-base font-bold text-white shadow-md">
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <h4 className={`truncate text-base font-bold ${headingText}`}>{item.name}</h4>
                  <p className="mt-0.5 text-xs font-medium text-indigo-500">{item.specialty}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white" : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <FaGlobe /> Website
                </a>
                <a
                  href={item.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white" : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  <FaLinkedin /> LinkedIn
                </a>
              </div>

              <p className={`mt-4 flex-1 text-sm leading-7 ${mutedText}`}>{item.desc}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={item.profileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View profile and book session with ${item.name}`}
                  className="rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 px-4 py-2 text-xs font-semibold text-white shadow transition hover:scale-105"
                >
                  View Profile &amp; Book
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="w-full px-6 pb-10 md:px-12 xl:px-20 2xl:px-32">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 p-8 shadow-2xl md:p-12">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-10 left-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Not Sure Where to Start?</p>
              </div>
              <h3 className="text-3xl font-bold text-white md:text-4xl">
                Let Mannlytics AI Guide You
              </h3>
              <p className="mt-4 text-blue-50 leading-7">
                Sometimes the first step is just talking it out. Reflect on how you feel, understand your emotions, and find clarity — privately, at your own pace.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <button
                onClick={() => {
                  const token = sessionStorage.getItem("token");
                  navigate(token ? "/dashboard" : "/login", token ? undefined : { state: { from: "/dashboard" } });
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-indigo-600 shadow-lg transition hover:scale-105"
              >
                Try Mannlytics AI
                <FaArrowRight className="transition group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="w-full px-6 pb-16 pt-2 md:px-12 xl:px-20 2xl:px-32">
        <div className={`flex gap-4 rounded-2xl border p-5 shadow-md ${
          darkMode ? "border-indigo-800/40 bg-indigo-900/20 text-white" : "border-indigo-100 bg-indigo-50/60 text-slate-800"
        }`}>
          <FaShieldAlt className="mt-0.5 shrink-0 text-xl text-indigo-400" />
          <div>
            <p className={`text-sm font-semibold uppercase tracking-widest ${darkMode ? "text-indigo-300" : "text-indigo-500"}`}>
              Disclaimer
            </p>
            <p className={`mt-2 text-sm leading-7 ${mutedText}`}>
              Mannlytics provides supportive emotional insights and reflection tools. It is not a substitute for professional medical advice, diagnosis, therapy, or emergency mental health support.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
