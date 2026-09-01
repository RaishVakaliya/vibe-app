import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Trophy,
  Bookmark,
  Settings as SettingsIcon,
  Bell,
  Info,
  Shield,
  FileText,
  ChevronRight,
  Flame,
  MessageSquare,
  Gamepad2,
  LogIn,
  Crown,
} from 'lucide-react-native';
import { palette } from '@core/theme/colors';
import { fontFamily, fontSize } from '@core/theme/typography';
import { spacing, radius } from '@core/theme/spacing';
import { useAuthStore } from '@presentation/store/authStore';
import { authRepository } from '@data/repositories/FirebaseAuthRepository';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  badge?: string;
  isDestructive?: boolean;
}

function MenuItem({ icon, label, onPress, badge, isDestructive = false }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={menuStyles.item}
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="menuitem"
      activeOpacity={0.7}
    >
      <View style={menuStyles.iconContainer}>{icon}</View>
      <Text style={[menuStyles.itemLabel, isDestructive && { color: palette.coralRose }]}>
        {label}
      </Text>
      {badge && (
        <View style={menuStyles.badge}>
          <Text style={menuStyles.badgeText}>{badge}</Text>
        </View>
      )}
      <ChevronRight size={18} color={palette.textMuted} />
    </TouchableOpacity>
  );
}

const menuStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing['3'],
    borderBottomWidth: 1,
    borderBottomColor: '#263242',
    gap: spacing['3'],
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    flex: 1,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    color: palette.textPrimary,
  },
  badge: {
    backgroundColor: '#263242',
    paddingHorizontal: spacing['2'],
    paddingVertical: 2,
    borderRadius: radius.xs,
    marginRight: spacing['1'],
  },
  badgeText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 10,
    color: palette.warmAmber,
  },
});

