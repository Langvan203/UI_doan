// API endpoints
export const API_URL = 'https://localhost:7246/api';
export const AUTH_API = {
  LOGIN: `${API_URL}/Auth/login`,
  REQUEST_FORGOT_PASSWORD: `${API_URL}/Auth/Request-forgot-password`,
  VERIFY_OTP: `${API_URL}/Auth/verify-otp`,
  RESET_PASSWORD: `${API_URL}/Auth/reset-password`,
}; 