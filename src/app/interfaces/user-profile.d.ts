export interface UserProfile {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  profileImageUrl: string | null;
  bio: string | null;
  role: string;
}
