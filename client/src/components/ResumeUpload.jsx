import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = ({ setParsedText, setScores, setFeedback }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles, fileRejections) => {
    setError('');
    if (fileRejections.length) {
      setError(fileRejections[0].errors[0].message);
      return;
    }
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    const form = new FormData();
    form.append('resume', file);
    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setParsedText(data.text);
        setScores(data.scores || {});
        setFeedback(data.feedback || '');
        setTimeout(() => navigate('/results'), 1000);
      }
    } catch {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div
      className="upload-container"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/qwe.jpg)` }}
    >
      <div
        {...getRootProps()}
        className={`upload-box ${isDragActive ? 'active-glow' : ''}`}
      >
        <input {...getInputProps()} />
        <p>Upload Your Resume</p>
        <span>PDF only, max 5 MB</span>
        {loading && <Spinner animation="border" variant="info" className="mt-3" />}
        {error && <div className="error-text mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default ResumeUpload;
