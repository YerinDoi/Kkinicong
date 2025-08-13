import mixpanel from 'mixpanel-browser';

export const initMixpanel = () => {
  mixpanel.init('YOUR_PROJECT_TOKEN', { debug: true });
};

export const trackEvent = (eventName: string, props?: Record<string, any>) => {
  mixpanel.track(eventName, props);
};