/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard
} from 'mdbreact';
import axios from 'axios';

import FooterComponent from '../../Footer';
import HeaderComponent from '../../Header';

class MyAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
      formData: {},
    };
  }

  handleChange = (e) => {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.value,
      }
    });
  };

  clickCancel = () => {
    const { history } = this.props;
    history.goBack();
  }

  validate = (formData) => {
    if (!formData.username) {
      alert('Please enter username.');
      return true
    }
    if (!formData.name) {
      alert('Please enter full name address.');
      return true
    }
    const emailReg = /\S+@\S+\.\S+/;
    if (!formData.email) {
      alert('Please enter email address.');
      return true
    } else if (emailReg.test(formData.email) === false) {
      alert('Email address is invalid. So, please enter email address.');
      return true
    }

    if (!formData.password) {
      return false
    } else if (formData.password.length > 6) {
      alert('Min. password length should be 6');
      return true
    }

    if (!formData.newPassword) {
      return false
    } else if (formData.newPassword !== formData.password) {
      alert('Password does not match');
      return true
    }

    return false
  };

  handleUserPost = async () => {
    const { history } = this.props;
    const { formData, sessionToken } = this.state;

    if (this.validate(formData)) {
      return
    }

    let postData = formData;
    const fullName = postData.name.split(' ');
    postData = {
      ...postData,
      firstName: fullName.splice(0 , 1)[0],
      lastName: fullName.join(' '),
      userType: postData.role,
    };

    const updateUserByAdmin = '/api/updateUserById';
    try {
      if (this.state.postData) {
        this.state.postData.username && localStorage.setItem('userName', this.state.postData.username);
      }

      await axios({
        method: 'post',
        url: updateUserByAdmin,
        data: { ...postData, sessionToken, userId: this.state.userId },
      });
      console.warn('console User finish');
      history.goBack();
    } catch (error) {
      if(error.response !== null && error.response !== undefined) {
        if (error.response.data !== null && error.response.data !== undefined) {
          if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
            localStorage.clear();
            alert('Your login status was expired. Please login again.');
            history.push('/');
          } else {
            alert(error.response.data.message);
          }
        }
      }
    }


  };

  render() {
    const { formData: { username = '', name = '', email = '', password = '', newPassword = '' } } = this.state;

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBRow className="text-center p-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    My Account Information
                  </MDBCol>
                </MDBRow>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol md="1" />
                    <MDBCol md="10">
                      <div className="pt-4 text-left">
                        <span className="redColor">* </span>
                        <label
                          htmlFor="internship-s4-q1"
                          className="font-weight-bold text-justify"
                          style={{
                            fontSize: 'larger'
                          }}
                        >
                          Username
                        </label>
                        <input className="form-control mt-2" name="username" value={username} onChange={this.handleChange} />
                      </div>
                      <div className="pt-4 text-left">
                        <span className="redColor">* </span>
                        <label
                          htmlFor="internship-s4-q1"
                          className="font-weight-bold text-justify"
                          style={{
                            fontSize: 'larger'
                          }}
                        >
                          Full Name
                        </label>
                        <input className="form-control mt-2" name="name" value={name} onChange={this.handleChange} />
                      </div>

                      <div className="pt-4 text-left">
                        <span className="redColor">* </span>
                        <label
                          htmlFor="internship-s4-q1"
                          className="font-weight-bold text-justify"
                          style={{
                            fontSize: 'larger'
                          }}
                        >
                          Email
                        </label>
                        <input className="form-control mt-2" name="email" value={email} onChange={this.handleChange} />
                      </div>
                      <div className="pt-4 text-left">
                        <span className="redColor">* </span>
                        <label
                          htmlFor="internship-s4-q1"
                          className="font-weight-bold text-justify"
                          style={{
                            fontSize: 'larger'
                          }}
                        >
                          Password
                        </label>
                        <input className="form-control mt-2" name="password" value={password} onChange={this.handleChange} />
                      </div>
                      <div className="pt-4 text-left">
                        <span className="redColor">* </span>
                        <label
                          htmlFor="internship-s4-q1"
                          className="font-weight-bold text-justify"
                          style={{
                            fontSize: 'larger'
                          }}
                        >
                          New Password
                        </label>
                        <input className="form-control mt-2" name="newPassword" value={newPassword} onChange={this.handleChange} />
                      </div>
                      <div className="pt-4 text-center">
                        <MDBRow>
                          <MDBCol md="2"/>
                          <MDBCol md="4">
                            <MDBBtn
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.handleUserPost}
                            >
                              Submit
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="4">
                            <MDBBtn
                              color="red"
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.clickCancel}
                            >
                              Cancel
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="2"/>
                        </MDBRow>
                      </div>
                    </MDBCol>
                    <MDBCol md="1" />
                  </MDBRow>
                </MDBCardBody>
                <br />

                <br />
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  componentDidMount() {
    const getFindUserById = '/api/findUserById';

    if (this.state.userId) {
      axios.post(
        getFindUserById,
        {
          sessionToken: this.state.sessionToken,
          userId: this.state.userId,
        },
      ).then((response) => {
        console.warn('clusa response', response.data.user);

        const formData = {
          username: response.data.user.username,
          email: response.data.user.emailAddress || response.data.user.email,
          name: (response.data.user.firstName || '') + ' ' + (response.data.user.lastName || ''),
          role: response.data.user.userType,
          password: response.data.user.password,
          newPassword: response.data.user.password,
        }
        // console.warn('organizations in CLUSA', this.getData('organizations'));
        this.setState({
          formData,
        });
        // console.warn('orgAll', this.state.orgAll);

      }).catch((error) => {
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.props.history.push('/')
            } else {
              alert(error.response.data.message);
            }
          }
        }
      });
    }
  }
}

export default MyAccount;
