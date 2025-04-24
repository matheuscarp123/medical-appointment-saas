import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

/**
 * Componente para proteger rotas com base no papel do usuário
 * Exibe o conteúdo apenas se o usuário tiver um dos papéis permitidos
 * Caso contrário, redireciona para a rota especificada
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard' 
}) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Carregando...
      </div>
    );
  }

  // Se o usuário não estiver autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se o usuário não tiver permissão, redireciona para a rota especificada
  if (!hasPermission(allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se o usuário tiver permissão, renderiza o conteúdo
  return <>{children}</>;
};

export default RoleBasedRoute; 