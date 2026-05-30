// export default function AIAnalysis() {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 px-10 py-16 relative overflow-hidden">
  
//         {/* AI BACKGROUND SHAPES */}
//         <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 opacity-30 blur-3xl rounded-full"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 opacity-30 blur-3xl rounded-full"></div>
  
//         {/* PAGE TITLE */}
//         <h1 className="text-4xl font-bold text-center mb-12 text-indigo-700">
//           AI Powered Mental Health Analysis
//         </h1>
  
//         {/* AI OVERVIEW */}
//         <div className="bg-white shadow-md rounded-xl p-8 mb-10 relative">
//           <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
//             AI System Overview
//           </h2>
  
//           <p className="text-gray-600 mb-4">
//             Our platform uses Artificial Intelligence and Natural Language
//             Processing (NLP) techniques to analyze written text and detect
//             emotional patterns related to mental health. The AI model evaluates
//             the sentiment and emotional tone of user input to identify emotional
//             states such as happiness, sadness, anxiety, anger, or neutral mood.
//           </p>
  
//           <p className="text-gray-600">
//             The system is developed using modern Full Stack technologies
//             including the MERN Stack (MongoDB, Express.js, React.js, Node.js).
//             React is used to build an interactive interface while the backend
//             processes data and supports AI-based emotion detection models.
//           </p>
//         </div>
  
//         {/* AI WORKFLOW */}
//         <div className="bg-white shadow-md rounded-xl p-8 mb-10 relative">
//           <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
//             AI Analysis Workflow
//           </h2>
  
//           <ol className="list-decimal ml-6 text-gray-700 space-y-2">
//             <li>User enters text describing thoughts or emotions.</li>
//             <li>The system preprocesses the text using NLP techniques.</li>
//             <li>Machine learning algorithms analyze emotional tone.</li>
//             <li>The AI model predicts the most relevant emotion category.</li>
//             <li>Emotion probability scores are generated.</li>
//             <li>Results are visualized and suggestions are provided.</li>
//           </ol>
//         </div>
  
//         {/* EMOTION DETECTION */}
//         <div className="bg-white shadow-md rounded-xl p-8 mb-10 relative">
//           <h2 className="text-2xl font-semibold mb-6 text-indigo-600">
//             Emotion Detection by AI
//           </h2>
  
//           <div className="grid md:grid-cols-5 gap-6 text-center">
  
//             <div className="bg-indigo-50 p-4 rounded-lg">
//               <h3 className="font-semibold">Happiness 😊</h3>
//             </div>
  
//             <div className="bg-indigo-50 p-4 rounded-lg">
//               <h3 className="font-semibold">Sadness 😔</h3>
//             </div>
  
//             <div className="bg-indigo-50 p-4 rounded-lg">
//               <h3 className="font-semibold">Anxiety 😰</h3>
//             </div>
  
//             <div className="bg-indigo-50 p-4 rounded-lg">
//               <h3 className="font-semibold">Anger 😡</h3>
//             </div>
  
//             <div className="bg-indigo-50 p-4 rounded-lg">
//               <h3 className="font-semibold">Neutral 😐</h3>
//             </div>
  
//           </div>
//         </div>
  
//         {/* EMOTION VISUALIZATION */}
//         <div className="bg-white shadow-md rounded-xl p-8 mb-10 relative">
//           <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
//             Emotion Visualization & Bar Graph Analysis
//           </h2>
  
//           <p className="text-gray-600">
//             After detecting the emotional state, the AI system calculates emotion
//             probabilities and visualizes them using bar graphs. These graphs help
//             users understand how strongly different emotions are present in their
//             text. For example, the system may show percentage levels for
//             happiness, sadness, anxiety, anger, or neutral emotions.
//           </p>
//         </div>
  
//         {/* AI SUGGESTIONS */}
//         <div className="bg-white shadow-md rounded-xl p-8 mb-10 relative">
//           <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
//             Emotion Based Suggestions
//           </h2>
  
//           <p className="text-gray-600 mb-4">
//             Based on the detected emotional state, the system provides helpful
//             suggestions to improve mental well-being.
//           </p>
  
//           <ul className="list-disc ml-6 text-gray-700 space-y-2">
//             <li>If sadness is detected, relaxation or talking to someone may be suggested.</li>
//             <li>If anxiety is detected, breathing exercises or mindfulness may help.</li>
//             <li>If anger is detected, calming activities such as walking or journaling may be recommended.</li>
//             <li>If happiness is detected, the system encourages maintaining positive habits.</li>
//           </ul>
//         </div>
  
//         {/* BENEFITS */}
//         <div className="bg-white shadow-md rounded-xl p-8 relative">
//           <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
//             Benefits of AI Mental Health Analysis
//           </h2>
  
