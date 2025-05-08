// src/utils/analytics.js
import mixpanel from 'mixpanel-browser';

// Replace with your actual project token
const MIXPANEL_TOKEN = '239e9b0b81d9b1fd5a6048017160b9e9';

// Initialize Mixpanel with error handling
try {
    mixpanel.init(MIXPANEL_TOKEN, {
        debug: true,
        track_pageview: false,
        ignore_dnt: true // Add this line to ignore the "Do Not Track" setting
      });
  console.log('Mixpanel initialized successfully');
} catch (error) {
  console.error('Failed to initialize Mixpanel:', error);
}

// Simple tracking functions
export const Analytics = {
  track: (eventName, properties = {}) => {
    try {
      mixpanel.track(eventName, properties);
      console.log(`Tracked event: ${eventName}`, properties);
    } catch (error) {
      console.error(`Failed to track event ${eventName}:`, error);
    }
  },
  
  identify: (userId) => {
    try {
      mixpanel.identify(userId);
      console.log(`Identified user: ${userId}`);
    } catch (error) {
      console.error(`Failed to identify user ${userId}:`, error);
    }
  },
  
  trackPageView: () => {
    try {
      const pageName = window.location.pathname;
      mixpanel.track('Page View', { 
        path: pageName,
        url: window.location.href 
      });
      console.log(`Tracked page view: ${pageName}`);
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }
};

// Track initial page load
Analytics.trackPageView();

export default Analytics;