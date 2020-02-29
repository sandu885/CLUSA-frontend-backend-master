/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBDataTable,
  MDBRow, MDBCol, MDBCard, MDBModalHeader, MDBModalBody, MDBModal
} from 'mdbreact';
import Loader from 'react-loader-spinner'
import axios from 'axios';
import moment from 'moment';

import './UserOrganizationManagement.css';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';

class UserOrganizationManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgAll: [],
      dataReceived: true,
      sessionToken: localStorage.getItem('sessionToken'),
    };
  }

  toggle = (e, userData) => {
    this.setState({
      open: !this.state.open,
      selectedUserData: userData,
    })
  };

  deleteUser = () => {
    const deleteUserAPI = '/api/deleteUserById';
    const { selectedUserData, userAll } = this.state;

    try {
      axios.post(
        deleteUserAPI,
        { ...selectedUserData, userId: selectedUserData.objectId, sessionToken: this.state.sessionToken },
      ).then(async (response) => {
        const userIndex = userAll.findIndex(e => e.objectId === selectedUserData.objectId);
        userAll.splice(userIndex, 1);
        this.toggle();
        this.setState({
          userAll: [ ...userAll ]
        })
      })
    } catch (e) {
      this.toggle()
    }
  };

  render() {
    const { orgAll, userAll = [], dataReceived } = this.state;

    console.log('this.state', this.state);

    const orgTableData = {
      columns: [
        {
          label: 'Username',
          field: 'username',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Organization Name',
          field: 'name',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Last Login',
          field: 'lastLogin',
          sort: 'asc',
          width: 200
        },
        {
          label: 'Functions',
          field: 'functions',
          sort: 'asc',
          width: 100
        }
      ],
      rows: [
        ...orgAll
      ]
    };

    const userTableData = {
      columns: [
        {
          label: 'Username',
          field: 'username',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Type',
          field: 'role',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Last Login',
          field: 'lastLogin',
          sort: 'asc',
          width: 200
        },
        {
          label: 'Functions',
          field: 'functions',
          sort: 'asc',
          width: 100
        }
      ],
      rows: [
        ...userAll
      ]
    };

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBRow className="text-center p-3 user-org-management-header font-weight-bold">
                  <MDBCol
                    md="2"
                  >
                    <MDBBtn
                      rounded
                      size={"sm"}
                      className="second-action-button btn-block z-depth-1a add-new-user"
                      onClick={() => {
                        this.props.history.push(`/user-account`);
                      }}
                    >
                      Add New User
                    </MDBBtn>
                  </MDBCol>
                  <MDBCol
                    md="8"
                  >
                    User Management
                  </MDBCol>
                  <MDBCol md="2"/>
                </MDBRow>
                {dataReceived ?
                  <div style={{ textAlign: 'center' }}>
                    <Loader type="BallTriangle" color="#4f4f4f" height={80} width={80} />
                  </div>
                  :
                  <MDBCardBody>
                    <MDBDataTable
                      className="custom-table"
                      striped
                      borderless
                      data={userTableData}
                      searching={true}
                      noBottomColumns
                      info={false}
                    />
                  </MDBCardBody>
                }
                <br />

                <MDBRow className="text-center p-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    Organization Management
                  </MDBCol>
                </MDBRow>
                {dataReceived ?
                  <div style={{ textAlign: 'center' }}>
                    <Loader type="BallTriangle" color="#4f4f4f" height={80} width={80} />
                  </div>
                  :
                  <MDBCardBody>
                    <MDBDataTable
                      className="custom-table"
                      striped
                      borderless
                      data={orgTableData}
                      searching={true}
                      noBottomColumns
                      info={false}
                    />
                  </MDBCardBody>
                }

                <br />
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <MDBModal isOpen={this.state.open} toggle={this.toggle}>
            <MDBModalHeader>Are you sure to delete user</MDBModalHeader>
            <MDBModalBody className="text-center">
              {this.state.selectedUserData && this.state.selectedUserData.username}
              <MDBRow className="mt-4">
                <MDBCol md="6" className="text-center">
                  <MDBBtn className="modal-success-button" color="primary" onClick={this.deleteUser}>Yes</MDBBtn>
                </MDBCol>
                <MDBCol md="6" className="text-center">
                  <MDBBtn className="modal-cancel-button" color="red" onClick={this.toggle}>Cancel</MDBBtn>
                </MDBCol>
              </MDBRow>
            </MDBModalBody>
          </MDBModal>
        </MDBContainer>


        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  componentDidMount() {
    const fetchAllOrgsAPI = '/api/fetchAllOrgs';
    const fetchAllUsersAPI = '/api/fetchAllUsers';

    const currentComponent = this;

    axios.post(
      fetchAllOrgsAPI,
      { sessionToken: this.state.sessionToken },
    ).then(async (response) => {
      currentComponent.setState({
        responseMessage: response.data,
      });
      const Users = await axios.post(
        fetchAllUsersAPI,
        { sessionToken: this.state.sessionToken },
      );

        let orgAll = this.getData('organizations');

        orgAll = orgAll.map(e => {

          const userDataByOrg = Users.data.users.find((userData) => userData.orgId === e.objectId);

          return {
            ...e,
            username: userDataByOrg ? userDataByOrg.username : '',
            lastLogin: userDataByOrg && userDataByOrg.lastLogin ? moment(userDataByOrg.lastLogin).format('MM-DD-YYYY') : '',
            email: userDataByOrg ? userDataByOrg.email || userDataByOrg.emailAddress || '' : '',
            functions: <div>
              <MDBRow>
                <MDBCol>
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="first-action-button btn-block z-depth-1a"
                    onClick={() => {
                      localStorage.setItem('orgId', e.objectId);
                      this.props.history.push('/organization-information/');
                    }}
                  >
                    Edit
                  </MDBBtn>
                </MDBCol>
                <MDBCol md="4">
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="second-action-button btn-block z-depth-1a"
                    onClick={() => {
                      const findUser = this.state.userAll.find(u => u.orgId === e.objectId);
                      if (!findUser) {
                        return alert('User detail is not proper');
                      }
                      this.props.history.push(`/reset-password/${findUser.objectId}`);
                    }}
                  >
                    Password
                  </MDBBtn>
                </MDBCol>
                <MDBCol md="5">
                  <MDBBtn
                    color="red"
                    rounded
                    size={"sm"}
                    className="third-action-button btn-block z-depth-1a"
                    onClick={() => {}}
                  >
                    {e.status}
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </div>
          }
        })


        const usersData = Users.data.users.filter(user1 => user1.userType !== '1').map(u => {
          return {
            ...u,
            lastLogin: u.lastLogin ? moment(u.lastLogin).format('MM-DD-YYYY') : '',
            functions: <div>
              <MDBRow md="3">
                <MDBCol>
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="first-action-button btn-block z-depth-1a"
                    onClick={() => {
                      // localStorage.setItem('orgId', [u.objectId]);
                      this.props.history.push(`/user-account/${u.objectId}`);
                    }}
                  >
                    Edit
                  </MDBBtn>
                </MDBCol>
                <MDBCol md="5">
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="second-action-button btn-block z-depth-1a"
                    onClick={() => {
                      this.props.history.push(`/reset-password/${u.objectId}`);
                    }}
                  >
                    Password
                  </MDBBtn>
                </MDBCol>
                <MDBCol md="4">
                  <MDBBtn
                    color="red"
                    rounded
                    size={"sm"}
                    className="third-action-button btn-block z-depth-1a"
                    onClick={(e) => this.toggle(e, u)}
                  >
                    Deleted
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </div>
          }
        });

        this.setState({
          orgAll,
          userAll: usersData,
          dataReceived: false,
        });

    }).catch((error) => {
      console.warn(error.response);
      if(error.response !== null && error.response !== undefined) {
        if( error.response.data !== null && error.response.data !== undefined ) {
          if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
            localStorage.clear();
            alert('Your login status was expired. Please login again.');
          }
        }
      }
      this.setState({
        dataReceived: false,
      });
    });
  }

  getData = (key, defaultValue = '') => {
    const data = this.state.responseMessage;
    return data[key] || defaultValue;
  }
}

export default UserOrganizationManagement;
