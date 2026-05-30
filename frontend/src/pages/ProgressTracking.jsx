// import { useState, useEffect } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// function ProgressTracking() {
//   const [journals, setJournals] = useState([]);
//   const [streak, setStreak] = useState(0);

//   useEffect(() => {
//     fetchJournals();
//   }, []);

// //   const fetchJournals = async () => {
// //     try {
// //       const res = await fetch("http://localhost:5000/api/journals");
// //       const data = await res.json();
// //       setJournals(data);

// //       calculateStreak(data);
// //     } catch (error) {
// //       console.error("Error fetching journals:", error);
// //     }
// //   };

// const fetchJournals = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/journal", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`
//         }
//       });
  
//       const data = await res.json();
//       setJournals(data);
//       calculateStreak(data);
  
//     } catch (error) {
//       console.error("Error fetching journals:", error);
//     }
//   };

//   const calculateStreak = (data) => {
//     if (!data.length) return;

//     let streakCount = 1;

//     const sorted = [...data].sort(
//       (a, b) => new Date(b.date) - new Date(a.date)
//     );

//     for (let i = 1; i < sorted.length; i++) {
//       const prev = new Date(sorted[i - 1].date);
//       const curr = new Date(sorted[i].date);

//       const diff =
//         (prev.setHours(0, 0, 0, 0) - curr.setHours(0, 0, 0, 0)) /
//         (1000 * 60 * 60 * 24);

//       if (diff === 1) {
//         streakCount++;
//       } else {
//         break;
//       }
//     }

//     setStreak(streakCount);
//   };

//   const totalEntries = journals.length;

//   const getMostCommonEmotion = () => {
//     const count = {};

//     journals.forEach((j) => {
//       count[j.emotion] = (count[j.emotion] || 0) + 1;
//     });

//     return Object.keys(count).reduce((a, b) =>
//       count[a] > count[b] ? a : b
//     );
//   };

//   const moodTrend = {
//     labels: journals.map((j) =>
//       new Date(j.date).toLocaleDateString()
//     ),
//     datasets: [
//       {
//         label: "Mood Score",
//         data: journals.map((j) => j.score),
//         borderColor: "#3b82f6",
//         tension: 0.3
//       }
//     ]
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white p-8">

//       {/* HEADER */}
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold text-blue-800">
//           Progress Tracking
//         </h1>
//         <p className="text-gray-600 mt-2">
//           Monitor your emotional wellbeing over time
//         </p>
//       </div>

//       {/* STATS CARDS */}
//       <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">

//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <h3 className="font-semibold text-blue-700">
//             🔥 Current Streak
//           </h3>
//           <p className="text-3xl font-bold text-orange-500 mt-2">
//             {streak}
//           </p>
//           <p className="text-sm text-gray-500">Days</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <h3 className="font-semibold text-blue-700">
//             📊 Total Journals
//           </h3>
//           <p className="text-3xl font-bold text-blue-600 mt-2">
//             {totalEntries}
//           </p>
//           <p className="text-sm text-gray-500">Entries</p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <h3 className="font-semibold text-blue-700">
//             😊 Most Common Emotion
//           </h3>
//           <p className="text-2xl font-bold text-green-600 mt-2">
//             {journals.length ? getMostCommonEmotion() : "-"}
//           </p>
//         </div>

//       </div>

//       {/* GRAPH */}
//       <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto mb-10">
//         <h2 className="text-xl font-semibold mb-4">
//           Weekly Mood Trend
//         </h2>

//         {journals.length ? (
//           <Line data={moodTrend} />
//         ) : (
//           <p className="text-gray-500">No journal data available</p>
//         )}
//       </div>

//       {/* JOURNAL HISTORY */}
//       <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto">

//         <h2 className="text-xl font-semibold mb-4">
//           Emotion History
//         </h2>

//         <table className="w-full border-collapse">

