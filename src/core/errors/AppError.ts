export type AppErrorCode =
  | 'AUTH_FAILED'
  | 'AUTH_EMAIL_IN_USE'
  | 'AUTH_WRONG_PASSWORD'
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_NETWORK_ERROR'
  | 'AUTH_CANCELLED'
  | 'FIRESTORE_PERMISSION_DENIED'
  | 'FIRESTORE_NOT_FOUND'
  | 'FIRESTORE_UNAVAILABLE'
  | 'NETWORK_NO_CONNECTION'
  | 'NETWORK_TIMEOUT'
  | 'NETWORK_SERVER_ERROR'
  | 'PURCHASE_CANCELLED'
  | 'PURCHASE_FAILED'
  | 'PURCHASE_ALREADY_OWNED'
  | 'PURCHASE_RESTORE_FAILED'
  | 'ROOM_NOT_FOUND'
  | 'ROOM_FULL'
  | 'ROOM_EXPIRED'
  | 'ROOM_INVALID_CODE'
  | 'GAME_LOAD_FAILED'
  | 'QUESTIONS_EMPTY'
  | 'AI_GENERATION_FAILED'
  | 'SHARE_FAILED'
  | 'PREMIUM_REQUIRED'
  | 'UNKNOWN';

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly userMessage: string;
  public readonly recoverable: boolean;

  constructor({
    code,
    message,
    userMessage,
    recoverable = true,
    cause,
  }: {
    code: AppErrorCode;
    message: string;
    userMessage: string;
    recoverable?: boolean;
    cause?: unknown;
  }) {
    super(message, { cause });
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage;
    this.recoverable = recoverable;
  }

  static fromFirebase(error: unknown): AppError {
    const fbError = error as { code?: string; message?: string };
    const code = fbError.code ?? '';

    if (code.includes('auth/email-already-in-use')) {
      return new AppError({
        code: 'AUTH_EMAIL_IN_USE',
        message: fbError.message ?? code,
        userMessage: 'This email is already registered. Please sign in instead.',
      });
    }
    if (code.includes('auth/wrong-password') || code.includes('auth/invalid-credential')) {
      return new AppError({
        code: 'AUTH_WRONG_PASSWORD',
        message: fbError.message ?? code,
        userMessage: 'Incorrect email or password. Please try again.',
      });
    }
    if (code.includes('auth/user-not-found')) {
      return new AppError({
        code: 'AUTH_USER_NOT_FOUND',
        message: fbError.message ?? code,
        userMessage: 'No account found with this email.',
      });
    }
    if (code.includes('auth/network-request-failed')) {
      return new AppError({
        code: 'AUTH_NETWORK_ERROR',
        message: fbError.message ?? code,
        userMessage: 'Network error. Please check your connection.',
      });
    }
    if (code.includes('permission-denied')) {
      return new AppError({
        code: 'FIRESTORE_PERMISSION_DENIED',
        message: fbError.message ?? code,
        userMessage: 'You do not have permission to do that.',
        recoverable: false,
      });
    }
    if (code.includes('not-found')) {
      return new AppError({
        code: 'FIRESTORE_NOT_FOUND',
        message: fbError.message ?? code,
        userMessage: 'Content not found.',
      });
    }
    if (code.includes('unavailable')) {
      return new AppError({
        code: 'FIRESTORE_UNAVAILABLE',
        message: fbError.message ?? code,
        userMessage: 'Service temporarily unavailable. Please try again.',
      });
    }
    return new AppError({
      code: 'UNKNOWN',
      message: fbError.message ?? 'Unknown Firebase error',
      userMessage: 'Something went wrong. Please try again.',
    });
  }

  static network(detail?: string): AppError {
    return new AppError({
      code: 'NETWORK_NO_CONNECTION',
      message: detail ?? 'No network connection',
      userMessage: 'No internet connection. Please check your connection and try again.',
    });
  }

  static premiumRequired(): AppError {
    return new AppError({
      code: 'PREMIUM_REQUIRED',
      message: 'Premium feature gated',
      userMessage: 'This feature requires VIBE PRO. Upgrade to unlock!',
      recoverable: false,
    });
  }
}
