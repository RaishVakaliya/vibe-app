// Application-wide constants

export const APP_NAME = 'VIBE';
export const APP_SUBTITLE = 'Questions • Games • Challenges';
export const APP_BUNDLE_ID = 'com.vibe.questions';
export const APP_VERSION = '1.0.0';

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  QUESTIONS: 'questions',
  QUESTION_PACKS: 'question_packs',
  GAMES: 'games',
  GAME_SESSIONS: 'game_sessions',
  ROOMS: 'rooms',
  ROOM_PLAYERS: 'room_players',
  ANSWERS: 'answers',
  FAVORITES: 'favorites',
  DAILY_QUESTIONS: 'daily_questions',
  ACHIEVEMENTS: 'achievements',
  USER_ACHIEVEMENTS: 'user_achievements',
  SUBSCRIPTIONS: 'subscriptions',
  PURCHASES: 'purchases',
  REPORTS: 'reports',
  FEEDBACK: 'feedback',
  NOTIFICATIONS: 'notifications',
  REMOTE_CONFIG: 'remote_config',
  APP_CONFIG: 'app_config',
} as const;

// Game categories
export const GAME_CATEGORIES = [
  'couples',
  'friends',
  'best_friends',
  'party',
  'deep_talk',
  'funny',
  'would_you_rather',
  'never_have_i_ever',
  'truth_or_dare',
  'who_knows_me_best',
  'most_likely_to',
  'date_night',
  'family',
  'ice_breakers',
  'random',
  'custom',
] as const;

export type GameCategory = (typeof GAME_CATEGORIES)[number];

// Difficulty levels
export const DIFFICULTY_LEVELS = ['mild', 'medium', 'spicy'] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isRTL: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', isRTL: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', isRTL: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isRTL: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isRTL: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isRTL: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRTL: true },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', isRTL: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', isRTL: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', isRTL: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', isRTL: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', isRTL: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', isRTL: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', isRTL: false },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

// Game config
export const FREE_QUESTIONS_PER_SESSION = 10;
export const QUESTIONS_PER_PAGE = 20;
export const ROOM_CODE_LENGTH = 6;
export const ROOM_EXPIRY_MINUTES = 60;
export const MIN_ROOM_PLAYERS = 2;
export const MAX_ROOM_PLAYERS = 8;
export const COIN_REWARD_DAILY = 10;
export const COIN_REWARD_SHARE = 5;
export const COIN_REWARD_COMPLETE_GAME = 15;
export const COIN_REWARD_WATCH_AD = 20;
export const AD_INTERSTITIAL_FREQUENCY = 5; // show ad every N completed rounds
export const STREAK_RESET_HOURS = 36;

// Ad unit IDs — TEST IDs (override via env/remote config in prod)
export const AD_UNITS = {
  BANNER_ANDROID: 'ca-app-pub-3940256099942544/6300978111',
  BANNER_IOS: 'ca-app-pub-3940256099942544/2934735716',
  INTERSTITIAL_ANDROID: 'ca-app-pub-3940256099942544/1033173712',
  INTERSTITIAL_IOS: 'ca-app-pub-3940256099942544/4411468910',
  REWARDED_ANDROID: 'ca-app-pub-3940256099942544/5224354917',
  REWARDED_IOS: 'ca-app-pub-3940256099942544/1712485313',
} as const;

// Remote Config keys
export const RC_KEYS = {
  FREE_QUESTION_LIMIT: 'free_question_limit',
  INTERSTITIAL_FREQUENCY: 'interstitial_frequency',
  REWARDED_ENABLED: 'rewarded_enabled',
  PREMIUM_ENABLED: 'premium_enabled',
  AI_ENABLED: 'ai_enabled',
  DAILY_QUESTION_ENABLED: 'daily_question_enabled',
  MAINTENANCE_MODE: 'maintenance_mode',
  MINIMUM_APP_VERSION: 'minimum_app_version',
  FEATURED_CATEGORY: 'featured_category',
  NEW_PACK_ENABLED: 'new_pack_enabled',
} as const;

// Analytics events
export const ANALYTICS_EVENTS = {
  APP_OPEN: 'app_open',
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LANGUAGE_SELECTED: 'language_selected',
  SIGN_IN: 'sign_in',
  SIGN_UP: 'sign_up',
  SIGN_OUT: 'sign_out',
  GAME_STARTED: 'game_started',
  GAME_COMPLETED: 'game_completed',
  QUESTION_VIEWED: 'question_viewed',
  QUESTION_SHARED: 'question_shared',
  QUESTION_FAVORITED: 'question_favorited',
  CATEGORY_SELECTED: 'category_selected',
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  DAILY_QUESTION_VIEWED: 'daily_question_viewed',
  AD_REWARDED_WATCHED: 'ad_rewarded_watched',
  AD_INTERSTITIAL_SHOWN: 'ad_interstitial_shown',
  PREMIUM_SCREEN_VIEWED: 'premium_screen_viewed',
  PURCHASE_INITIATED: 'purchase_initiated',
  PURCHASE_COMPLETED: 'purchase_completed',
  PURCHASE_FAILED: 'purchase_failed',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  CUSTOM_GAME_CREATED: 'custom_game_created',
  AI_QUESTIONS_GENERATED: 'ai_questions_generated',
  DEEP_LINK_OPENED: 'deep_link_opened',
  SHARE_CARD_GENERATED: 'share_card_generated',
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
