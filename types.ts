
export interface ProtocolPlan {
  id: string;
  name: string;
  tier?: string;
  features: string;
  price: number;
  status: string;
  quality?: string;
  quantity_locked?: number;
  restrictions?: string;
}

export interface ProtocolCategory {
  category: string;
  plans: ProtocolPlan[];
}

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
