
export interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  capacity: number;
  capacityLabel: string;
  price: number;
  features: string[];
  isLocked: boolean;
  requirementText?: string;
  accentColor: 'lime' | 'cyan' | 'fuchsia';
  recommended?: boolean;
}

export interface UserStats {
  currentSubscribers: number;
  channelUrl: string;
}

export interface SongConfiguration {
  count: number;
  isValid: boolean;
  status: 'safe' | 'warning' | 'danger';
  message: string;
}
