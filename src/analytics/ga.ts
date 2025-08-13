import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize('G-MFJ749RKHH'); // 측정 ID
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};
