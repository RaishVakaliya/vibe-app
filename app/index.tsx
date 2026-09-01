import React from 'react';
import { Redirect } from 'expo-router';
import { Storage, STORAGE_KEYS } from '@data/datasources/LocalStorageDataSource';

export default function IndexRoute() {
  const onboardingDone = Storage.getBoolean(STORAGE_KEYS.ONBOARDING_DONE) ?? false;

  if (!onboardingDone) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}