//           <thead>
//             <tr className="border-b bg-gray-50">
//               <th className="p-3 text-left">Date</th>
//               <th className="p-3 text-left">Emotion</th>
//               <th className="p-3 text-left">Score</th>
//             </tr>
//           </thead>

//           <tbody>
//             {journals.map((entry, index) => (
//               <tr key={index} className="border-b">
//                 <td className="p-3">
//                   {new Date(entry.date).toLocaleDateString()}
//                 </td>
//                 <td className="p-3 capitalize">{entry.emotion}</td>
//                 <td className="p-3">{entry.score}/10</td>
//               </tr>
//             ))}
//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// }

// export default ProgressTracking;






import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ProgressTracking() {

  const [journals, setJournals] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJournals();
  }, []);

  // 🔹 Fetch journals from backend
  const fetchJournals = async () => {
    try {

      const res = await fetch("http://localhost:5000/api/journal", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      setJournals(data);
      calculateStreak(data);

    } catch (error) {
      console.error("Error fetching journals:", error);
    }
  };

  // 🔹 Calculate streak using createdAt
  const calculateStreak = (data) => {

    if (!data.length) {
      setStreak(0);
      return;
    }

    const sorted = [...data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    let streakCount = 1;

    for (let i = 1; i < sorted.length; i++) {

      const prev = new Date(sorted[i - 1].createdAt);
      const curr = new Date(sorted[i].createdAt);

      const diff =
        (prev.setHours(0,0,0,0) - curr.setHours(0,0,0,0)) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) {
        streakCount++;
      } else {
        break;
      }
    }

    setStreak(streakCount);
  };

  const totalEntries = journals.length;

  // 🔹 Most common emotion
  const getMostCommonEmotion = () => {

    if (!journals.length) return "-";

    const count = {};

    journals.forEach((j) => {

      const emotion = j.analysis?.emotion;

      if (!emotion) return;

      count[emotion] = (count[emotion] || 0) + 1;

    });

    return Object.keys(count).reduce((a,b) =>
      count[a] > count[b] ? a : b
    );
  };

  // 🔹 Graph data
  const moodTrend = {
    labels: journals.map((j) =>
      new Date(j.createdAt).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Risk Score",
        data: journals.map((j) => j.riskScore),
        borderColor: "#3b82f6",
        tension: 0.3
      }
    ]
  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white p-8">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-800">
          Progress Tracking
        </h1>

        <p className="text-gray-600 mt-2">
          Monitor your emotional wellbeing over time
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="font-semibold text-blue-700">
            🔥 Current Streak
          </h3>

          <p className="text-3xl font-bold text-orange-500 mt-2">
            {streak}
          </p>

          <p className="text-sm text-gray-500">
            Days
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="font-semibold text-blue-700">
            📊 Total Journals
          </h3>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {totalEntries}
          </p>

          <p className="text-sm text-gray-500">
            Entries
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="font-semibold text-blue-700">
            😊 Most Common Emotion
          </h3>

          <p className="text-2xl font-bold text-green-600 mt-2">
            {journals.length ? getMostCommonEmotion() : "-"}
          </p>
        </div>

      </div>

      {/* GRAPH */}
      <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Mood Risk Trend
        </h2>

        {journals.length ? (
          <Line data={moodTrend} />
        ) : (
          <p className="text-gray-500">
            No journal data available
          </p>
        )}

      </div>

      {/* JOURNAL HISTORY */}
      <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto">

        <h2 className="text-xl font-semibold mb-4">
          Emotion History
        </h2>

        <table className="w-full border-collapse">

          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Emotion</th>
              <th className="p-3 text-left">Risk Score</th>
            </tr>
          </thead>

          <tbody>

            {journals.map((entry, index) => (

              <tr key={index} className="border-b">

                <td className="p-3">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 capitalize">
                  {entry.analysis?.emotion || "-"}
                </td>

                <td className="p-3">
                  {entry.riskScore}/10
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default ProgressTracking;
