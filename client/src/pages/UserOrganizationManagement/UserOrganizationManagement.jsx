/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBDataTable,
  MDBRow, MDBCol, MDBCard
} from 'mdbreact';
import axios from 'axios';

import './UserOrganizationManagement.css';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';

class UserOrganizationManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgAll: [],
      sessionToken: localStorage.getItem('sessionToken'),
    };
  }


  render() {
    const { orgAll, userAll = [] } = this.state;

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
          field: 'firstName',
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
                  <MDBCol>
                    User Management
                  </MDBCol>
                </MDBRow>
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
                <br />

                <MDBRow className="text-center p-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    Organization Management
                  </MDBCol>
                </MDBRow>
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

      if (this.getData('message') === 'Successfully fetch all organizations') {
        let orgAll = this.getData('organizations')

        orgAll = orgAll.map(e => {
          const userDataByOrg = Users.data.users.find((userData) => userData.orgId === e.id)
          return {
            ...e,
            username: userDataByOrg.username || '',
            email: userDataByOrg.email || '',
            lastLogin: 'Xx-xx-xx',
            functions: <div>
              <MDBRow>
                <MDBCol>
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="first-action-button btn-block z-depth-1a"
                    onClick={() => {
                      localStorage.setItem('orgId', [e.objectId]);
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
                      localStorage.setItem('orgId', [e.objectId]);
                      this.props.history.push('/organization-application-information/');
                    }}
                  >
                    View Org.
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

        const usersData = Users.data.users.map(u => {
          return {
            ...u,
            lastLogin: 'Xx-xx-xx',
            functions: <div>
              <MDBRow md="3">
                <MDBCol>
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="first-action-button btn-block z-depth-1a"
                    onClick={() => {
                      // localStorage.setItem('orgId', [u.objectId]);
                      // this.props.history.push('/organization-information/');
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
                      // localStorage.setItem('orgId', [u.objectId]);
                      // this.props.history.push('/organization-application-information/');
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
                    onClick={() => {}}
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
        });
      }
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
    });
  }


  getData = (key, defaultValue = '') => {
    const data = this.state.responseMessage;
    return data[key] || defaultValue;
  }
}

export default UserOrganizationManagement;
