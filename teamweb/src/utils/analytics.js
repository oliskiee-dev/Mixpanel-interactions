// src/utils/analytics.js
import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '239e9b0b81d9b1fd5a6048017160b9e9';

// Configure Mixpanel with existing settings PLUS autocapture
try {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV !== 'production',
    track_pageview: true,
    persistence: 'localStorage',
    ignore_dnt: true,
    
    // Add autocapture configuration
    autocapture: {
      enabled: true,
      exclude_elements: ['input[type=password]'],
      capture_form_field_changes: true,
      capture_links: true,
      capture_forms: true
    }
  });
  console.log('Mixpanel initialized successfully with autocapture enabled');
} catch (error) {
  console.error('Failed to initialize Mixpanel:', error);
}

export const Analytics = {
  track: (eventName, properties = {}) => {
    try {
      mixpanel.track(eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      });
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
  
  setUserProfile: (properties) => {
    try {
      mixpanel.people.set(properties);
      console.log('Set user properties:', properties);
    } catch (error) {
      console.error('Failed to set user properties:', error);
    }
  },
  
  trackPageView: (pageName) => {
    try {
      const pageTitle = pageName || document.title || window.location.pathname;
      mixpanel.track('Page View', { 
        page_name: pageTitle,
        page_path: window.location.pathname,
        page_url: window.location.href,
        referrer: document.referrer
      });
      console.log(`Tracked page view: ${pageTitle}`);
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  },
  
  reset: () => {
    try {
      mixpanel.reset();
      console.log('Reset user identity');
    } catch (error) {
      console.error('Failed to reset user:', error);
    }
  }
};

let lastTrackedPage = null;
if (typeof window !== 'undefined') {
  setInterval(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastTrackedPage) {
      lastTrackedPage = currentPath;
      Analytics.trackPageView();
    }
  }, 1000);
}

// Track initial page load
Analytics.track('Application Started', {
  url: window.location.href,
  referrer: document.referrer,
  user_agent: navigator.userAgent
});

export default Analytics;