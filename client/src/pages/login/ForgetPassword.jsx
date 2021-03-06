/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBModalFooter, MDBModal, MDBModalHeader, MDBModalBody } from 'mdbreact';
import axios from 'axios';

import './ForgetPassword.css';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';

import CLUSAlogo from '../../images/clusaLogo.png';

class ForgetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      shouldRedirect: false,
      redirectCLUSAVerifier: false,
      sessionToken: localStorage.getItem('sessionToken'),
      status: null,
      linkSend: false,
      token: this.props.location.search && this.props.location.search.substr(1, this.props.location.search.length).split('=')[1],
    };
  }

  clickCancelButton = () => {
    const { history } = this.props;
    history.push('/');
  };

  toggle = () => {
    const { linkSend } = this.state;
    this.setState({
      linkSend: !linkSend,
    })
  };

  successClickHandle = () => {
    const { history } = this.props;
    history.push('/');
  };

  clickForgetPassword = () => {
    const forgetPasswordAPI = '/api/forgetPassword';
    const { emailAddress, organization } = this.state;

    axios.post(
      forgetPasswordAPI,
      {
        emailAddress: emailAddress,
        organization: organization,
        originLocation: window.location.origin,
      },
    ).then((response) => {
      this.toggle()
    }).catch((error) => {
      console.warn(error.response);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      }
    });
  };

  clickResetPassword = () => {
    const forgetPasswordAPI = '/api/resetPassword';
    const { password, newPassword, token } = this.state;

    if (!password) {
      return alert('Please enter password');
    } else if (password.length < 6) {
      return alert('Min. password length should be 6');
    }

    if (newPassword !== password) {
      return alert('Password does not match');
    }

    axios.post(
      forgetPasswordAPI,
      { newPassword: password,
        resetPasswordToken: token },
    ).then((response) => {
      this.toggle()
    }).catch((error) => {
      console.warn(error.response);
      alert(error.response.data.message);
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    const { emailAddress, organization, token, newPassword, password } = this.state;

    return (
      <div className="bg-withImage">
        <HeaderComponent />
        <MDBContainer className="pb-3 mb-2 mt-2">
          <img
            src={CLUSAlogo}
            className="mx-auto d-block clusalogo mt-3"
            alt="aligment"
          />
          <MDBRow>
            <MDBCol
              md="12"              
            >
              {!token ?
                <MDBCard>
                  <MDBCardBody className="mx-4">
                    <div>
                      <h3>
                        <strong>Forget Username / Password</strong>
                      </h3>
                    </div>
                    <MDBRow>
                      <MDBCol
                        md="12"
                        className="font-weight-bold"
                      >Please provide Email Address:
                      </MDBCol>
                      <MDBCol md="12">
                        <input type="email" name="emailAddress" onChange={this.handleChange} className="form-control mt-2" value={emailAddress} />
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol
                        md="12"
                        className="font-weight-bold"
                      >Or Organization Name:
                      </MDBCol>
                      <MDBCol md="12">
                        <input type="text" name="organization" onChange={this.handleChange} className="form-control mt-2" value={organization} />
                      </MDBCol>
                    </MDBRow>

                    {/* ================== button group =================== */}
                    <div className="mt-3">
                      <MDBRow>
                        <MDBCol md="12">
                          <MDBBtn
                            rounded
                            className="z-depth-1a"
                            onClick={this.clickForgetPassword}
                          >
                            Submit
                          </MDBBtn>
                          <MDBBtn
                            color="danger"
                            rounded
                            className="z-depth-1a"
                            onClick={this.clickCancelButton}
                          >
                            Cancel
                          </MDBBtn>
                          <p className="mt-2">
                            Don&apos;t have an account?
                            <a
                              href="/register"
                              className="blue-text ml-1"
                            >
                              Sign Up
                            </a>
                          </p>
                        </MDBCol>                       
                      </MDBRow>
                    </div>
                  </MDBCardBody>
                </MDBCard>
                :
                <MDBCard>
                  <MDBCardBody className="mx-4">
                    <div className="text-center">
                      <h3 className="dark-grey-text mb-5">
                        <strong>Set your new password</strong>
                      </h3>
                    </div>
                    <MDBRow>
                      <MDBCol
                        md="4"
                        className="pt-3 font-weight-bold"
                      >New Password:
                      </MDBCol>
                      <MDBCol md="8">
                        <input type="password" name="password" onChange={this.handleChange} className="form-control mt-2" value={password} />
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol
                        md="4"
                        className="pt-3 font-weight-bold"
                      >Confirm Password:
                      </MDBCol>
                      <MDBCol md="8">
                        <input type="password" name="newPassword" onChange={this.handleChange} className="form-control mt-2" value={newPassword} />
                      </MDBCol>
                    </MDBRow>

                    <br />

                    {/* ================== button group =================== */}

                    {token ?
                      <div className="text-center mb-3">
                        <MDBRow>
                          <MDBCol md="6">
                            <MDBBtn
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.clickResetPassword}
                            >
                              Submit
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="6">
                            <MDBBtn
                              color="red"
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.clickCancelButton}
                            >
                              Cancel
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                      </div>
                      :
                      <div className="text-center mb-3">
                        <MDBRow>
                          <MDBCol md="6">
                            <MDBBtn
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.clickForgetPassword}
                            >
                              Submit
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="6">
                            <MDBBtn
                              color="red"
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.clickCancelButton}
                            >
                              Cancel
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                      </div>
                    }


                  </MDBCardBody>
                  <MDBModalFooter className="mx-5 pt-3 mb-1">
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
              }
            </MDBCol>
          </MDBRow>
          <MDBModal isOpen={this.state.linkSend && !this.state.token} toggle={this.toggle}>
            <MDBModalHeader>Success!</MDBModalHeader>
            <MDBModalBody>
              <p>Your account password reset link already been sent to the email address associate with the organization, please check email and login again.</p>
              <MDBBtn className="modal-success-button" color="default" onClick={this.successClickHandle}>Back to Login Page</MDBBtn>
              <MDBBtn className="modal-cancel-button"  color="danger" onClick={this.toggle}>Cancel</MDBBtn>              
            </MDBModalBody>
          </MDBModal>

          <MDBModal isOpen={this.state.linkSend && this.state.token} toggle={this.toggle}>
            <MDBModalHeader>Success!</MDBModalHeader>
            <MDBModalBody>
              <p>Password is changed successfully.</p>
              <MDBBtn className="modal-success-button" color="default" onClick={this.successClickHandle}>Back to Login Page</MDBBtn>
              <MDBBtn className="modal-cancel-button"  color="danger" onClick={this.toggle}>Cancel</MDBBtn>
            </MDBModalBody>
          </MDBModal>
        </MDBContainer>
        <br />
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }
}

export default ForgetPassword;
