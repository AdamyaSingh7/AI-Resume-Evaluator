// client/src/components/ResultPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResultPage = ({
  parsedText,
  scores,
  feedback,
  setParsedText,
  setScores,
  setFeedback
}) => {
  const [showParsed, setShowParsed] = useState(false);
  const navigate = useNavigate();

  const toggleParsed = () => setShowParsed(!showParsed);

  const handleDownload = async () => {
    try {
      const res = await fetch('http://localhost:5000/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: parsedText, scores, feedback })
      });
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'resume_feedback.pdf';
      link.click();
    } catch (err) {
      console.error('PDF download failed:', err);
    }
  };

  const replaceResume = () => {
    setParsedText('');
    setScores({});
    setFeedback('');
    navigate('/');
  };

  return (
    <div
      className="result-container"
      style={{
        position: 'relative',
        padding: '2rem',
        minHeight: '100vh',
        color: '#fff',
        fontFamily: 'Segoe UI, sans-serif',
        background: `
          linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
          url(${process.env.PUBLIC_URL}/qwe.jpg) center/cover no-repeat
        `
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          color: '#00bfff',
          textShadow: '0 0 10px #00bfff',
          marginBottom: '1.5rem'
        }}
      >
        📊 Resume Section Scores
      </h1>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}
      >
        <button
          onClick={toggleParsed}
          style={{
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
        >
          {showParsed ? 'Hide Parsed Resume Text' : 'Show Parsed Resume Text'}
        </button>

        <button
          onClick={handleDownload}
          style={{
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '8px',
            background: '#00bfff',
            color: '#000',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
        >
          📥 Download Feedback PDF
        </button>

        <button
          onClick={replaceResume}
          style={{
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '8px',
            background: '#ff4c4c',
            color: '#fff',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
        >
          🔄 Replace Resume
        </button>
      </div>

      {showParsed && (
        <div
          style={{
            background: '#222',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            maxHeight: '40vh',
            overflowY: 'auto'
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Parsed Resume Text:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
            {parsedText}
          </pre>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        {Object.entries(scores).map(([section, score]) => (
          <div
            key={section}
            style={{
              background: '#1e1e2f',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 0 15px rgba(0, 191, 255, 0.2)',
              transition: 'transform 0.3s',
              color: '#fff'
            }}
          >
            <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>{section}</h3>
            <p style={{ fontSize: '1.5rem', margin: 0, color: '#0ff' }}>
              {score} / 10
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: '#1c1c1c',
          padding: '1.5rem',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(255,255,255,0.1)'
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>📝 Feedback:</h2>
        <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {feedback}
        </p>
      </div>
    </div>
  );
};

export default ResultPage;
