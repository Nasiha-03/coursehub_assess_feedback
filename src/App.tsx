import React, { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { FeedbackForm } from './components/FeedbackForm';
import { NotificationBanner } from './components/NotificationBanner';
import { submitFeedback } from './utils/api';
import { CheckCircle, Bell } from 'lucide-react';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);
  const [feedbackNotification, setFeedbackNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;

  localStorage.removeItem('authToken');
  setAuthToken(null);
  setIsAuthenticated(false);
  setShowFeedback(false);
  setShowNotificationBanner(true);
};


  const handleFeedbackSubmit = async (feedbackData: any) => {
    try {
      const response = await submitFeedback(feedbackData);
      if (response.success) {
        setFeedbackNotification({
          show: true,
          message: response.message,
          type: 'success',
        });
        setShowFeedback(false);
      }
    } catch (error) {
      setFeedbackNotification({
        show: true,
        message: 'Failed to submit feedback. Please try again.',
        type: 'error',
      });
    }

    setTimeout(() => {
      setFeedbackNotification({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {showNotificationBanner && <NotificationBanner />}

      {feedbackNotification.show && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg border transition-all duration-500 max-w-md ${
              feedbackNotification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{feedbackNotification.message}</span>
            </div>
          </div>
        </div>
      )}

      {showFeedback ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="mb-6">
              <button
                onClick={() => setShowFeedback(false)}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
              >
                ← Back to Dashboard
              </button>
            </div>
            <FeedbackForm onSubmit={handleFeedbackSubmit} />
          </div>
        </div>
      ) : (
        <>
          <Dashboard onLogout={handleLogout} authToken={authToken} />

          <button
            onClick={() => setShowFeedback(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center z-40"
          >
            <Bell className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
}

export default App;
