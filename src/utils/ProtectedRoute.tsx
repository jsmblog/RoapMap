import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../context/UserContext';

interface ProtectedRouteProps extends RouteProps {
  publicOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  publicOnly = false,
  ...rest
}) => {
  const { authUser } = useAuthContext();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (publicOnly) {
          return authUser
            ? <Redirect to="/tab/home" />
            : (React.isValidElement(children) ? children : <>{children}</>);
        }

        return authUser
          ? (React.isValidElement(children) ? children : <>{children}</>)
          : <Redirect to={{
              pathname: '/unauthorized',
              state: { from: location }
            }} />;
      }}
    />
  );
};

export default ProtectedRoute;