//           <ul className="list-disc ml-6 text-gray-700 space-y-2">
//             <li>Early detection of emotional stress.</li>
//             <li>Better understanding of personal emotional patterns.</li>
//             <li>AI-driven insights for mental health awareness.</li>
//             <li>Visualization of emotional trends through graphs.</li>
//             <li>Personalized suggestions for improving well-being.</li>
//           </ul>
//         </div>
  
//       </div>
//     );
//   }






import { useEffect } from "react";

export default function AIAnalysis() {

  useEffect(() => {
  window.scrollTo(0,0);
}, []);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 px-10 py-16 relative overflow-hidden">
  
        {/* AI BACKGROUND SHAPES */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 opacity-30 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 opacity-30 blur-3xl rounded-full"></div>
  
        {/* PAGE TITLE */}
        <h1 className="text-4xl font-bold text-center mb-12 text-indigo-700">
          AI Powered Mental Health Analysis
        </h1>
  
        {/* AI OVERVIEW WITH IMAGE */}
        <div className="bg-white shadow-md rounded-xl p-8 mb-10 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
  
            {/* TEXT */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
                AI System Overview
              </h2>
  
              <p className="text-gray-600 mb-4">
                Our platform uses Artificial Intelligence and Natural Language
                Processing (NLP) techniques to analyze written text and detect
                emotional patterns related to mental health. The AI model
                evaluates the sentiment and emotional tone of user input to
                identify emotional states such as happiness, sadness, anxiety,
                anger, or neutral mood.
              </p>
  
              <p className="text-gray-600">
                The system is developed using modern Full Stack technologies
                including the MERN Stack (MongoDB, Express.js, React.js,
                Node.js). React provides an interactive interface while the
                backend supports AI processing and data analysis.
              </p>
            </div>
  
            {/* IMAGE */}
            <div className="flex justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                alt="AI brain"
                className="w-64 h-64 object-contain"
              />
            </div>
  
          </div>
        </div>
  
        {/* AI WORKFLOW */}
        <div className="bg-white shadow-md rounded-xl p-8 mb-10 relative">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            AI Analysis Workflow
          </h2>
  
          <ol className="list-decimal ml-6 text-gray-700 space-y-2">
            <li>User enters text describing thoughts or emotions.</li>
            <li>The system preprocesses the text using NLP techniques.</li>
            <li>Machine learning algorithms analyze emotional tone.</li>
            <li>The AI model predicts the most relevant emotion category.</li>
            <li>Emotion probability scores are generated.</li>
            <li>Results are visualized and suggestions are provided.</li>
          </ol>
        </div>
  
        {/* EMOTION DETECTION */}
        <div className="bg-white shadow-md rounded-xl p-8 mb-10 relative">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-600">
            Emotion Detection by AI
          </h2>
  
          <div className="grid md:grid-cols-5 gap-6 text-center">
  
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold">Happiness 😊</h3>
            </div>
  
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold">Sadness 😔</h3>
            </div>
  
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold">Anxiety 😰</h3>
            </div>
  
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold">Anger 😡</h3>
            </div>
  
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold">Neutral 😐</h3>
            </div>
  
          </div>
        </div>
  
        {/* BAR GRAPH EXPLANATION */}
        <div className="bg-white shadow-md rounded-xl p-8 mb-10 relative">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Emotion Visualization & Bar Graph Analysis
          </h2>
  
          <p className="text-gray-600">
            After detecting the emotional state, the AI system calculates
            emotion probabilities and visualizes them using bar graphs. These
            graphs help users understand how strongly different emotions are
            present in their text. For example, the analysis may show
            percentage levels for happiness, sadness, anxiety, anger, or
            neutral emotions.
          </p>
        </div>
  
        {/* AI SUGGESTIONS */}
        <div className="bg-white shadow-md rounded-xl p-8 mb-10 relative">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Emotion Based Suggestions
          </h2>
  
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>If sadness is detected, relaxation or talking to someone may help.</li>
            <li>If anxiety is detected, breathing exercises or mindfulness techniques are suggested.</li>
            <li>If anger is detected, calming activities like walking or journaling may help.</li>
            <li>If happiness is detected, the system encourages maintaining positive habits.</li>
          </ul>
        </div>
  
        {/* BENEFITS */}
        <div className="bg-white shadow-md rounded-xl p-8 relative">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Benefits of AI Mental Health Analysis
          </h2>
  
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li>Early detection of emotional stress.</li>
            <li>Better understanding of emotional patterns.</li>
            <li>AI-driven insights for mental health awareness.</li>
            <li>Visualization of emotional trends using graphs.</li>
            <li>Personalized suggestions for improving well-being.</li>
          </ul>
        </div>
  
      </div>
    );
  }