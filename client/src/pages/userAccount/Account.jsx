/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBDataTable} from 'mdbreact';
import { Redirect } from 'react-router';
import axios from 'axios';

import './account.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import {Link} from "react-router-dom";

class Account extends Component {
  constructor(props) {
    super(props);

    const programType = [{
      value: '0',
      name: 'Internship Grant',
    }, {
      value: '1',
      name: 'Civic Leadership Forum Grant',
    }, {
      value: '2',
      name: 'Capacity Building Grant',
    }, {
      value: '3',
      name: 'Media Service Grant',
    }, {
      value: '4',
      name: 'Website Development Grant',
    }, {
      value: '5',
      name: 'Strategic Planning Grant',
    }];

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      status: undefined,
      programId: localStorage.getItem('programId'),
      responseMessage: null,
      redirectToNewApply: false,
      redirectToReview: false,
      redirectToLogin: false,
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
      programType,
      programData: {},
    };
  }

  async getOrgInfo(caller) {
    const getOrginfoByIdAPI = '/api/getOrgInfoById';
    try {
      const response = await axios({
        method: 'post',
        url: getOrginfoByIdAPI,
        data: caller,
      });
      // ======================== success ========================
      if (response.data.message === 'Successfully get organization information') {
        this.setState({
          status: response.data.info.user.status,
        });
        console.warn('console org finish');
      }
      } catch (error) {
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.setState({
                redirectToLogin: true,
              });
            }
          }
        }
    }
  }

  async componentDidMount() {
    const dataOrgCall = {sessionToken: this.state.sessionToken,}

    const fetchAllProgramsByOrgId = '/api/fetchAllProgramsByOrgId';
    const orgId = localStorage.getItem('orgId');
    if (orgId) {
      const { programType } = this.state;
      await axios.post(
        fetchAllProgramsByOrgId,
        {
          sessionToken: this.state.sessionToken,
          orgId: orgId,
        },
      ).then((response) => {
        const columns = [
          {
            label: 'Program',
            field: 'programType',
            sort: 'asc',
            width: 270
          },
          {
            label: 'Year',
            field: 'year',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Awarded Amount',
            field: 'awardedAmount',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Actual Amount',
            field: 'actualAmount',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Status',
            field: 'status',
            sort: 'asc',
            width: 200
          },
        ];
        const rows = (response.data.data.programs || []).map(row => {
          return {
            ...row,
            programType: <Link to={`/program/${row.objectId}`}> { row.programType ? programType.find(pT => pT.value === row.programType).name : ''} </Link>
          }
        })
        this.setState({
          programData: {
            columns: [ ...columns ],
            rows: [ ...rows ]
          },
          organization: response.data.data.organizationData,
          user: response.data.data.userData,
          columns,
          dataReceived: true,
        });

      }).catch((error) => {
        this.setState({
          dataReceived: true,
        });
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



    try {
      await this.getOrgInfo(dataOrgCall);
     } catch (error) {
       console.warn('try this.getOrgInfo error')
       if(error.response !== null && error.response !== undefined) {
         if( error.response.data !== null && error.response.data !== undefined ) {
           if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
             localStorage.clear();
             alert('Your login status was expired. Please login again.');
             this.setState({
               redirectToLogin: true,
             });
           }
         }
       }
     }
  }

  getData = (key, defaultValue = '') => {
    const data = this.state.responseMessage;
    return data[key] || defaultValue;
  }

  clickApplyBtn = () => {
    const newApplyAPI = '/api/createNewProgram';
    const currentComponent = this;
    // new apply
    if (this.state.status === 'not applied') {
      console.warn('new start');
      axios.post(
        newApplyAPI,
        { sessionToken: this.state.sessionToken },
      ).then((response) => {
        currentComponent.setState({
          responseMessage: response.data,
        });
        // ======================== success ========================
        if (this.getData('message') === 'User successfully creates a new program') {
          console.warn('account responseMessage', this.state.responseMessage);
          this.setState({
            programId: this.getData('programId'),
          });
          localStorage.setItem('programId', this.state.programId);
          this.setState({
            redirectToNewApply: true,
          });
        }
      }).catch((error) => {
        console.warn('error.response', error.response);
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
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
    } else if (this.state.status === 'applying') {
      console.warn('applying');
      this.setState({
        redirectToNewApply: true,
      });
    } else if (this.state.status === 'applied') {
      console.warn('applied');
      this.setState({
        redirectToReview: true,
      });
    } else {
      console.warn('review');
    }
  }

  render() {
    const { status, redirectToLogin } = this.state;
    if (redirectToLogin === true) return <Redirect to="/login" />;
    if (this.state.redirectToNewApply === true) return <Redirect to="/internship-application-section01" />;
    if (this.state.redirectToReview === true) return <Redirect to="/organization-application-information" />;

    const { programData, organization = {}, user = {} } = this.state;

    let buttonText = '';
    if (status === 'not applied') { buttonText = 'APPLY'; } else if (status === 'applying') buttonText = 'Continue Application';
    else buttonText = 'Review Application';

    return (
      <div className="bg-lightcolor">
        <HeaderComponent />
        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md="1" />
            <MDBCol
              md="10"
              className="text-center"
            >

              {/* my organization info section */}
              <MDBCard>
                <MDBCardBody className="mx-4">
                  <div className="text-center">
                    <h3 className="dark-grey-text mb-4">
                      <strong>Organization Home Page</strong>
                    </h3>
                  </div>

                  <MDBCol md="12" className="program-detail-sub-header font-weight-bold text-center organization-sub-header">
                    {/*<div>*/}
                    <MDBRow>
                      <div className="organization-sub-header-item">
                        Organization Name:-
                      </div>
                      <div>
                        <span> {organization.name} </span>
                      </div>
                    </MDBRow>
                    <MDBRow>
                      <div className="organization-sub-header-item">
                        Conant Name:-
                      </div>
                      <div>
                        <span> {user.username} </span>
                      </div>
                    </MDBRow>
                    <MDBRow>
                      <div className="organization-sub-header-item">
                        Email:-
                      </div>
                      <div>
                        <span> {user.emailAddress || user.email} </span>
                      </div>
                    </MDBRow>
                    <MDBRow className="mb-3">
                      <MDBCol md="3" />
                      <MDBCol md="6">
                        <MDBBtn
                          rounded
                          size={"sm"}
                          className="green-button org-view-sub-header-button btn-block z-depth-1a"
                          href="/organization-information"
                        >
                          More Details
                        </MDBBtn>
                      </MDBCol>
                      <MDBCol md="3" />
                    </MDBRow>
                    {/*</div>*/}

                    <MDBRow>
                      <MDBCol md="12">
                        <MDBDataTable
                          className="custom-table program-table"
                          striped
                          borderless
                          displayEntries={false}
                          data={programData}
                          searching={false}
                          noBottomColumns
                          info={false}
                        />
                      </MDBCol>
                    </MDBRow>
                  </MDBCol>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="1" />
          </MDBRow>

          {/* Application section */}
          <MDBRow className="pt-5">
            <MDBCol md="1" />
            <MDBCol
              md="10"
              className="text-center"
            >
              <MDBCard className="pb-3">
                <MDBCardBody className="mx-4">
                  <div className="text-center">
                    <h3 className="dark-grey-text mb-5">
                      <strong>My Application</strong>
                    </h3>
                  </div>
                  {/* ==================== intership program  ==================== */}
                  <MDBRow>
                    <MDBCol
                      md="6"
                      className="ml-1"
                    >
                      <MDBCard>
                        <MDBCardBody className="mx-4">
                          <div className="text-center">
                            <h4 className="dark-grey-text mb-4">
                              <strong>Internship Program Grant</strong>
                            </h4>
                          </div>
                          <div className="text-center mb-3">
                            <MDBBtn
                              gradient="blue"
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.clickApplyBtn}
                            >
                              { buttonText }
                            </MDBBtn>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol
                      md="5"
                      className="vertical-center"
                    >
                      <div>
                        <h5
                          id="current-status"
                          className="blue-text"
                        ><strong>{status}</strong>
                        </h5>
                        <a
                          className="dark-grey-text instruction-link"
                          href="/internship-information"
                        >
                      Internship Program Grant Instruction
                        </a>
                      </div>
                    </MDBCol>
                  </MDBRow>
                  {/* =========== Civic Leadership Forum Grant Information ============ */}
                  <MDBRow className="pt-4">
                    <MDBCol
                      md="6"
                      className="ml-1"
                    >
                      <MDBCard>
                        <MDBCardBody className="mx-4">
                          <div className="text-center">
                            <h4 className="dark-grey-text mb-4">
                              <strong>Civic Leadership Forum Grant</strong>
                            </h4>
                          </div>
                          <div className="text-center mb-3">
                            <MDBBtn
                              type="button"
                              color="blue-grey"
                              rounded
                              disabled
                              className="btn-block z-depth-1a"
                            >
                          Not Open Now
                            </MDBBtn>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol
                      md="5"
                      className="vertical-center"
                    >
                      <div>
                        {/* <h5
                      id="current-status"
                      className="blue-text"
                    ><strong>Current Status</strong>
                    </h5> */}
                        <p
                          className="disabledInstruction-link"
                        >
                      Civic Leadership Forum Grant Information<br />
                      (Not Open Yet)
                        </p>
                      </div>
                    </MDBCol>
                  </MDBRow>

                  {/* ========== Capacity Building Grant ================ */}
                  <MDBRow className="pt-4">
                    <MDBCol
                      md="6"
                      className="ml-1"
                    >
                      <MDBCard>
                        <MDBCardBody className="mx-4">
                          <div className="text-center">
                            <h4 className="dark-grey-text">
                              <strong>Capacity Building Grant</strong>
                            </h4>
                            <p>(By Invitation Only)</p>
                          </div>
                          <div className="text-center mb-3">
                            <MDBBtn
                              type="button"
                              color="blue-grey"
                              rounded
                              disabled
                              className="btn-block z-depth-1a"
                            >
                          Not Open Now
                            </MDBBtn>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol
                      md="5"
                      className="vertical-center"
                    >
                      <div>
                        {/* <h5
                      id="current-status"
                      className="blue-text"
                    ><strong>Current Status</strong>
                    </h5> */}
                        <p
                          className="disabledInstruction-link"
                          // href="#"
                        >
                      Capacity Building Grant Instruction<br />
                      (Not Open Yet)
                        </p>
                      </div>
                    </MDBCol>
                  </MDBRow>

                  {/* =========== CLUSA Technical Assistance Grants ============ */}
                  <MDBRow className="pt-4">
                    <MDBCol
                      md="6"
                      className="ml-1"
                    >
                      <MDBCard>
                        <MDBCardBody className="mx-4">
                          <div className="text-center">
                            <h4 className="dark-grey-text mb-4">
                              <strong>CLUSA Technical Assistance Grants</strong>
                            </h4>
                          </div>
                          <div className="text-center mb-3">
                            <MDBBtn
                              type="button"
                              color="blue-grey"
                              rounded
                              disabled
                              className="btn-block z-depth-1a"
                            >
                          Not Open Now
                            </MDBBtn>
                          </div>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol
                      md="5"
                      className="vertical-center"
                    >
                      <div>
                        {/* <h5
                      id="current-status"
                      className="blue-text"
                    ><strong>Current Status</strong>
                    </h5> */}
                        <p
                          className="disabledInstruction-link"
                        >
                      CLUSA Technical Assistance Grants Information<br />
                      (Not Open Yet)
                        </p>
                      </div>
                    </MDBCol>
                  </MDBRow>

                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="1" />
          </MDBRow>
        </MDBContainer>
        <FooterComponent />
      </div>
    );
  }
}

export default Account;
