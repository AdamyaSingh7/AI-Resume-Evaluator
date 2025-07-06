// client/src/App.js
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import SplashScreen from './components/SplashScreen';
import ResumeUpload from './components/ResumeUpload';
import ResultPage   from './components/ResultPage';

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

function Home({ showSplash, setParsedText, setScores, setFeedback }) {
  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1.2 }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <SplashScreen />
        </motion.div>
      ) : (
        <motion.div
          key="upload"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 1.2 }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <ResumeUpload
            setParsedText={setParsedText}
            setScores={setScores}
            setFeedback={setFeedback}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [showSplash, setShowSplash]   = useState(true);
  const [parsedText, setParsedText]   = useState('');
  const [scores, setScores]           = useState({});
  const [feedback, setFeedback]       = useState('');

  // hide splash after 3.5s
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <Router>
      {/* wrap all routes so exit animations apply */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              showSplash={showSplash}
              setParsedText={setParsedText}
              setScores={setScores}
              setFeedback={setFeedback}
            />
          }
        />
        <Route
          path="/results"
          element={
            parsedText ? (
              <motion.div
                key="results"
                variants={fadeVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 1 }}
              >
                <ResultPage
                  parsedText={parsedText}
                  scores={scores}
                  feedback={feedback}
                  setParsedText={setParsedText}
                  setScores={setScores}
                  setFeedback={setFeedback}
                />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
