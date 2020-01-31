/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import './style.css';
import { MDBContainer } from 'mdbreact';
import { Redirect } from 'react-router';
import FooterComponent from './Footer';
import HeaderComponent from './Header';


import ErrorImg from '../images/errorImage.png';

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      redirectToCLUSAccount: false,
      redirectToAccount: false,
      redirectToLogin: false,
    };
  }

  componentDidMount() {
    const currentStatus = localStorage.setItem('status', this.state.status);
    if (currentStatus !== null) {
      setTimeout((this.setState({
        redirectToAccount: true,
      })), 3000);
    } else {
      setTimeout((this.setState({
        redirectToCLUSAccount: true,
      })), 3000);
    }
  }

  render() {
    const { redirectToCLUSAccount, redirectToAccount, redirectToLogin } = this.state;
    if (redirectToCLUSAccount === true) return <Redirect to="/clusa-account" />;
    if (redirectToAccount === true) return <Redirect to="/account" />;
    if (redirectToLogin === true) return <Redirect to="/login" />;

    return (
      <div className="bg-withImage">
        <HeaderComponent />
        <MDBContainer className="text-center text-justify pt-5 mt-5">
          <h3>Woops, looks like we did not have the page you want to visit. <br />Please check the Website link and try again.</h3>
          <h5 className="mt-5">Now the page will automatically direct in 3 seconds...</h5>
          <img
            src={ErrorImg}
            className="mx-auto d-block clusalogo mb-5 mt-5"
            alt="aligment"
          />
        </MDBContainer>
        <FooterComponent />
      </div>
    );
  }
}

export default NotFound;
