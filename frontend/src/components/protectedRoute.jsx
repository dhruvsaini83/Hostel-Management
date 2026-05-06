import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component, isAdmin, ...rest }) => {
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

        if (isAdmin && !userInfo.isAdmin) {
          // Admin route but user is not admin
          return <Redirect to="/" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
