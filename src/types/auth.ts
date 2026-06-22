export interface AuthSession {
  id: string;
  email: string;
  name: string;
  provider: 'google';
  createdAt: string;
}

export interface TwoFactorState {
  isRequired: boolean;
  email: string;
  tempToken: string;
}
