import React from 'react';
import {Route, Redirect} from 'react-router-dom'

export default function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        rest.isAuthenticated ? (
          <Component {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}