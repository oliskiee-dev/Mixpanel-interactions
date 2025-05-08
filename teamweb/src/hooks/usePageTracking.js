// src/hooks/usePageTracking.js
import { useEffect } from 'react';
import Analytics from '../utils/analytics';

export const usePageTracking = () => {
  useEffect(() => {
    // Simple version without React Router
    const pageName = window.location.pathname;
    Analytics.trackPageView(pageName);
  }, []);
};