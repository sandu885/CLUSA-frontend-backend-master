/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard, MDBInput
} from 'mdbreact';
import axios from 'axios';

import FooterComponent from '../../Footer';
import HeaderComponent from '../../Header';
import CLUSAlogo from "../../../images/clusaLogo.png";
import Person from "@material-ui/icons/Person";
import {Link} from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";

class UserAccountManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
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
    history.push('/user-organization-management');
  };

  validate = (formData) => {
    if (!formData.username) {
      alert('Please enter username.');
      return true
    }
    if (!formData.name) {
      alert('Please enter full name.');
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

    if (!formData.role) {
      alert('Please select any role for the user.');
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
    const firstName = fullName.splice(0 , 1)[0];
    postData = {
      ...postData,
      firstName: firstName,
      lastName: (fullName.join(' ') || ''),
      userType: postData.role,
    };
    let postUser, passId;

    if (this.props.match && this.props.match.params.userId) {
      passId = true;
      postUser = '/api/updateUserById';
    } else {
      passId = false;
      postUser = '/api/createUserByAdmin';
    }

    try {
      await axios({
        method: 'post',
        url: postUser,
        data: { ...postData, sessionToken, userId: passId ? this.props.match.params.userId : '' },
      });
      console.warn('console User finish');
      history.push('/user-organization-management');
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
    const { formData: { username = '', name = '', email = '', role = '' } } = this.state;
    const { match = {} } = this.props;
    // this.props.match && this.props.match.params.userId

    const currentPage = [{
      name: 'userPerson',
      child: <li key={`userPerson1`} className="breadcrumb-item"><Person/> <Link to={'/user-organization-management'}>User Management</Link></li>,
    }, {
      name: 'userOrg',
      child: <li key={`userInformation2`} className="breadcrumb-item active"><HomeIcon/>Account Information</li>,
    }];
    // const BreadCrums = [{
    //   name: 'dashboard',
    //   child: <li key={`dashboard1`} className="breadcrumb-item"><HomeIcon/> <Link to={'/user-organization-management'}>Dashboard</Link></li>,
    // }, {
    //   name: 'userAccount',
    //   child: <li key={`userAccount1`} className="breadcrumb-item"><HomeIcon/> Dashboard </li>,
    // }];

    return (
      <div className="bg-withImage">
        <HeaderComponent currentPage={currentPage} breadCrums={[]} />

        <MDBContainer className="pb-3 mb-2 mt-2">
          <img
            src={CLUSAlogo}
            className="mx-auto d-block clusalogo mt-3"
            alt="aligment"
          />
          <MDBRow>
            <MDBCol md="3" />
            <MDBCol md="6">
              <MDBCard className="card-small">
                <MDBCardBody className="mx-4">

                  <h3 className="dark-grey-text">
                    <strong> {match.params ? match.params.userId ? 'Edit ': 'Add New' : 'Add New'} Account Information</strong>
                  </h3>

                      <div className="pt-2 text-left">
                        <div
                          className="font-weight-bold text-justify"
                          style={{
                            fontSize: 'larger'
                          }}
                        >
                          <span className="redColor">* </span>
                          Username
                        </div>
                        <input className="form-control" name="username" value={username} onChange={this.handleChange} />
                      </div>

                      <div className="text-left">
                        <div
                          className="font-weight-bold text-justify"
                          style={{
                            fontSize: 'larger'
                          }}
                        >
                          <span className="redColor">* </span>
                          Full Name
                        </div>
                        <input className="form-control" name="name" value={name} onChange={this.handleChange} />
                      </div>

                      <div className="text-left">
                        <div
                          className="font-weight-bold text-justify"
                          style={{
                            fontSize: 'larger'
                          }}
                        >
                          <span className="redColor">* </span>
                          Email
                        </div>
                        <input className="form-control" name="email" value={email} onChange={this.handleChange} />
                      </div>

                      <div className="text-left">
                        <div
                          className="font-weight-bold text-justify"
                          style={{
                            fontSize: 'larger'
                          }}
                        >
                          <span className="redColor">* </span>
                          Role
                        </div>
                        <select name="role" className="browser-default custom-select" value={role} onChange={this.handleChange}>
                          <option value=''>Choose Role</option>
                          <option value="3">IT Admin</option>
                          <option value="0">Grant Reviewer</option>
                          <option value="1">Organization</option>
                          <option value="2">Grant Manager</option>
                        </select>
                      </div>

                      <div className="pt-4 text-center">
                        <MDBRow>
                          <MDBCol md="4">
                            <MDBBtn
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.handleUserPost}
                            >Submit</MDBBtn>
                          </MDBCol>
                          <MDBCol md="4">
                            <MDBBtn
                              rounded
                              color="danger"
                              className="btn-block z-depth-1a"
                              onClick={this.clickCancel}
                            >
                              Cancel
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                      </div>
                </MDBCardBody>

              </MDBCard>
            </MDBCol>
            <MDBCol md="3" />
          </MDBRow>
        </MDBContainer>

        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  componentDidMount() {
    const getFindUserById = '/api/findUserById';

    if (this.props.match && this.props.match.params.userId) {
      axios.post(
        getFindUserById,
        {
          sessionToken: this.state.sessionToken,
          userId: this.props.match.params.userId
        },
      ).then((response) => {

        console.warn('clusa response', response.data.user);
        // ======================== success ========================

        const formData = {
          username: response.data.user.username,
          email: response.data.user.emailAddress || response.data.user.email,
          name: response.data.user.firstName ? (response.data.user.firstName || '') + ' ' + (response.data.user.lastName || '') : '',
          role: response.data.user.userType,
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

export default UserAccountManagement;
