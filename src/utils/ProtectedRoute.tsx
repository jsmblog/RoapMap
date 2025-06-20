import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../context/UserContext';

interface ProtectedRouteProps extends RouteProps {
  publicOnly?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  publicOnly = false,
  ...rest
}) => {
  const { authUser, currentUserData } = useAuthContext();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (publicOnly) {
          if (authUser && currentUserData?.verified) {
            return <Redirect to="/tab/home" />;
          }
          return children;
        }

        if (authUser) {
          return children;
        }

        return (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;