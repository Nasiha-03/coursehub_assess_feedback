// Mock API functions for the assessment feedback application

export interface FeedbackData {
  tutorName: string;
  rating: number;
  comment: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

// Mock API function to submit feedback
export const submitFeedback = async (feedbackData: FeedbackData): Promise<ApiResponse<any>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful submission
      resolve({
        success: true,
        data: {
          id: Date.now().toString(),
          ...feedbackData,
          submittedAt: new Date().toISOString(),
        },
        message: 'Feedback submitted successfully! Thank you for your input.',
      });
    }, 1000);
  });
};

// Mock API function to fetch assessment data
export const fetchAssessments = async (token: string): Promise<ApiResponse<any[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!token) {
        resolve({
          success: false,
          message: 'Login required to view assessments',
        });
        return;
      }

      // Mock assessment data
      const assessments = [
        {
          id: '1',
          subject: 'Python',
          score: 87,
          maxScore: 100,
          percentage: 87,
          date: '2025-06-30',
          status: 'excellent',
          reportUrl: "/reports/Python.pdf"
        },
        {
          id: '2',
          subject: 'Web Development',
          score: 92,
          maxScore: 100,
          percentage: 92,
          date: '2025-07-25',
          status: 'excellent',
          reportUrl: "/reports/Web Development.pdf"
        },
        {
          id: '3',
          subject: 'Database Management',
          score: 78,
          maxScore: 100,
          percentage: 78,
          date: '2025-07-05',
          status: 'good',
          reportUrl: "/reports/Database Management.pdf"
        },
        {
          id: '4',
          subject: 'Software Testing',
          score: 85,
          maxScore: 100,
          percentage: 85,
          date: '2025-07-20',
          status: 'excellent',
          reportUrl: "/reports/Software Testing.pdf"
        },
        {
          id: '5',
          subject: 'Machine Learning',
          score: 94,
          maxScore: 100,
          percentage: 94,
          date: '2025-07-12',
          status: 'excellent',
          reportUrl: "/reports/Machine Learning.pdf"
        },
        {
          id: '6',
          subject: 'Java',
          score: 66,
          maxScore: 100,
          percentage: 66,
          date: '2025-06-23',
          status: 'average',
          reportUrl: "/reports/Java.pdf"
        }
      ];

      resolve({
        success: true,
        data: assessments,
        message: 'Assessments fetched successfully',
      });
    }, 800);
  });
};
import axios from 'axios';

export const downloadReport = async (reportData: any) => {
  return axios.post('/api/download-report', reportData, {
    responseType: 'blob'
  });
};
