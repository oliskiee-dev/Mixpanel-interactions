import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '239e9b0b81d9b1fd5a6048017160b9e9';

// Initialize Mixpanel with autocapture enabled
try {
    mixpanel.init(MIXPANEL_TOKEN, {
        debug: true, // Set to false in production
        track_pageview: true,
        persistence: 'localStorage',
        ignore_dnt: true, 
        // Enable autocapture feature
        autocapture: {
            enabled: true,
            forms: true, // Track form submissions
            buttons: true, // Track all button clicks
            inputs: false, // Don't track input field changes by default (privacy)
            events: [], // Only track specific events (empty = all)
            exclude_element_classes: ['exclude-tracking'], // Classes to exclude from tracking
            exclude_element_ids: ['password', 'secret'], // IDs to exclude from tracking
            max_elements: 5, // Maximum number of elements to track per event
        }
    });
    console.log('Mixpanel with autocapture initialized successfully');
} catch (error) {
    console.error('Failed to initialize Mixpanel with autocapture:', error);
}

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
    
    setUserProfile: (properties) => {
        try {
            mixpanel.people.set(properties);
            console.log('Set user profile properties:', properties);
        } catch (error) {
            console.error('Failed to set user profile properties:', error);
        }
    },
    
    trackPageView: (pageName = null) => {
        try {
            const path = pageName || window.location.pathname;
            mixpanel.track('Page View', { 
                path: path,
                url: window.location.href,
                referrer: document.referrer,
                title: document.title
            });
            console.log(`Tracked page view: ${path}`);
        } catch (error) {
            console.error('Failed to track page view:', error);
        }
    },
    
    reset: () => {
        try {
            mixpanel.reset();
            console.log('Reset user identification');
        } catch (error) {
            console.error('Failed to reset user identification:', error);
        }
    },
    
    // Enable or disable tracking of specific form
    trackForm: (formId, eventName) => {
        try {
            mixpanel.track_forms(`#${formId}`, eventName);
            console.log(`Form tracking enabled for #${formId}`);
        } catch (error) {
            console.error(`Failed to enable form tracking for #${formId}:`, error);
        }
    },
    
    // Enable or disable tracking of specific links
    trackLink: (linkSelector, eventName) => {
        try {
            mixpanel.track_links(linkSelector, eventName);
            console.log(`Link tracking enabled for ${linkSelector}`);
        } catch (error) {
            console.error(`Failed to enable link tracking for ${linkSelector}:`, error);
        }
    },
    
    // Register default properties to be sent with all events
    registerSuperProperties: (properties) => {
        try {
            mixpanel.register(properties);
            console.log('Registered super properties:', properties);
        } catch (error) {
            console.error('Failed to register super properties:', error);
        }
    }
};

// Initialize with app version and environment
Analytics.registerSuperProperties({
    app_version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
});

export default Analytics;