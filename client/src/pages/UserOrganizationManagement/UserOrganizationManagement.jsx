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
import AddBox from '@material-ui/icons/AddBox';
import './UserOrganizationManagement.css';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import Person from "@material-ui/icons/Person";
import HomeIcon from "@material-ui/icons/Home";
import {Link} from "react-router-dom";

class UserOrganizationManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgAll: [],
      dataReceived: true,
      userResponse: [],
      sessionToken: localStorage.getItem('sessionToken'),
      suspensionModal: false,
      activeTab: 'user',
    };
  }

  toggle = (e, userData) => {
    this.setState({
      open: !this.state.open,
      selectedUserData: userData,
    })
  };

  toggleTab = (e, activeTab) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      activeTab,
    });
  };

  toggleSuspend = (e, orgData) => {
    this.setState({
      suspensionModal: !this.state.suspensionModal,
      selectedOrgData: orgData,
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

  suspendOrg = () => {
    const deleteUserAPI = '/api/suspendOrgById';
    const { selectedOrgData = {}, sessionToken, orgAll } = this.state;

    try {
      axios.post(
        deleteUserAPI,
        { ...selectedOrgData, orgId: selectedOrgData.objectId, sessionToken },
      ).then(async (response) => {
        const orgIndex = orgAll.findIndex(e => e.objectId === selectedOrgData.objectId);
        if (orgIndex > -1) {
          orgAll.splice(orgIndex, 1, { ...orgAll[orgIndex], isSuspended: !orgAll[orgIndex].isSuspended });
        }

        alert('Save Successfully');
        this.toggleSuspend();
        this.setState({
          orgAll: [ ...orgAll ]
        })
      })
    } catch (e) {
      this.toggleSuspend();
    }
  };

  render() {
    const { orgAll, userAll = [], dataReceived, activeTab } = this.state;
    console.log(this.state);

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

    const currentPage = <ul className="nav nav-tabs" style={{borderBottom: 'unset'}}>
      <li className="nav-item">
        <Link
          aria-current="page"
          className={`nav-link Ripple-parent ${activeTab === 'user' ? ' active': ''}`}
          data-test="nav-link"
          onClick={(lEvent) => this.toggleTab(lEvent, 'user')}
          to="#">            
          <AddBox /> User Management
          <div className="Ripple " style={{ top: '0px', left: '0px', width: '0px', height: '0px' }}/>
        </Link>
      </li>
      <li className="nav-item">
        <Link
          aria-current="page"
          className={`nav-link Ripple-parent ${activeTab === 'org' ? ' active': ''}`}
          data-test="nav-link"
          onClick={(lEvent) => this.toggleTab(lEvent, 'org')}
          to="#">
          <AddBox /> Organization Management
          <div className="Ripple " style={{ top: '0px', left: '0px', width: '0px', height: '0px' }}/>
        </Link>
      </li>
    </ul>;
    const BreadCrums = [{
      name: 'dashboard',
      child: <li key={`dashboard1`} className="breadcrumb-item"><HomeIcon/> <Link to={'/user-organization-management'}>Dashboard</Link></li>,
    }];

    return (
      <div className="bg-withImage">
        <HeaderComponent currentPage={currentPage} breadCrums={BreadCrums} />
        {activeTab === 'user' &&
          <>
            <MDBContainer className="title-section">
              <MDBRow>
                <MDBCol
                  md="8"
                >
                  <h1>User Management</h1>
                </MDBCol>
                <MDBCol
                  md="4"
                  className="text-right"
                  style={{ display: 'block' }}
                >
                  <MDBBtn
                    rounded
                    className="second-action-button z-depth-1a add-new-user "
                    style={{ float: 'right' }}
                    onClick={() => {
                      this.props.history.push(`/user-account`);
                    }}
                  >
                    <AddBox /> Add New User
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
            <MDBContainer className="">
            <MDBRow>
              <MDBCol md="12">
                <MDBCard className="card-padding">
                  {dataReceived ?
                    <div style={{ textAlign: 'center' }}>
                      <Loader type="BallTriangle" color="#4f4f4f" height={80} width={80} />
                    </div>
                    :
                    <MDBCardBody>
                      <div className="table-responsive">
                        <MDBDataTable
                          className="custom-table program-table"
                          striped
                          borderless
                          data={userTableData}
                          searching={true}
                          noBottomColumns
                          info={false}
                        />
                      </div>
                    </MDBCardBody>
                  }

                  <br />
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          </>
        }
        {activeTab === 'org' &&
          <>
            <MDBContainer className="title-section">
              <MDBRow>
                <MDBCol
                  md="12"
                >
                  <h1>Organization Management</h1>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
            <MDBContainer className="">
              <MDBRow>
                <MDBCol md="12">
                  <MDBCard>
                    {dataReceived ?
                      <div style={{ textAlign: 'center' }}>
                        <Loader type="BallTriangle" color="#4f4f4f" height={80} width={80} />
                      </div>
                      :
                      <MDBCardBody>
                        <div className="table-responsive">
                          <MDBDataTable
                            className="custom-table program-table"
                            striped
                            borderless
                            data={orgTableData}
                            searching={true}
                            noBottomColumns
                            info={false}
                          />
                        </div>
                      </MDBCardBody>
                    }
                  </MDBCard>
                  <MDBModal isOpen={this.state.open} toggle={this.toggle}>
                    <MDBModalHeader>Are you sure to delete user</MDBModalHeader>
                    <MDBModalBody className="text-center">
                      <MDBRow>
                        <MDBCol className='mb-3'>
                          <div>
                            {this.state.selectedUserData && this.state.selectedUserData.username}
                          </div>
                        </MDBCol>
                      </MDBRow>
                      <MDBBtn className="modal-success-button" color="primary" onClick={this.deleteUser}>Yes</MDBBtn>
                      <MDBBtn className="modal-cancel-button" color="danger" onClick={this.toggle}>Cancel</MDBBtn>
                    </MDBModalBody>
                  </MDBModal>
                  <MDBModal isOpen={this.state.suspensionModal} toggle={this.toggleSuspend}>
                    <MDBModalHeader>Are you sure you want to {this.state.selectedOrgData && this.state.selectedOrgData.isSuspended ? 'restore' : 'suspend' } organization</MDBModalHeader>
                    <MDBModalBody className="text-center">
                      <MDBRow>
                        <MDBCol className='mb-3'>
                          <div>
                            {this.state.selectedOrgData && this.state.selectedOrgData.name}
                          </div>
                        </MDBCol>
                      </MDBRow>
                      <MDBBtn className="modal-success-button" color="primary" onClick={this.suspendOrg}>Yes</MDBBtn>
                      <MDBBtn className="modal-cancel-button" color="danger" onClick={this.toggleSuspend}>Cancel</MDBBtn>
                    </MDBModalBody>
                  </MDBModal>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </>
        }

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
              <MDBRow className={e.isSuspended ? 'suspended-row' : ''}>
                <MDBCol md="12">
                  <MDBBtn
                    rounded
                    color="default"
                    className="first-action-button z-depth-1a"
                    onClick={() => {
                      localStorage.setItem('orgId', e.objectId);
                      this.props.history.push('/organization-information/');
                    }}
                  >
                    View
                  </MDBBtn>
                  <MDBBtn
                    rounded
                    color="success"
                    className="second-action-button z-depth-1a"
                    onClick={() => {
                      const findUser = this.state.userResponse.find(u => u.orgId === e.objectId);
                      if (!findUser)
                        return alert('User detail is not proper');
                      if (!findUser.email)
                        return alert('User detail is not proper');
                      const forgetPasswordAPI = '/api/forgetPassword';

                      axios.post(
                        forgetPasswordAPI,
                        {
                          emailAddress: findUser.email,
                          originLocation: window.location.origin,
                        },
                      ).then((response) => {
                        alert('Reset link send.')
                      }).catch((error) => {
                        alert('Something went wrong.')
                      })
                      // this.props.history.push(`/reset-password/${findUser.objectId}`);
                    }}
                  >
                    Password
                  </MDBBtn>
                  <MDBBtn
                    color="danger"
                    rounded
                    className="third-action-button z-depth-1a"
                    onClick={(event) => this.toggleSuspend(event, { ...e, userData: userDataByOrg })}
                  >
                    {e.isSuspended ? 'Suspended' : 'Suspend'}
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            </div>
          }
        });


        const usersData = Users.data.users.filter(user1 => user1.userType !== '1').map(u => {
          return {
            ...u,
            lastLogin: u.lastLogin ? moment(u.lastLogin).format('MM-DD-YYYY') : '',
            functions: 
              <MDBRow>
                 <MDBCol md="12">
                  <MDBBtn 
                    color="default"
                    rounded
                    className="first-action-button z-depth-1a"
                    onClick={() => {
                      // localStorage.setItem('orgId', [u.objectId]);
                      this.props.history.push(`/user-account/${u.objectId}`);
                    }}
                  >
                    Edit
                  </MDBBtn>                
                
                  <MDBBtn
                    color="success"
                    rounded
                    className="second-action-button z-depth-1a"
                    onClick={() => {
                      const forgetPasswordAPI = '/api/forgetPassword';
                      if (!u.email) {
                        return alert('User detail is not proper');
                      }

                      axios.post(
                        forgetPasswordAPI,
                        {
                          emailAddress: u.email || '',
                          originLocation: window.location.origin,
                        },
                      ).then((response) => {
                        alert('Reset link send.')
                      }).catch((error) => {
                        alert('Something went wrong.')
                      })
                      // this.props.history.push(`/reset-password/${u.objectId}`);
                    }}
                  >
                    Password
                  </MDBBtn>                
                
                  <MDBBtn
                    color="danger"
                    rounded
                    className="third-action-button z-depth-1a"
                    onClick={(e) => this.toggle(e, u)}
                  >
                    Delete
                  </MDBBtn>
                  </MDBCol>
              </MDBRow>
            
          }
        });

        this.setState({
          orgAll,
          userAll: usersData,
          userResponse: Users.data.users,
          dataReceived: false,
        });

    }).catch((error) => {
      console.warn(error.response);
      if(error.response !== null && error.response !== undefined) {
        if( error.response.data !== null && error.response.data !== undefined ) {
          if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
            localStorage.clear();
            alert('Your login status was expired. Please login again.');
            this.props.history.push('/')
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
