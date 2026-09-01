/**
 * AdManager — Centralized AdMob management
 *
 * Uses react-native-google-mobile-ads (to be installed in a dev build).
 * In Expo Go / web / test environments, all ad calls are no-ops.
 *
 * Production ad unit IDs are set via Remote Config / env vars.
 * Test IDs are used by default.
 */
import { Platform } from 'react-native';
import { AD_UNITS, AD_INTERSTITIAL_FREQUENCY } from '@core/constants';
import { Storage, STORAGE_KEYS } from '@data/datasources/LocalStorageDataSource';

// Lazy-loaded to avoid crashing in Expo Go (no native module)
type AdModule = {
  InterstitialAd: {
    createForAdRequest: (adUnitId: string) => {
      load: () => void;
      show: () => Promise<void>;
      addAdEventListener: (event: string, cb: () => void) => { remove: () => void };
    };
  };
  RewardedAd: {
    createForAdRequest: (adUnitId: string) => {
      load: () => void;
      show: () => Promise<void>;
      addAdEventListener: (event: string, cb: (reward?: { amount: number }) => void) => { remove: () => void };
    };
  };
  AdEventType: { LOADED: string; ERROR: string; CLOSED: string };
  RewardedAdEventType: { LOADED: string; EARNED_REWARD: string; ERROR: string };
};

let adModule: AdModule | null = null;

function getAdModule(): AdModule | null {
  if (adModule) return adModule;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    adModule = require('react-native-google-mobile-ads') as AdModule;
    return adModule;
  } catch {
    return null;
  }
}

function getInterstitialUnitId(): string {
  return Platform.OS === 'ios' ? AD_UNITS.INTERSTITIAL_IOS : AD_UNITS.INTERSTITIAL_ANDROID;
}

function getRewardedUnitId(): string {
  return Platform.OS === 'ios' ? AD_UNITS.REWARDED_IOS : AD_UNITS.REWARDED_ANDROID;
}

class AdManagerClass {
  private interstitialRoundCount = 0;

  initialize(): void {
    const module = getAdModule();
    if (!module) {
      console.info('[AdManager] Native ad module not available (Expo Go / web)');
      return;
    }
    console.info('[AdManager] Initialized');
  }

  /**
   * Call after each game round. Shows interstitial every N rounds.
   * N is configured via Remote Config (default: AD_INTERSTITIAL_FREQUENCY).
   */
  onRoundCompleted(frequency = AD_INTERSTITIAL_FREQUENCY): void {
    this.interstitialRoundCount++;
    if (this.interstitialRoundCount >= frequency) {
      this.interstitialRoundCount = 0;
      void this.showInterstitial();
    }
  }

  async showInterstitial(): Promise<void> {
    const module = getAdModule();
    if (!module) return;
    try {
      const ad = module.InterstitialAd.createForAdRequest(getInterstitialUnitId());
      await new Promise<void>((resolve, reject) => {
        const loadedSub = ad.addAdEventListener(module.AdEventType.LOADED, () => {
          loadedSub.remove();
          resolve();
        });
        const errorSub = ad.addAdEventListener(module.AdEventType.ERROR, () => {
          errorSub.remove();
          reject(new Error('Ad failed to load'));
        });
        ad.load();
      });
      await ad.show();
    } catch (e) {
      console.warn('[AdManager] Interstitial failed:', e);
    }
  }

  async showRewarded(onReward: (amount: number) => void): Promise<void> {
    const module = getAdModule();
    if (!module) {
      // Dev fallback — grant reward
      onReward(20);
      return;
    }
    try {
      const ad = module.RewardedAd.createForAdRequest(getRewardedUnitId());
      let rewarded = false;
      await new Promise<void>((resolve, reject) => {
        const loadedSub = ad.addAdEventListener(module.RewardedAdEventType.LOADED, () => {
          loadedSub.remove();
          resolve();
        });
        const rewardSub = ad.addAdEventListener(
          module.RewardedAdEventType.EARNED_REWARD,
          (reward) => {
            rewardSub.remove();
            rewarded = true;
            onReward(reward?.amount ?? 20);
          }
        );
        const errorSub = ad.addAdEventListener(module.RewardedAdEventType.ERROR, () => {
          errorSub.remove();
          reject(new Error('Rewarded ad failed'));
        });
        ad.load();
      });
      await ad.show();
      if (!rewarded) {
        console.info('[AdManager] Rewarded ad closed without reward');
      }
    } catch (e) {
      console.warn('[AdManager] Rewarded ad failed:', e);
    }
  }
}

export const AdManager = new AdManagerClass();
