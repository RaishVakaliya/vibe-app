import React from 'react';
import { router } from 'expo-router';
import { HomeScreen } from '@presentation/screens/HomeScreen';
import { useAuthStore } from '@presentation/store/authStore';
import { useGameStore } from '@presentation/store/gameStore';
import type { GameCategory } from '@core/constants';

export default function HomeTab() {
  const user = useAuthStore((s) => s.user);
  const { setCategory } = useGameStore();

  const handleCategoryPress = (category: GameCategory) => {
    setCategory(category);
    router.push(`/game/${category}`);
  };

  return (
    <HomeScreen
      userName={user?.name ?? ''}
      streak={user?.streak ?? 0}
      coins={user?.coins ?? 0}
      isPremium={user?.isPremium ?? false}
      onCategoryPress={handleCategoryPress}
      onDailyQuestion={() => router.push('/game/daily-question')}
      onPremium={() => router.push('/premium')}
      onSearch={() => router.push('/search')}
      onProfile={() => router.push('/(tabs)/profile')}
      onCoins={() => router.push('/premium')}
    />
  );
}
