/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Auth from '../login/Auth';

// import Router from '../login/Router';

import Login from '../login/Login';
import Register from '../login/Register';
import UserAccount from '../userAccount/Account';
import CLUSAAccount from '../userAccount/CLUSAAccount';

// import Route from '../login/PrivateRoute';
import InternshipInformation from '../internshipApplication/InternshipIformation';
import InternApp01 from '../internshipApplication/Section01';
import InternApp02 from '../internshipApplication/Section02';
import InternApp03 from '../internshipApplication/Section03';
import InternApp04 from '../internshipApplication/Section04';
import InternApp05 from '../internshipApplication/Section05';
import InternApp06 from '../internshipApplication/Section06';
import InternApp07 from '../internshipApplication/Section07';
import InternApp08 from '../internshipApplication/Section08';
import InternApp09 from '../internshipApplication/Section09';
import InternApp10 from '../internshipApplication/Section10';
import InternApp11 from '../internshipApplication/Section11';
import InternApp12 from '../internshipApplication/Section12';
import InternApp13 from '../internshipApplication/Section13';

import orgRegisterInfo from '../orgInfo/RegisterInfo';

import wholeApplicationInfo from '../wholeApplicationInfo/WholeApplication';

// import logo from "../../images/logo.svg";
import './App.css';

class App extends Component {
  render() {
    console.warn('Auth.getAuth()', Auth.getAuth());
    // console.warn('user type in render', this.state.userType);
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={(props) => (Auth.getAuth() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
            }}
          />
        ))}
      />
    );


    return (
      <Router>
        <div>
          <Route
            path="/"
            exact
            component={Login}
          />
          <Route
            path="/login/"
            component={Login}
          />
          <Route
            path="/register/"
            component={Register}
          />
          <PrivateRoute
            path="/clusa-account/"
            component={CLUSAAccount}
          />
          <PrivateRoute
            path="/account/"
            component={UserAccount}
          />
          {/* ------------------ organization register info section ------------------ */}
          <PrivateRoute
            path="/organization-information/"
            component={orgRegisterInfo}
          />
          {/* ------------------ whole application info section ------------------ */}
          <PrivateRoute
            path="/organization-application-information/"
            component={wholeApplicationInfo}
          />

          {/* ------------------ application section ------------------ */}
          <PrivateRoute
            path="/internship-information/"
            component={InternshipInformation}
          />
          <PrivateRoute
            path="/internship-application-section01/"
            component={InternApp01}
          />
          <PrivateRoute
            path="/internship-application-section02/"
            component={InternApp02}
          />
          <PrivateRoute
            path="/internship-application-section03/"
            component={InternApp03}
          />
          <PrivateRoute
            path="/internship-application-section04/"
            component={InternApp04}
          />
          <PrivateRoute
            path="/internship-application-section05/"
            component={InternApp05}
          />
          <PrivateRoute
            path="/internship-application-section06/"
            component={InternApp06}
          />
          <PrivateRoute
            path="/internship-application-section07/"
            component={InternApp07}
          />
          <PrivateRoute
            path="/internship-application-section08/"
            component={InternApp08}
          />
          <PrivateRoute
            path="/internship-application-section09/"
            component={InternApp09}
          />
          <PrivateRoute
            path="/internship-application-section10/"
            component={InternApp10}
          />
          <PrivateRoute
            path="/internship-application-section11/"
            component={InternApp11}
          />
          <PrivateRoute
            path="/internship-application-section12/"
            component={InternApp12}
          />
          <PrivateRoute
            path="/internship-application-section13/"
            component={InternApp13}
          />
          {/* ------------------ application section end------------------ */}
        </div>
      </Router>
    );
  }
}

export default App;
