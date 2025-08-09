import React from 'react';
import DownloadReportButton from '../components/DownloadReportButton';

const ResultPage = () => {
  const reportData = {
    name: 'Nasiha Sulthana',
    email: 'nasiha@example.com',
    test: 'JavaScript Basics',
    score: 85,
    timeTaken: '25 mins',
    date: new Date().toLocaleDateString(),
    invitedBy: 'Admin',
    questions: [
      { title: 'What is closure?', status: 'Correct', score: 5, code: '...' },
      { title: 'Explain var vs let', status: 'Correct', score: 5, code: '...' },
      // more questions...
    ]
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Result</h1>
      <p><strong>Name:</strong> {reportData.name}</p>
      <p><strong>Test:</strong> {reportData.test}</p>
      <p><strong>Score:</strong> {reportData.score}</p>
      {/* Add more details if needed */}

      {/* ✅ Add the download button here */}
      <DownloadReportButton reportId="Java" />
    </div>
  );
};

export default ResultPage;