export default function ProfileTab() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const upgradeGuestAccount = useAuthStore((s) => s.upgradeGuestAccount);
  const isGuest = user?.isGuest ?? true;

  const [linking, setLinking] = useState(false);

  const displayName = user?.name ?? 'Player';
  const initials = displayName.charAt(0).toUpperCase();

  const handleLinkGoogle = async () => {
    setLinking(true);
    try {
      const upgradedUser = await authRepository.linkWithGoogle();
      useAuthStore.getState().setUser(upgradedUser);
      Alert.alert('Account Linked', `Successfully connected as ${upgradedUser.email || upgradedUser.name}. Your coins, streak, and custom packs are safely preserved.`);
    } catch (e: any) {
      if (e?.code === 'auth/credential-already-in-use') {
        Alert.alert(
          'Account Already Exists',
          'This Google account is already registered. Would you like to switch and log into that account? Your existing saved progress on that account will be loaded.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Sign In to Account',
              onPress: async () => {
                try {
                  const existingUser = await authRepository.signInWithGoogle();
                  useAuthStore.getState().setUser(existingUser);
                  Alert.alert('Welcome Back', `Logged in as ${existingUser.email || existingUser.name}.`);
                } catch (err: any) {
                  Alert.alert('Sign-In Error', err?.message || 'Failed to sign in.');
                }
              },
            },
          ]
        );
      } else if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'SIGN_IN_CANCELLED') {
      } else {
        Alert.alert('Google Sign-In Error', e?.message || 'Unable to connect Google account. Please check Google Play Services and try again.');
      }
    } finally {
      setLinking(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#161B22" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userType}>
              {isGuest ? 'Guest Player' : user?.email ?? 'Connected Player'}
            </Text>
          </View>
          {user?.isPremium && (
            <View style={styles.proTag}>
              <Crown size={12} color="#0A0D12" />
              <Text style={styles.proTagText}>PRO</Text>
            </View>
          )}
        </View>

        {isGuest && (
          <View style={styles.upgradeCard}>
            <View style={styles.upgradeHeader}>
              <LogIn size={20} color={palette.warmAmber} />
              <Text style={styles.upgradeTitle}>Save Your Progress</Text>
            </View>
            <Text style={styles.upgradeDesc}>
              Link with Google to keep your {user?.coins ?? 0} coins, {user?.streak ?? 0}-day streak, and custom packs synced.
            </Text>
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={() => void handleLinkGoogle()}
              disabled={linking}
              activeOpacity={0.85}
            >
              <Text style={styles.googleBtnText}>
                {linking ? 'Connecting...' : 'Sign in with Google'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Gamepad2 size={20} color={palette.warmAmber} />
            <Text style={styles.statValue}>{user?.gamesPlayed ?? 0}</Text>
            <Text style={styles.statLabel}>Games Played</Text>
          </View>

          <View style={styles.statBox}>
            <MessageSquare size={20} color={palette.sageTeal} />
            <Text style={styles.statValue}>{user?.questionsAnswered ?? 0}</Text>
            <Text style={styles.statLabel}>Answered</Text>
          </View>

          <View style={styles.statBox}>
            <Flame size={20} color={palette.coralRose} />
            <Text style={styles.statValue}>{user?.streak ?? 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          <MenuItem
            icon={<Trophy size={18} color={palette.warmAmber} />}
            label={t('profile.achievements', 'Achievements')}
            onPress={() => router.push('/achievements')}
          />
          <MenuItem
            icon={<Bookmark size={18} color={palette.textSecondary} />}
            label={t('profile.favorites', 'Saved Questions & Packs')}
            onPress={() => router.push('/(tabs)/favorites')}
          />
          <MenuItem
            icon={<Bell size={18} color={palette.textSecondary} />}
            label={t('profile.notifications', 'Notifications')}
            onPress={() => router.push('/notifications')}
          />
          <MenuItem
            icon={<SettingsIcon size={18} color={palette.textSecondary} />}
            label={t('profile.settings', 'Settings')}
            onPress={() => router.push('/settings')}
          />
          <MenuItem
            icon={<Info size={18} color={palette.textSecondary} />}
            label={t('profile.about', 'About VIBE')}
            onPress={() => router.push('/about')}
          />
          <MenuItem
            icon={<Shield size={18} color={palette.textSecondary} />}
            label={t('profile.privacy', 'Privacy Policy')}
            onPress={() => router.push('/privacy')}
          />
          <MenuItem
            icon={<FileText size={18} color={palette.textSecondary} />}
            label={t('profile.terms', 'Terms of Service')}
            onPress={() => router.push('/terms')}
          />
        </View>

        <Text style={styles.versionText}>VIBE • Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#161B22',
  },
  scroll: {
    paddingHorizontal: spacing['4'],
    paddingBottom: 100,
    paddingTop: spacing['2'],
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2733',
    borderRadius: radius.xl,
    padding: spacing['4'],
    borderWidth: 1,
    borderColor: '#263242',
    marginBottom: spacing['4'],
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.warmAmber,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing['3'],
  },
  avatarInitial: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: '#0A0D12',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.lg,
    color: palette.textPrimary,
  },
  userType: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: palette.textSecondary,
    marginTop: 2,
  },
  proTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.warmAmber,
    paddingHorizontal: spacing['2'],
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  proTagText: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: '#0A0D12',
  },
  upgradeCard: {
    backgroundColor: '#1F2733',
    borderRadius: radius.xl,
    padding: spacing['4'],
    borderWidth: 1,
    borderColor: palette.warmAmber,
    marginBottom: spacing['4'],
  },
  upgradeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
    marginBottom: 4,
  },
  upgradeTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.base,
    color: palette.textPrimary,
  },
  upgradeDesc: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: palette.textSecondary,
    lineHeight: fontSize.xs * 1.5,
    marginBottom: spacing['3'],
  },
  googleBtn: {
    backgroundColor: palette.warmAmber,
    paddingVertical: spacing['3'],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: '#0A0D12',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing['3'],
    marginBottom: spacing['4'],
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1F2733',
    borderRadius: radius.lg,
    padding: spacing['3'],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#263242',
  },
  statValue: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.xl,
    color: palette.textPrimary,
    marginTop: 4,
  },
  statLabel: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: palette.textSecondary,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: '#1F2733',
    borderRadius: radius.xl,
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
    borderWidth: 1,
    borderColor: '#263242',
    marginBottom: spacing['6'],
  },
  versionText: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    color: palette.textMuted,
    textAlign: 'center',
  },
});
