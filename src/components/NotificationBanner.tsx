import React, { useState, useEffect } from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

interface NotificationBannerProps {
  className?: string;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ className = '' }) => {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Mock notifications that cycle every 30 seconds
  const notifications: Notification[] = [
    {
      id: '1',
      message: 'New assignment "Advanced React Patterns" is now available. Due date: jul 15, 2025',
      type: 'info',
      timestamp: new Date()
    },
    {
      id: '2',
      message: 'Reminder: Submit your Database Management project by tomorrow 11:59 PM',
      type: 'warning',
      timestamp: new Date()
    },
    {
      id: '3',
      message: 'Congratulations! You scored 94% on your Machine Learning assessment',
      type: 'success',
      timestamp: new Date()
    },
    {
      id: '4',
      message: 'System maintenance scheduled for tonight 2:00 AM - 4:00 AM EST',
      type: 'error',
      timestamp: new Date()
    },
    {
      id: '5',
      message: 'New study materials uploaded for Web Development course',
      type: 'info',
      timestamp: new Date()
    }
  ];

 useEffect(() => {
  let notificationIndex = 0;

  const showNextNotification = () => {
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentNotification(notifications[notificationIndex]);
      setIsVisible(true);
      setIsAnimating(false);
      notificationIndex = (notificationIndex + 1) % notifications.length;
    }, 300);
  };

  // Initial notification
  showNextNotification();

  // Change notifications every 30 seconds
  const interval = setInterval(() => {
    showNextNotification();
  }, 30000);

  return () => clearInterval(interval);
}, []);


  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 flex-shrink-0" />;
    }
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
    }
  };

 const handleClose = () => {
  setIsAnimating(true);

  setTimeout(() => {
    setIsVisible(false);
    setIsAnimating(false);
  }, 300);

  // Auto-show again after 30 seconds
  setTimeout(() => {
    setIsVisible(true);
  }, 30000);
};
  if (!isVisible || !currentNotification) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div
        className={`${getNotificationStyles(currentNotification.type)} transition-all duration-300 ${
          isAnimating ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getNotificationIcon(currentNotification.type)}
              <p className="text-sm sm:text-base font-medium truncate sm:whitespace-normal">
                {currentNotification.message}
              </p>
            </div>
            
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};