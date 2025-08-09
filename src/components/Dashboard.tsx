import React, { useState, useEffect } from 'react';
import { fetchAssessments, downloadReport } from '../utils/api';

interface Assessment {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  date: string;
  status: 'excellent' | 'good' | 'average' | 'poor';
}

interface DashboardProps {
  onLogout: () => void;
  authToken: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, authToken }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const loadAssessments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchAssessments(authToken || '');
        if (response.success && response.data) {
          setAssessments(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to load assessments');
      } finally {
        setIsLoading(false);
      }
    };
    loadAssessments();
  }, [authToken]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'from-green-500 to-emerald-600';
      case 'good': return 'from-blue-500 to-cyan-600';
      case 'average': return 'from-yellow-500 to-orange-600';
      case 'poor': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (percentage >= 80) return 'bg-gradient-to-r from-blue-500 to-cyan-600';
    if (percentage >= 70) return 'bg-gradient-to-r from-yellow-500 to-orange-600';
    return 'bg-gradient-to-r from-red-500 to-pink-600';
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleDownload = async (assessment: Assessment) => {
  setDownloadingId(assessment.id);

  try {
    const response = await downloadReport({
      name: 'Nasiha Sulthana',
      subject: assessment.subject,
      score: assessment.score,
      date: assessment.date
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${assessment.subject}-report.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    showNotification(`${assessment.subject} report downloaded successfully!`, 'success');
  } catch (error) {
    console.error(error);
    showNotification(`Failed to download report for ${assessment.subject}`, 'error');
  } finally {
    setDownloadingId(null);
  }
};


  const sortedAssessments = assessments.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestAssessment = sortedAssessments[0];
  const averageScore = assessments.length > 0 ? assessments.reduce((sum, a) => sum + a.percentage, 0) / assessments.length : 0;

  if (isLoading) return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center pt-16"><p>Loading your assessments...</p></div>;
  if (error) return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center pt-16"><p>{error}</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16">
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-500 ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{notification.message}</div>
      )}

      <header className={`bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40 transform transition-transform duration-500 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-400 text-transparent bg-clip-text">Course Hub Assessment-Portal</h1>
            <button onClick={onLogout} className="text-slate-600 hover:text-slate-800">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 rounded-2xl p-6 shadow-lg"><p>Total Assessments</p><p>{assessments.length}</p></div>
          <div className="bg-white/80 rounded-2xl p-6 shadow-lg"><p>Average Score</p><p>{Math.round(averageScore)}%</p></div>
          <div className="bg-white/80 rounded-2xl p-6 shadow-lg"><p>Excellent Scores</p><p>{assessments.filter(a => a.status === 'excellent').length}</p></div>
        </div>

        {latestAssessment && (
          <div className="mb-12 p-6 bg-white/80 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">📌 Latest Assessment</h2>
            <div className="flex justify-between mb-2">
              <p>{latestAssessment.subject}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getStatusColor(latestAssessment.status)}`}>{latestAssessment.percentage}%</span>
            </div>
            <p>Date: {latestAssessment.date}</p>
            <p>Score: {latestAssessment.score}/{latestAssessment.maxScore}</p>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div className={`h-full ${getProgressBarColor(latestAssessment.percentage)} rounded-full`} style={{ width: `${latestAssessment.percentage}%` }}></div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-slate-800 mb-6">Assessment Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="bg-white/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-800">{assessment.subject}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getStatusColor(assessment.status)}`}>{assessment.percentage}%</span>
              </div>
              <p className="text-sm text-slate-500">Date: {assessment.date}</p>
              <p className="text-sm text-slate-500 mb-2">Score: {assessment.score}/{assessment.maxScore}</p>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-4">
                <div className={`h-full ${getProgressBarColor(assessment.percentage)} rounded-full`} style={{ width: `${assessment.percentage}%` }}></div>
              </div>
              <button
                onClick={() => handleDownload(assessment)}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
              >
                {downloadingId === assessment.id ? 'Downloading...' : 'Download PDF'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
