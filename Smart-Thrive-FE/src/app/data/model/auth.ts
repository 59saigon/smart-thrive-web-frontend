export interface LoginUser {
  usernameOrEmail: string; // Required field, not nullable
  password: string; // Required field, not nullable
  isRemember: boolean;
}

export interface LoginWithtAnother {
  email: string; // Required field, not nullable
  email_verified: boolean;
}

export interface RegisterUser {
  fullName: string; // Required field, not nullable
  email: string; // Nullable
  dob: Date; // Required field
  address: string; // Nullable
  gender: string; // Nullable
  phone: string; // Required field, not nullable
  username: string; // Required field, not nullable
  password: string; // Required field, not nullable
}
