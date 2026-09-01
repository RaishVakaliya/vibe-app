import React from 'react';
import { router } from 'expo-router';
import { OnboardingScreen } from '@presentation/screens/OnboardingScreen';
import { Storage, STORAGE_KEYS } from '@data/datasources/LocalStorageDataSource';

export default function OnboardingRoute() {
  const handleComplete = () => {
    Storage.setBoolean(STORAGE_KEYS.ONBOARDING_DONE, true);
    router.replace('/(auth)/language-select');
  };

  return <OnboardingScreen onComplete={handleComplete} />;
}
