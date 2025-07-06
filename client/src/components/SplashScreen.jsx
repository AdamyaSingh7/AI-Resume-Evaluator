import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => (
  <div className="splash-container">
    <motion.h1
      className="splash-text"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 2 }}
    >
      Hello! Welcome to <span className="blue">AI Resume Evaluator.</span>
    </motion.h1>
  </div>
);

export default SplashScreen;
