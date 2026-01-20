/**
 * Tab Navigation Constants
 * Centralized tab definitions for type-safety and consistency
 */

export const TABS = {
  WELCOME: 'Welcome',
  TRAITS: 'Numerology Traits',
  DASHA: 'Advanced Dasha',
  FORECAST: 'Forecast',
  REMEDIES: 'Remedies & Guidance',
  LIFECYCLE: 'Life Cycle'
};

// Array of all valid tabs (for validation)
export const TAB_LIST = Object.values(TABS);

// Tab metadata for enhanced UX
export const TAB_INFO = {
  [TABS.WELCOME]: {
    icon: '🌟',
    description: 'Your numerology snapshot and core insights',
    category: 'overview'
  },
  [TABS.TRAITS]: {
    icon: '✨',
    description: 'Personality traits and characteristics',
    category: 'personality'
  },
  [TABS.DASHA]: {
    icon: '🔮',
    description: 'Planetary periods and cosmic influences',
    category: 'timing'
  },
  [TABS.FORECAST]: {
    icon: '🌙',
    description: 'Life predictions and future events',
    category: 'prediction'
  },
  [TABS.REMEDIES]: {
    icon: '🕉️',
    description: 'Spiritual remedies and guidance',
    category: 'remedies'
  },
  [TABS.LIFECYCLE]: {
    icon: '♾️',
    description: 'Life cycles and transformative periods',
    category: 'cycles'
  }
};

// Suggested navigation flows
export const NAVIGATION_FLOWS = {
  'love-life': [TABS.FORECAST, TABS.TRAITS, TABS.REMEDIES],
  'career': [TABS.TRAITS, TABS.DASHA, TABS.FORECAST],
  'remedies': [TABS.REMEDIES, TABS.DASHA],
  'personality': [TABS.TRAITS, TABS.WELCOME],
  'timing': [TABS.DASHA, TABS.LIFECYCLE, TABS.FORECAST],
  'overview': [TABS.WELCOME, TABS.TRAITS, TABS.DASHA]
};

export default TABS;
