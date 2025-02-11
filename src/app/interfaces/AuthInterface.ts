export interface LoginForm {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    token?: string;
    message?: string;
  }
  