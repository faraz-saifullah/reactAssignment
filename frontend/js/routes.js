import React, { Component } from 'react';
import { Router, Route, Redirect, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import App from './views/App';
import Users from './views/Users';
import Auth from './views/auth';
import Profile from './views/Profile';
import Contact from './views/Contact';
import { ID_TOKEN_KEY } from './const';
import VerifyEmail from './views/auth/VerifyEmail';
import ResetPassword from './views/auth/ResetPassword';
import AddNewMember from './views/console/AddNewMember';
import MyIdeasScreen from './views/ideas/MyIdeasScreen';
import AllIdeasScreen from './views/ideas/AllIdeasScreen';
import ManageInvites from './views/console/ManageInvites';
import UserManagement from './views/console/UserManagement';
import CorporateSettings from './views/console/CorporateSettings';

import StatisticView from './views/statistics/Statistics';
import history from './history';

const publicPath = '/';

export const routeCodes = {
  DASHBOARD: publicPath,
  ABOUT: `${publicPath}about`,
};

function PrivateRoute({ component: Components, ...rest }) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  return (
    <Route
      {...rest}
      render={props =>
        ((token && window.location.pathname !== '/') ? (
          <Components {...props} />
        ) :
          (
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
          )
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  location: PropTypes.any,
};

function AuthRoute({ component: Components, ...rest }) {
  const token = localStorage.getItem(ID_TOKEN_KEY) || null;
  return (
    <Route
      {...rest}
      render={props =>
        ((token && window.location.pathname !== '/') ? (
          <Redirect to={{ pathname: '/all-ideas', state: { from: props.location } }} />
        ) :
          (
            <Components {...props} />
          )
        )
      }
    />
  );
}

AuthRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  location: PropTypes.any,
};

const routes = [
  {
    path: '/',
    component: Auth,
    exact: true,
    showSidebar: false,
    requireAuth: false,
  },
  {
    path: '/users',
    component: Users,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
  {
    path: '/my-ideas',
    component: MyIdeasScreen,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
  {
    path: '/all-ideas',
    component: AllIdeasScreen,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
  {
    path: '/profile',
    component: Profile,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
  {
    path: '/help',
    component: Contact,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
  {
    path: '/statistics',
    component: StatisticView,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
  {
    path: '/add-member',
    component: AddNewMember,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
  {
    path: '/manage-invites',
    component: ManageInvites,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
  {
    path: '/corporate',
    component: CorporateSettings,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
  {
    path: '/login/reset/:codeString',
    component: ResetPassword,
    exact: true,
    showSidebar: false,
    requireAuth: false,
  },
  {
    path: '/login/reset',
    component: ResetPassword,
    exact: true,
    showSidebar: false,
    requireAuth: false,
  },
  {
    path: '/auth/:inviteString',
    component: Auth,
    exact: true,
    showSidebar: false,
    requireAuth: false,
  },
  {
    path: '/verify_email',
    component: VerifyEmail,
    exact: true,
    showSidebar: false,
    requireAuth: true,
  },
  {
    path: '/user-manage',
    component: UserManagement,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
  {
    path: '*',
    component: MyIdeasScreen,
    exact: true,
    showSidebar: true,
    requireAuth: true,
  },
];

export default class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <App routes={routes}>
            <Switch>
              {
                routes.map((eachRoute) => {
                  if (eachRoute.requireAuth) {
                    return (
                      <PrivateRoute
                        key={eachRoute.path}
                        path={eachRoute.path}
                        component={eachRoute.component}
                        exact={eachRoute.exact}
                      />
                    );
                  }
                  return (
                    <AuthRoute
                      key={eachRoute.path}
                      path={eachRoute.path}
                      component={eachRoute.component}
                      exact={eachRoute.exact}
                    />
                  );
                })
              }
            </Switch>
          </App>
        </Switch>
      </Router>
    );
  }
}
