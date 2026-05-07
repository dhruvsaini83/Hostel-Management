import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component, roles, permissions, ...rest }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!userInfo) {
          // Not logged in
          return <Redirect to="/login" />;
        }

        // Check Roles
        if (roles && !roles.includes(userInfo.role)) {
          // Authorized role check
          return <Redirect to="/" />;
        }

        // Check Permissions (Admins bypass permission checks)
        if (permissions && userInfo.role !== 'admin') {
          const hasPermission = permissions.some(p => userInfo.permissions.includes(p));
          if (!hasPermission) {
            return <Redirect to="/" />;
          }
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
