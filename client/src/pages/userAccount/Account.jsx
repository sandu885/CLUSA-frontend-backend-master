/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBDataTable} from 'mdbreact';
import Loader from "react-loader-spinner";
import { Redirect } from 'react-router';
import { Link } from "react-router-dom";
import axios from 'axios';

import './account.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import HomeIcon from "@material-ui/icons/Home";

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
      dataReceived: true,
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
    const orgId = localStorage.getItem('orgId');
    const dataOrgCall = {sessionToken: this.state.sessionToken, orgId};

    const fetchAllProgramsByOrgId = '/api/fetchAllProgramsByOrgId';
    // const orgId = localStorage.getItem('orgId');
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
            programType: <Link to={`/program/${row.objectId}`} className="link-under-line"> { row.programType ? programType.find(pT => pT.value === row.programType).name : ''} </Link>
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
          dataReceived: false,
        });

      }).catch((error) => {
        this.setState({
          dataReceived: false,
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
    let statusToCheck = ["applying", "applied&ProgramOnGoing", "inReview"];
    if(!statusToCheck.includes(this.state.status)) {
      return alert("Not allow to edit application since your application is already approved");
    }

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
          this.props.history.push('/internship-application-section01');
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
      this.props.history.push('/internship-application-section01');
    } else if (this.state.status === 'applied') {
      console.warn('applied');
      this.props.history.push('/organization-application-information');

      this.setState({
        redirectToReview: true,
      });
    } else {
      console.warn('review');
    }
  }

  render() {
    const { status, redirectToLogin, dataReceived } = this.state;
    if (redirectToLogin === true) return <Redirect to="/login" />;
    // if (this.state.redirectToNewApply === true) return <Redirect to="/internship-application-section01" />;
    // if (this.state.redirectToReview === true) return <Redirect to="/organization-application-information" />;

    const { programData, organization = {}, user = {} } = this.state;

    // let buttonText = '';
    // if (status === 'not applied') { buttonText = 'APPLY'; } else if (status === 'applying') buttonText = 'Continue Application';
    // else buttonText = 'Review Application';
    const breadCrums = [{
      name: 'orgDashboard',
      child: <li key={`agreementAndPlacement2`} className="breadcrumb-item active"> <HomeIcon/> Dashboard</li>,
    }];

    return (
      <div className="bg-lightcolor">
        <HeaderComponent breadCrums={breadCrums} />
        <MDBContainer className="title-section">
          <MDBRow>
            <MDBCol
              md="12"
            >
              <h1>Organization Home Page</h1>
            </MDBCol>            
          </MDBRow>
        </MDBContainer>
        <MDBContainer>
          <MDBRow>
            <MDBCol
              md="12"              
            >
              <MDBCard>
                <MDBCardBody className="mx-4">
                  <div className="grey-bg" style={{ padding: '15px 30px 15px 30px' }}>
                    <MDBRow>
                      <MDBCol md="3" className="pt-2">
                        <strong>Organization Name: </strong><span> {organization.name} </span>
                      </MDBCol>                   
                      <MDBCol md="3" className="pt-2">
                      <strong>Conant Name: </strong><span> {user.username} </span>
                      </MDBCol>                   
                      <MDBCol md="3" className="pt-2">
                      <strong>Email: </strong><span> {user.emailAddress || user.email} </span>
                      </MDBCol>
                      <MDBCol md="3">
                      <MDBBtn
                          rounded
                          style={{ margin: '0' }}
                          className="green-button org-view-sub-header-button z-depth-1a"
                          href="/organization-information"
                        >
                          More Details
                        </MDBBtn>
                      </MDBCol>
                    </MDBRow>
                  </div>
                
                  <MDBCol md="12" className="program-detail-sub-header font-weight-bold organization-sub-header">
                    <MDBRow>
                      <MDBCol md="12">
                        {dataReceived ?
                          <div style={{textAlign: 'center'}}>
                            <Loader type="BallTriangle" color="#4f4f4f" height={80} width={80}/>
                          </div>
                          :
                          <div className="table-responsive">
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
                          </div>
                        }
                      </MDBCol>
                    </MDBRow>
                  </MDBCol>
                        
                  <div className="offer-box-row">
                    <h3>ALL GRANTS PROGRAM</h3>
                    <MDBRow>
                      <MDBCol md="3">
                        <div style={{ cursor: 'pointer' }} className="offer-box" onClick={this.clickApplyBtn}>
                            <p>Internship Program Grant</p>
                            <h5
                                  id="current-status"
                                  className="blue-text"
                              >
                              </h5>
                              <p><Link
                                  className="instruction-link"
                                  to="/internship-information"
                              >
                                  Internship Program Grant Instruction
                                  </Link></p>
                        </div>
                      </MDBCol>
                    </MDBRow>
                  </div>
                  {/*    <MDBCol md="3">*/}
                  {/*      <div className="offer-box">*/}
                  {/*          <p>Civic Leadership Forum Grant<br></br>*/}
                  {/*          <span>Civic Leadership Forum Grant Information</span></p>*/}
                  {/*          <MDBBtn*/}
                  {/*            rounded*/}
                  {/*            style={{ margin: '0' }}*/}
                  {/*            disabled*/}
                  {/*            className="green-button org-view-sub-header-button z-depth-1a"*/}
                  {/*            onClick={() =>{*/}
                  {/*              if (this.props.match.params.id) {*/}
                  {/*                localStorage.setItem('orgId', this.props.match.params.id);*/}
                  {/*              }*/}
                  {/*              this.props.history.push('/organization-information');*/}
                  {/*            }}*/}
                  {/*          >*/}
                  {/*            Not Open Yet*/}
                  {/*          </MDBBtn>*/}
                  {/*      </div>*/}
                  {/*    </MDBCol>*/}
                  {/*    <MDBCol md="3">*/}
                  {/*      <div className="offer-box">*/}
                  {/*          <p>Capacity Building Grant <br></br><span>(By Invitation Only)</span></p>*/}
                  {/*          <MDBBtn*/}
                  {/*            rounded*/}
                  {/*            style={{ margin: '0' }}*/}
                  {/*            disabled*/}
                  {/*            className="green-button org-view-sub-header-button z-depth-1a"*/}
                  {/*            onClick={() =>{*/}
                  {/*              if (this.props.match.params.id) {*/}
                  {/*                localStorage.setItem('orgId', this.props.match.params.id);*/}
                  {/*              }*/}
                  {/*              this.props.history.push('/organization-information');*/}
                  {/*            }}*/}
                  {/*          >*/}
                  {/*            Not Open Yet*/}
                  {/*          </MDBBtn>*/}
                  {/*      </div>*/}
                  {/*    </MDBCol>*/}
                  {/*    <MDBCol md="3">*/}
                  {/*      <div className="offer-box">*/}
                  {/*          <p>CLUSA Technical Assistance Grants<br></br><span>CLUSA Technical Assistance Grants Information</span></p>*/}
                  {/*          <MDBBtn*/}
                  {/*            rounded*/}
                  {/*            style={{ margin: '0' }}*/}
                  {/*            disabled*/}
                  {/*            className="green-button org-view-sub-header-button z-depth-1a"*/}
                  {/*            onClick={() =>{*/}
                  {/*              if (this.props.match.params.id) {*/}
                  {/*                localStorage.setItem('orgId', this.props.match.params.id);*/}
                  {/*              }*/}
                  {/*              this.props.history.push('/organization-information');*/}
                  {/*            }}*/}
                  {/*          >*/}
                  {/*            Not Open Yet*/}
                  {/*          </MDBBtn>*/}
                  {/*      </div>*/}
                  {/*    </MDBCol>*/}
                  {/*  </MDBRow>*/}
                  {/*</div>*/}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="1" />
          </MDBRow>

          {/* Application section */}
          
        </MDBContainer>
        <FooterComponent />
      </div>
    );
  }
}

export default Account;
