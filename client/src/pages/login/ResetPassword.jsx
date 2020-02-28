import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBModalFooter, MDBModal, MDBModalHeader, MDBModalBody } from 'mdbreact';
import axios from 'axios';

import './ForgetPassword.css';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import {queryStringToJSON} from "../../utils/util";

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      userId: '',
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
    history.push('/user-organization-management');
  };

  componentWillMount() {
    const { match = {}, history } = this.props;

    if (!match.params) {
      alert('Not having proper data to access this route');
      return history.goBack();
    }

    if (!this.props.match.params.id) {
      alert('Not having proper data to access this route');
      return history.goBack();
    }

    this.setState({
      userId: this.props.match.params.id,
    });
  }

  clickResetPassword = () => {
    const forgetPasswordAPI = '/api/resetPasswordById';
    const { password, newPassword, userId } = this.state;

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
      {
        newPassword: password,
        userId
      },
    ).then((response) => {
      this.props.history.push('/user-organization-management');
    }).catch((error) => {
      if(error.response !== null && error.response !== undefined) {
        if (error.response.data !== null && error.response.data !== undefined) {
          if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
            localStorage.clear();
            alert('Your login status was expired. Please login again.');
            this.props.history.push('/');
          } else {
            alert(error.response.data.message);
          }
        }
      }
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { newPassword, password } = this.state;

    return (
      <div className="bg-withImage">
        <HeaderComponent />
        <MDBContainer className="pb-3 mb-2 mt-2">
          <MDBRow>
            <MDBCol md="1" />
            <MDBCol
              md="10"
              className="text-center"
            >
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
                  </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol md="1" />
          </MDBRow>
        </MDBContainer>
        <br />
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }
}

export default ResetPassword;
