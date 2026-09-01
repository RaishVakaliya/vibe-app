import Constants from "expo-constants";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

function getFirebaseConfig(): FirebaseConfig {
  const extra = Constants.expoConfig?.extra ?? {};
  return {
    apiKey: (extra["firebaseApiKey"] as string) ?? "",
    authDomain: (extra["firebaseAuthDomain"] as string) ?? "",
    projectId: (extra["firebaseProjectId"] as string) ?? "",
    storageBucket: (extra["firebaseStorageBucket"] as string) ?? "",
    messagingSenderId: (extra["firebaseMessagingSenderId"] as string) ?? "",
    appId: (extra["firebaseAppId"] as string) ?? "",
    measurementId: (extra["firebaseMeasurementId"] as string) ?? "",
  };
}

export const firebaseConfig = getFirebaseConfig();

export function getApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra ?? {};
  return (
    (extra["apiBaseUrl"] as string) ??
    "https://us-central1-demo-project.cloudfunctions.net"
  );
}

export function getAdmobAppId(platform: "android" | "ios"): string {
  const extra = Constants.expoConfig?.extra ?? {};
  if (platform === "android") {
    return (
      (extra["admobAndroidAppId"] as string) ??
      "ca-app-pub-3940256099942544~3347511713"
    );
  }
  return (
    (extra["admobIosAppId"] as string) ??
    "ca-app-pub-3940256099942544~1458002511"
  );
}

export function getGoogleWebClientId(): string {
  const extra = Constants.expoConfig?.extra ?? {};
  return (extra["googleWebClientId"] as string) ?? "";
}

export function getIAPProductIds(): {
  monthly: string;
  yearly: string;
  lifetime: string;
} {
  const extra = Constants.expoConfig?.extra ?? {};
  return {
    monthly: (extra["iapMonthlySubId"] as string) ?? "vibe_pro_monthly",
    yearly: (extra["iapYearlySubId"] as string) ?? "vibe_pro_yearly",
    lifetime: (extra["iapLifetimeId"] as string) ?? "vibe_pro_lifetime",
  };
}
