import type { ConfigContext, ExpoConfig } from "expo/config";
import fs from "fs";
import path from "path";

const plistPath = process.env.GOOGLE_SERVICES_PLIST ?? "./GoogleService-Info.plist";
const hasPlist = fs.existsSync(path.resolve(__dirname, plistPath));

const jsonPath = process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json";
const hasJson = fs.existsSync(path.resolve(__dirname, jsonPath));

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "VIBE",
  slug: "vibe",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "vibe",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  backgroundColor: "#161B22",
  splash: {
    image: "./assets/images/splash-icon.png",
    imageWidth: 200,
    resizeMode: "contain",
    backgroundColor: "#161B22",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.vibe.questions",
    ...(hasPlist ? { googleServicesFile: plistPath } : {}),
    infoPlist: {
      NSCameraUsageDescription:
        "VIBE needs camera access to capture your profile photo.",
      NSPhotoLibraryUsageDescription:
        "VIBE needs photo library access to save and share game cards.",
      NSPhotoLibraryAddUsageDescription:
        "VIBE saves game cards to your photo library.",
    },
    config: {},
  },
  android: {
    package: "com.vibe.questions",
    ...(hasJson ? { googleServicesFile: jsonPath } : {}),
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      backgroundColor: "#161B22",
    },
    edgeToEdgeEnabled: true,
    permissions: [
      "RECEIVE_BOOT_COMPLETED",
      "VIBRATE",
      "POST_NOTIFICATIONS",
      "INTERNET",
      "ACCESS_NETWORK_STATE",
    ],
  },
  web: {
    output: "single",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-localization",
    "@react-native-google-signin/google-signin",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#0D0D1A",
        dark: { backgroundColor: "#0D0D1A" },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: "35.0.0",
          kotlinVersion: "2.0.21",
        },
        ios: {
          deploymentTarget: "15.1",
          useFrameworks: "static",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    firebaseApiKey: process.env.FIREBASE_API_KEY ?? "",
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN ?? "",
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? "",
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? "",
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? "",
    firebaseAppId: process.env.FIREBASE_APP_ID ?? "",
    firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID ?? "",
    admobAndroidAppId:
      process.env.ADMOB_ANDROID_APP_ID ??
      "ca-app-pub-3940256099942544~3347511713",
    admobIosAppId:
      process.env.ADMOB_IOS_APP_ID ?? "ca-app-pub-3940256099942544~1458002511",
    iapMonthlySubId: process.env.IAP_MONTHLY_SUB_ID ?? "vibe_pro_monthly",
    iapYearlySubId: process.env.IAP_YEARLY_SUB_ID ?? "vibe_pro_yearly",
    iapLifetimeId: process.env.IAP_LIFETIME_ID ?? "vibe_pro_lifetime",
    googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID ?? "",
    apiBaseUrl:
      process.env.API_BASE_URL ??
      "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net",
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? "YOUR_EAS_PROJECT_ID",
    },
  },
});
