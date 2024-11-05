import { UserData } from '@/core/interfaces/dto/UserData';

type Role = 'guest' | 'user' | 'admin';

export const hasRole = (
  user: UserData | null,
  allowedRoles: Role[]
): user is UserData => {
  if (!user) {
    return allowedRoles.includes('guest');
  }
  return allowedRoles.includes(user.role);
};
