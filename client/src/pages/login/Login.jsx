/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBBtn, MDBModalFooter } from 'mdbreact';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import './login.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

// import '@font-awesome/css/font-awesome.min.css';
// import 'bootstrap-css-only/css/bootstrap.min.css';
// import 'mdbreact/dist/css/mdb.css';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';

import CLUSAlogo from '../../images/clusaLogo.png';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      shouldRedirect: false,
      redirectCLUSAVerifier: false,
      sessionToken: localStorage.getItem('sessionToken'),
      status: null,
    };
  }

  // componentDidMount() {
  //   if (this.sessionToken !== null) {
  //     const checkSessionExpireAPI = '/api/checkSessionToken';
  //     // ======================== check session expire ========================
  //     axios.post(
  //       checkSessionExpireAPI,
  //       { sessionToken: this.state.sessionToken },
  //     ).then((response) => {
  //     // ======================== valid ========================
  //       if (response.data.message === 'Your session token is valid') {
  //         console.warn('in login response.data', response.data);
  //         this.setState({
  //           isAuthenticated: true,
  //           userType: response.data.user.userType,
  //         });
  //         console.warn(' Log in usertype = ', this.state.userType);
  //         if (this.state.userType === '0') {
  //           this.setState({
  //             redirectCLUSAVerifier: true,
  //           });
  //         }
  //         if (this.state.userType === '1') {
  //           this.setState({
  //             shouldRedirect: true,
  //           });
  //         }
  //       } else if (response.data.message === 'sessionToken expired') { // ======================== expire ========================
  //         console.warn('sessionToken expired');
  //         localStorage.clear();
  //         this.setState({
  //           isAuthenticated: false,
  //         });
  //         alert('Your login status was expired, please login again.');
  //       }
  //     }).catch((error) => {
  //       console.warn(error.response);
  //     });
  //   }
  // }

  clickLoginBtn = () => {
    const loginAPI = '/api/login';
    const loginUsername = this.state.username;
    const loginPassword = this.state.password;

    axios.post(
      loginAPI,
      { username: loginUsername,
        password: loginPassword },
    ).then((response) => {
      console.warn('login button response', response.data);
      // ======================== success, to organization account , userType === 1 ========================

      localStorage.setItem('clusa-user-id', response.data.userId);
      localStorage.setItem('clusa-role', response.data.userType);
      if (response.data.userType === '1') {
        console.warn('This is an opganizer applicant');
        this.setState({
          sessionToken: response.data.sessionToken,
          status: response.data.status,
        });
        localStorage.setItem('sessionToken', response.data.sessionToken);
        localStorage.setItem('userName', this.state.username);
        localStorage.setItem('status', this.state.status);
        localStorage.setItem('orgName', response.data.orgName);
        localStorage.setItem('orgId', response.data.orgId);
        localStorage.setItem('isAuthenticated', true);
        console.warn('login page session token', this.state.sessionToken);
        this.setState({
          shouldRedirect: true,
        });
        // console.warn('getAuth from auth in Login Page=====', Auth.getAuth());
        // ======================== success, to reviewer account, userType === 0 ========================
      } else if (response.data.userType === '0') {
        console.warn('This is a CLUSA Reviewer');
        this.setState({
          sessionToken: response.data.sessionToken,
        });

        localStorage.setItem('sessionToken', response.data.sessionToken);
        localStorage.setItem('userName', this.state.username);
        localStorage.setItem('isAuthenticated', true);
        this.setState({
          redirectCLUSAVerifier: true,
        });
        // console.warn('getAuth from auth in Login Page=====', Auth.getAuth());
      } else if (response.data.userType === '2') {
        // ======================== success, to reviewer account, userType === 2 && manager========================
        this.setState({
          sessionToken: response.data.sessionToken,
        });
        localStorage.setItem('sessionToken', response.data.sessionToken);
        localStorage.setItem('userName', this.state.username);
        localStorage.setItem('isAuthenticated', true);
        this.props.history.push('/view-program')
      } else if (response.data.userType === '3') {
        // ======================== success, to reviewer account, userType === 3 && Admin========================
        this.setState({
          sessionToken: response.data.sessionToken,
        });
        localStorage.setItem('sessionToken', response.data.sessionToken);
        localStorage.setItem('userName', this.state.username);
        localStorage.setItem('isAuthenticated', true);
        this.props.history.push('/user-organization-management')
      }
    }).catch((error) => {
      console.warn(error.response);
      if(error.response !== null && error.response !== undefined) {
        if( error.response.data !== null && error.response.data !== undefined ) {
          if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
            localStorage.clear();
            alert('Your login status was expired. Please login again.');
          }
          else if (error.response.data.message === 'login: Invalid usename') {
            alert('Username is invalid, please check and try again.')
          }
          else if (error.response.data.message === 'Invalid username/password.') {
            alert('Username/password is invalid, please check and try again.')
          }
          else {
            alert('Your input is not correct, please check and try again.')
          }
        }
      }
    });
  }

  render() {
    const { username } = this.state.username;
    const { password } = this.state.password;
    // const { responseMessage } = this.state.responseMessage;

    if (this.state.shouldRedirect === true) return <Redirect to="/account" />;
    if (this.state.redirectCLUSAVerifier === true) return <Redirect to="/clusa-account" />;

    return (
      <div className="bg-withImage">
        <HeaderComponent />
        <MDBContainer className="pb-3 mb-2 mt-2">
          <img
            src={CLUSAlogo}
            className="mx-auto d-block clusalogo mb-3 mt-3"
            alt="aligment"
          />
          <MDBRow>
            <MDBCol md="3" />
            <MDBCol
              md="6"
              className="text-center"
            >
              <MDBCard>
                <MDBCardBody className="mx-4">
                  <div className="text-center">
                    <h3 className="dark-grey-text mb-5">
                      <strong>Login</strong>
                    </h3>
                  </div>
                  <MDBInput
                    label="Your account"
                    group
                    type="text"
                    validate
                    error="wrong"
                    success="right"
                    onChange={(e) => this.setState({ username: e.target.value })}
                  />
                  <MDBInput
                    label="Your password"
                    group
                    type="password"
                    validate
                    containerClass="mb-0"
                    onChange={(e) => this.setState({ password: e.target.value })}
                  />
                  {username}
                  <br />
                  {password}
                  {/* ================== button group =================== */}
                  <div className="text-center mb-3">
                    <MDBBtn
                      gradient="blue"
                      rounded
                      className="btn-block z-depth-1a"
                      onClick={this.clickLoginBtn}
                    >
                  Sign in
                    </MDBBtn>
                  </div>
                </MDBCardBody>
                <MDBModalFooter className="mx-5 pt-3 mb-1">
                  <div className="font-small blue-text justify-content forget-password">
                    Forgot
                    <Link to="/forget-password" className="blue-text ml-1">
                      Password?
                    </Link>
                  </div>
                  <p className="font-small grey-text d-flex justify-content-end">
                Don&apos;t have an account?
                    <a
                      href="/register"
                      className="blue-text ml-1"
                    >
                  Sign Up
                    </a>
                  </p>
                </MDBModalFooter>
              </MDBCard>
            </MDBCol>
            <MDBCol md="3" />
          </MDBRow>
        </MDBContainer>
        <br />
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }
}

export default Login;
