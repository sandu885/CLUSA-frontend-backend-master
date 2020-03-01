/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import './style.css';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import { Redirect } from 'react-router';
import axios from 'axios';
import { Link } from "react-router-dom";
// import Auth from './login/Auth';

import CLUSAlogo from '../images/clusalogo_white.png';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      userName: localStorage.getItem('userName'),
      responseMessage: null,
      redirectToLogin: false,
      clickLogOut: false,
      redirectToCLUSAccount: false,
      redirectToAccount: false,
    };
  }

  getData = (key, defaultValue = '') => {
    const data = this.state.responseMessage;
    return data[key] || defaultValue;
  }

  clickLogoutBtn = () => {
    // Auth.signout();
    const logoutAPI = '/api/logout';
    const currentComponent = this;

    axios.post(
      logoutAPI,
      { sessionToken: this.state.sessionToken },
    ).then((response) => {
      currentComponent.setState({
        responseMessage: response.data,
      });
      console.warn('responseMessage', this.state.responseMessage);
      // successfully logout ==========
      if (this.getData('message') === 'Logout success') {
        localStorage.clear();
        this.setState({
          clickLogOut: true,
        });
        alert('Logout successfully');
        window.location.reload();
      }
    }).catch((error) => {
      console.warn(error.response);
      if (error.response !== null && error.response !== undefined) {
        if (error.response.data !== null && error.response.data !== undefined) {
          if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
            localStorage.clear();
            alert('Your login status was expired. Please login again.');
            this.setState({
              redirectToLogin: true,
            });
          }
        }
      }
    });
  }

  goToMyAccount = () => {
    // if status == null >>>> clusa account
    if (localStorage.getItem('status') === null) {
      this.setState({
        redirectToCLUSAccount: true,
      });
    } else { // else >>> account
      this.setState({
        redirectToAccount: true,
      });
    }
  }

  render() {
    const { userName, clickLogOut, redirectToCLUSAccount, redirectToAccount, redirectToLogin } = this.state;
    console.log('headerheader', this.state);

    if (clickLogOut === true || redirectToLogin === true) return <Redirect to="/login" />;
    if (redirectToCLUSAccount === true) return <Redirect to="/clusa-account" />;
    if (redirectToAccount === true) return <Redirect to="/account" />;

    return (
      <div className="header">
        <MDBContainer>
          <MDBRow>
            <MDBCol
              md="6"
              className="text-left"
            >
              <button
                onClick={this.goToMyAccount}
                className="clearBackground"
              >
                <img
                  src={CLUSAlogo}
                  className="header-logo"
                  alt="aligment"
                />
              </button>
            </MDBCol>
            <MDBCol
              md="6"
              className="text-right vertical-center"
            >
              <div>
                { userName != null ? (
                  <div>
                    <span>welcome, <Link to="/my-account" className="user-name-header">{userName}</Link>  </span>
                    
                    <MDBBtn
                      rounded
                      className="logoutBtn"
                      onClick={this.clickLogoutBtn}
                    >
                    Logout
                    </MDBBtn>
                  </div>
                ) : (
                  <div>
                    <a
                      className="whiteBlue"
                      href="/"
                    >Login /
                    </a>
                    <a
                      className="whiteBlue"
                      href="/register"
                    > Register
                    </a>
                  </div>
                )}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default Header;
