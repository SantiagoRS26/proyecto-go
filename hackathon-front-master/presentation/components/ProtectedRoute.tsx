import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/infrastructure/store';
import { useRouter } from 'next/navigation';
import { hasRole } from '@/lib/authorization';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('guest' | 'user' | 'admin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !allowedRoles.includes('guest')) {
      router.push('/auth/login');
    } else if (isAuthenticated && allowedRoles.length && !hasRole(user, allowedRoles)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user?.role, allowedRoles, router]);

  if (!isAuthenticated && allowedRoles.includes('guest')) {
    return <>{children}</>;
  }

  if (isAuthenticated && allowedRoles.length && hasRole(user, allowedRoles)) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;