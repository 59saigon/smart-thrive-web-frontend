export interface LoginUser {
  emailOrUsername: string; // Required field, not nullable
  password: string; // Required field, not nullable
  isRemember: boolean;
}
