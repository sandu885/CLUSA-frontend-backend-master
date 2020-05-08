import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  let canAccess = false;
  const sessionToken = localStorage.getItem('sessionToken');
  const role = localStorage.getItem('cluss-role');
  canAccess = Boolean(sessionToken) && !role

  return (
    <Route {...rest} render={props => (
      canAccess ?
        <Component {...props} />
        : <Redirect to="/" />
    )} />
  );
};

export const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const sessionToken = localStorage.getItem('sessionToken');
  const mainPage = localStorage.getItem('mainPage');
  return (
    <Route {...rest} render={props => (
      sessionToken ?
        <Redirect to={mainPage} />
        : <Component {...props} />
    )} />
  );
};
