import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard,
} from 'mdbreact';
import axios from 'axios';
import moment from 'moment';

import FooterComponent from '../../Footer';
import HeaderComponent from '../../Header';
import './programDetail.css'
import Person from "@material-ui/icons/Person";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import AssessmentIcon from '@material-ui/icons/Assessment';
import { roleBaseBreadCrumbHeading } from "../../../utils/util";

class ProgramDetail extends Component {
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
      dataReceived: false,
      programType,
      programData: {},
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
    };
  }

  handleAppCommentClick = () => {
    const { history } = this.props;
    const { programData: { program = {} }, } = this.state;
    if (program.orgId) {
      localStorage.setItem('orgId', program.orgId);
      // final-report-comment
      if (program.objectId && program.orgId) {
        history.push(`/app-review?orgId=${program.orgId}&programId=${program.objectId}`);
      }
    } else {
      alert('not having proper information to access this route');
    }
  };

  handleFinalReportCommentClick = (status) => {
    const { history } = this.props;
    const { programData: { program } } = this.state;
    localStorage.setItem('orgId', program.orgId);
    // final-report-comment
    if (program.objectId && program.orgId) {
      history.push(`/final-report-comment?orgId=${program.orgId}&programId=${program.objectId}&status=${status}`);
    }
    };
    
  handleFinalReportClick = (status) => {
    const { history } = this.props;
    const { programData: { program } } = this.state;
    localStorage.setItem('orgId', program.orgId);
    if (program.objectId && program.orgId) {
      history.push(`/final-report?orgId=${program.orgId}&programId=${program.objectId}&status=${status}`);
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { programData: { program = {}, application = [], checks = [], agreementPlacement = [], organization = {} }, programType, dataReceived, role } = this.state;
    const programName = programType.find(pT => pT.value === program.programType);

    const fifthSection = application.find(app => app.sectionIndex === "5");
    // const firstSection = application.find(app => app.sectionIndex === "1");
    // const tenthSection = application.find(app => app.sectionIndex === "10");
    const actualAwardAmount = checks.reduce((t1, t2) => (t1 || 0) + Number(t2.amount), 0);

    const headingBreadCrumbs = roleBaseBreadCrumbHeading(role);

    const currentPage = [{
      name: 'viewProgram',
      child: <li key={`viewProgram1`} className="breadcrumb-item"><HomeIcon /> <Link to={'/view-program'}>Program Management</Link></li>,
    }, {
      name: 'userOrg',
      child: <li key={`userInformation2`} className="breadcrumb-item active"><AssessmentIcon />Program Detail</li>,
    }];
    const breadCrums = role != '1' ? [{
      name: 'dashboard',
      child: <li key={`dashboard1`} className="breadcrumb-item"><HomeIcon /> <Link to={'/view-program'}>{headingBreadCrumbs} Dashboard</Link></li>,
    }, {
      name: 'programView',
      child: <li key={`programView1`} className="breadcrumb-item active"> Program Detail</li>,
    }] : [{
      name: 'orgDashboard0',
      child: <li key={`orgDashboard0`} className="breadcrumb-item"><HomeIcon /> <Link to={'/account'}> Dashboard </Link></li>,
    }, {
      name: 'orgProgramDetails1',
      child: <li key={`orgProgramDetail2`} className="breadcrumb-item active"> Program Detail</li>,
    }];

    let heading = 'Program Detail';

    return (
      <div className="bg-withImage">
        <HeaderComponent breadCrums={breadCrums} />
        <MDBContainer className="title-section">
          <MDBRow>
            <MDBCol
              md="12"
            >
              <h1>{heading}</h1>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <MDBContainer className="mb-5">
          {dataReceived &&
            <MDBRow>
              <MDBCol md="12">
                <MDBCard className="card-padding">
                  <MDBCardBody>
                    <MDBRow className="header-section">
                      <MDBCol md="12">
                        <h3>Program Info</h3>
                      </MDBCol>
                    </MDBRow>
                    <div className="program-info">
                      <MDBRow>
                        <MDBCol md="4" className="program-detail-sub-header font-weight-bold">
                          <MDBRow>
                            <MDBCol md="5">Org Name:-</MDBCol> <MDBCol md="7"> <span> {organization && organization.name && organization.name} </span></MDBCol>
                          </MDBRow>
                          <MDBRow>
                            <MDBCol md="5">Program:-</MDBCol> <MDBCol md="7"><span> {programName && programName.name} </span></MDBCol>
                          </MDBRow>
                          <MDBRow>
                            <MDBCol md="5">Applied Date:-</MDBCol> <MDBCol md="7"> <span> {program.appliedDate ? moment(program.appliedDate).format('DD/MM/YYYY') : ''} </span></MDBCol>
                          </MDBRow>
                          <MDBRow>
                            <MDBCol md="5">Intern #:-</MDBCol> <MDBCol md="7"> <span> {fifthSection && fifthSection.content && fifthSection.content['2'] ? fifthSection.content['2'] : ''} </span></MDBCol>
                          </MDBRow>
                        </MDBCol>
                        <MDBCol md="4" className="program-detail-sub-header font-weight-bold">
                          <MDBRow>
                            <MDBCol md="5">Applied Year:-</MDBCol> <MDBCol md="7"> <span> {program.appliedDate ? moment(program.appliedDate).format('YYYY') : ''} </span></MDBCol>
                          </MDBRow>
                          <MDBRow>
                            <MDBCol md="5">Award Date:-</MDBCol> <MDBCol md="7"> <span> {agreementPlacement[0] && agreementPlacement[0].placementUploadDate} </span></MDBCol>
                          </MDBRow>
                          <MDBRow>
                            <MDBCol md="5">1st Check Date:-</MDBCol> <MDBCol md="7"> <span> {checks[0] ? checks[0].date : ''} </span></MDBCol>
                          </MDBRow>
                          <MDBRow>
                            <MDBCol md="5">Actual Award Amount:-</MDBCol> <MDBCol md="7"> <span> {actualAwardAmount && actualAwardAmount} </span></MDBCol>
                          </MDBRow>
                        </MDBCol>
                        <MDBCol md="4" className="program-detail-sub-header font-weight-bold">
                          <MDBRow>
                            <MDBCol md="5">Status:-</MDBCol> <MDBCol md="7"> <span style={{ textTransform: 'capitalize' }}> {program.status ? program.status.replace(/([A-Z])/g, " $1") : ''} </span></MDBCol>
                          </MDBRow>
                          <MDBRow>
                            <MDBCol md="5">Award Amount:-</MDBCol> <MDBCol md="7"> <span> {agreementPlacement[0] && agreementPlacement[0].awardAmount} </span></MDBCol>
                          </MDBRow>
                          <MDBRow>
                            <MDBCol md="5">2nd Check Date:-</MDBCol> <MDBCol md="7"> <span> {checks[1] ? checks[1].date : ''} </span></MDBCol>
                          </MDBRow>
                        </MDBCol>
                      </MDBRow>
                    </div>
                    <MDBRow>
                      <MDBCol md="12">
                        <h3>Application Info</h3>
                      </MDBCol>

                      <MDBCol md="11" className="program-detail-sub-header font-weight-bold app-info">
                        <MDBRow>

                          <MDBCol md="4">
                            <MDBRow>
                              <MDBCol md="6">
                                Application
                              </MDBCol>
                              <MDBCol md="6">
                                <MDBBtn
                                  rounded
                                  className="application-info-button second-action-button z-depth-1a btn-block"
                                  onClick={this.handleAppCommentClick}
                                >
                                  Review
                                </MDBBtn>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>

                          <MDBCol md="4">
                            <MDBRow>
                              <MDBCol md="6">
                                Agreement
                              </MDBCol>
                              <MDBCol md="6">
                                <MDBBtn
                                  rounded
                                  className="application-info-button second-action-button z-depth-1a btn-block "
                                  onClick={() => {
                                    const { history } = this.props;

                                    const { programData: { program = {} }, role } = this.state;
                                    if (program && program.objectId && program.orgId) {
                                      if (role === '1') {
                                        return history.push(`/signed-agreement-placement?orgId=${program.orgId}&programId=${program.objectId}&orgName=${organization && organization.name ? organization.name : ""}`);
                                      }
                                      history.push(`/agreement-placement?orgId=${program.orgId}&programId=${program.objectId}&orgName=${organization && organization.name ? organization.name : ""}`);
                                    } else {
                                      return alert('Not having proper detail to access this information.')
                                      }
                                    }}
                                  >
                                  Review
                                </MDBBtn>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>


                          {this.state.role != '1' && <MDBCol md="4">
                            <MDBRow>
                              <MDBCol md="6">
                                1st Check
                                    </MDBCol>
                              <MDBCol md="6">
                                <MDBBtn
                                  rounded
                                  className="application-info-button second-action-button btn-block z-depth-1a"
                                  onClick={() => {
                                    const { history } = this.props;
                                    const { programData: { program } } = this.state;
                                    if (program) {
                                      history.push(`/checks?orgId=${program.orgId}&programId=${program.objectId}`);
                                    }
                                  }}
                                >
                                  Review
                                      </MDBBtn>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>
                          }

                          <MDBCol md="4">
                            <MDBRow>
                              <MDBCol md="6">
                                Ongoing Reports
                              </MDBCol>
                              <MDBCol md="6">
                                <MDBBtn
                                  rounded
                                  className="application-info-button second-action-button btn-block z-depth-1a"
                                  onClick={() => {
                                    const { history } = this.props;
                                    const { programData: { program } } = this.state;
                                    if (program) {
                                      history.push(`/program-report?orgId=${program.orgId}&programId=${program.objectId}&orgName=${organization && organization.name ? organization.name : ""}&status=${agreementPlacement[0] && agreementPlacement[0].status}`);
                                    }
                                  }}
                                >
                                  Review
                                </MDBBtn>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>

                          <MDBCol md="4">
                            <MDBRow>
                              <MDBCol md="6">
                                Final Report
                              </MDBCol>
                              <MDBCol md="6">
                                <MDBBtn
                                rounded
                                className="application-info-button second-action-button btn-block z-depth-1a"
                                onClick={(e) => {
                                  const status = agreementPlacement[0] ? agreementPlacement[0].status : "0"
                                  this.state.role === '1' ? this.handleFinalReportClick(status) : this.handleFinalReportCommentClick(status)
                                }}
                                >
                                Review
                                </MDBBtn>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>

                          {this.state.role != '1' && <MDBCol md="4">
                            <MDBRow>
                              <MDBCol md="6">
                                Final Check
                                  </MDBCol>
                              <MDBCol md="6">
                                <MDBBtn
                                  rounded
                                  className="application-info-button second-action-button btn-block z-depth-1a"
                                  onClick={() => {
                                    const { history } = this.props;
                                    const { programData: { program } } = this.state;
                                    if (program) {
                                      history.push(`/checks?orgId=${program.orgId}&programId=${program.objectId}`);
                                    }
                                  }}
                                >
                                  Review
                                    </MDBBtn>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>
                          }

                         {(this.state.role != '1' && this.state.role != '0') &&
                            <MDBCol md="4">
                                <MDBRow>
                                  <MDBCol md="6">
                                    Closing Comment
                                  </MDBCol>
                                  <MDBCol md="6">
                                    <MDBBtn
                                      rounded
                                      className="application-info-button second-action-button z-depth-1a btn-block"
                                      onClick={() => {
                                        const { history } = this.props;
                                        const { programData: { program } } = this.state;
                                        localStorage.setItem('orgId', program.orgId);
                                        if (program) {
                                          history.push(`/close-program?orgId=${program.orgId}&programId=${program.objectId}`);
                                        }
                                      }}
                                    >
                                      Review
                                    </MDBBtn>
                                  </MDBCol>
                                </MDBRow>
                            </MDBCol>
                          }

                        </MDBRow>
                      </MDBCol>
                      {this.state.role != '1' &&
                        <>
                          <MDBCol md="12" />
                          <MDBCol md="2">
                            <MDBBtn
                              rounded
                              color="danger"
                              className="second-action-button btn-block z-depth-1a light-green-color"
                              onClick={() => {
                                this.props.history.goBack();
                              }}
                            >
                              Back
                              </MDBBtn>
                          </MDBCol>
                        </>
                      }
                      {this.state.role == '1' &&
                        <>

                          <MDBCol md="12 text-right">
                            <div>
                              <MDBBtn
                                rounded
                                color="secondary"
                                style={{ width: '250px' }}
                                className="second-action-button z-depth-1a"
                                onClick={() => {
                                  this.props.history.push('/account')
                                }}
                              >
                                Back to Dashboard
                                </MDBBtn>
                            </div>
                          </MDBCol>

                        </>
                      }

                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          }

        </MDBContainer>
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  componentDidMount() {
    const fetchProgramDetailById = '/api/fetchProgramDetailById';

    if (this.state.sessionToken) {
      axios.post(
        fetchProgramDetailById,
        {
          sessionToken: this.state.sessionToken,
          programId: this.props.match.params ? this.props.match.params.id : ''
        },
      ).then((response) => {
        const columns = [
          {
            label: 'Organization Name',
            field: 'orgName',
            sort: 'asc',
            width: 150
          },
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
            field: 'awardedAmount',
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
        this.setState({
          programData: { ...response.data.program },
          columns,
          dataReceived: true,
        });

      }).catch((error) => {
        this.setState({
          dataReceived: true,
        });
        if (error.response !== null && error.response !== undefined) {
          if (error.response.data !== null && error.response.data !== undefined) {
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

export default ProgramDetail;
