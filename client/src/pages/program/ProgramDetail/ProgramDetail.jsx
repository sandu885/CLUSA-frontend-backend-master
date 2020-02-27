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

  closeReport = () => {
    const { sessionToken, role, closeNote = '' } = this.state;
    const { history } = this.props;
    const programId = this.props.match.params.id;

    if (!closeNote.trim()) {
      return alert('Please enter close report to close this program.')
    }

    const postData = {
      programId, role, closeNote, sessionToken
    };

    let closeProgramURL = '/api/updateProgramCloseStatusById';

    axios.post(
      closeProgramURL,
      {
        ...postData
      },
    ).then(() => {
      alert('Program is closed');
      history.goBack();
    }).catch((error) => {
      if(error.response !== null && error.response !== undefined) {
        if( error.response.data !== null && error.response.data !== undefined ) {
          if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
            localStorage.clear();
            alert('Your login status was expired. Please login again.');
            this.props.history('/')
          } else {
            alert('Something went wrong please contact our support system');
          }
        }
      }
    });
  };

  handleAppCommentClick = () => {
    const { history } = this.props;
    const { programData: { program } } = this.state;
    localStorage.setItem('orgId', program.orgId);
    // final-report-comment
    if (program.objectId && program.orgId) {
      history.push(`/app-review?orgId=${program.orgId}&programId=${program.objectId}`);
    }
  };

  handleFinalReportCommentClick = () => {
    const { history } = this.props;
    const { programData: { program } } = this.state;
    localStorage.setItem('orgId', program.orgId);
    // final-report-comment
    if (program.objectId && program.orgId) {
      history.push(`/final-report-comment?orgId=${program.orgId}&programId=${program.objectId}`);
    }
  };

  handleFinalReportClick = () => {
    const {history} = this.props;
    const {programData: {program}} = this.state;
    localStorage.setItem('orgId', program.orgId);
    if (program.objectId && program.orgId) {
      history.push(`/final-report?orgId=${program.orgId}&programId=${program.objectId}`);
    }
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { programData: { program = {}, application = [], checks = [], agreementPlacement = [] }, programType, dataReceived, closeNote } = this.state;
    const programName = programType.find(pT => pT.value === program.programType);

    const fifthSection = application.find(app => app.sectionIndex === "5");
    const firstSection = application.find(app => app.sectionIndex === "1");
    // const tenthSection = application.find(app => app.sectionIndex === "10");
    const actualAwardAmount = checks.reduce((t1, t2) => (t1 || 0) + Number(t2.amount), 0);
    let heading = 'Program Detail Page';

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          {dataReceived &&
            <MDBRow>
              <MDBCol md="12">
                <MDBCard>
                  <MDBRow className="text-center p-3 user-org-management-header font-weight-bold">
                    <MDBCol>
                      {heading}
                    </MDBCol>
                  </MDBRow>
                  <MDBCardBody>
                    <MDBRow className="header-section">
                      <MDBCol md="12" className="text-center pt-3 sub-header font-weight-bold">
                        Program Info
                      </MDBCol>
                      <MDBCol md="12">
                        <hr/>
                      </MDBCol>
                      <MDBCol md="1" />
                      <MDBCol md="10">
                        <MDBRow>
                          <MDBCol md="5" className="program-detail-sub-header font-weight-bold">
                            <MDBRow>
                              Program:- <span> {programName && programName.name} </span>
                            </MDBRow>
                            <MDBRow>
                              Applied Date:- <span> {moment(program.createdAt).format('DD/MM/YYYY')} </span>
                            </MDBRow>
                            <MDBRow>
                              1st Check Date:- <span> {checks[0] ? checks[0].date : ''} </span>
                            </MDBRow>
                            <MDBRow>
                              Inter Placement #:- <span> {fifthSection && fifthSection.content && fifthSection.content['2'] ? fifthSection.content['2'] : ''} </span>
                            </MDBRow>
                          </MDBCol>
                          <MDBCol md="4" className="program-detail-sub-header font-weight-bold">
                            <MDBRow>
                              Year:- <span> {firstSection && firstSection.content['1'] && firstSection.content['1'].programs && firstSection.content['1'].programs[0].startYear} </span>
                            </MDBRow>
                            <MDBRow>
                              Award Date:- <span> {agreementPlacement[0] && agreementPlacement[0].placementUploadDate} </span>
                            </MDBRow>
                            <MDBRow>
                              2nd Check Date:- <span> {checks[1] ? checks[1].date : ''} </span>
                            </MDBRow>
                            <MDBRow>
                              Actual Award Amount:- <span> {actualAwardAmount && actualAwardAmount} </span>
                            </MDBRow>
                          </MDBCol>
                          <MDBCol md="3" className="program-detail-sub-header font-weight-bold">
                            <MDBRow>
                              Status:- <span style={{ textTransform: 'capitalize' }}> {program.status} </span>
                            </MDBRow>
                            <MDBRow>
                              Award Amount:- <span> {agreementPlacement[0] && agreementPlacement[0].awardAmount} </span>
                            </MDBRow>
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>
                      <MDBCol md="1" />
                    </MDBRow>
                    <br />

                    <MDBRow>
                      <MDBCol md="12" className="text-center pt-3 sub-header font-weight-bold">
                        Application Info
                      </MDBCol>
                      <MDBCol md="12">
                        <hr/>
                      </MDBCol>

                      <MDBCol md="2" />
                      <MDBCol md="8" className="program-detail-sub-header font-weight-bold app-info">

                        <MDBRow>
                          <MDBCol md="7">
                            Application Information
                          </MDBCol>
                          <MDBCol md="5">
                            <MDBBtn
                              rounded
                              size={"sm"}
                              className="application-info-button second-action-button btn-block z-depth-1a"
                              onClick={this.handleAppCommentClick}
                            >
                              Review
                            </MDBBtn>
                          </MDBCol>

                        </MDBRow>

                        <MDBRow>
                          <MDBCol md="7">
                            Agreement & Placement
                          </MDBCol>
                          <MDBCol md="5">
                            <MDBBtn
                              rounded
                              size={"sm"}
                              className="application-info-button second-action-button btn-block z-depth-1a"
                              onClick={() => {
                                const { history } = this.props;
                                const { programData: { program } } = this.state;
                                if (program.objectId && program.orgId) {
                                  history.push(`/agreement-placement?orgId=${program.orgId}&programId=${program.objectId}`);
                                }
                              }}
                            >
                              Review
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>

                        {this.state.role != '1' &&
                          <MDBRow>
                            <MDBCol md="7">
                              Send 1st Check
                            </MDBCol>
                            <MDBCol md="5">
                              <MDBBtn
                                rounded
                                size={"sm"}
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
                        }


                        <MDBRow>
                          <MDBCol md="7">
                            Program Report
                          </MDBCol>
                          <MDBCol md="5">
                            <MDBBtn
                              rounded
                              size={"sm"}
                              className="application-info-button second-action-button btn-block z-depth-1a"
                              onClick={() => {
                                const { history } = this.props;
                                const { programData: { program } } = this.state;
                                if (program) {
                                  history.push(`/program-report?orgId=${program.orgId}&programId=${program.objectId}`);
                                }
                              }}
                            >
                              Review
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>

                        <MDBRow>
                          <MDBCol md="7">
                            Final Report
                          </MDBCol>
                          <MDBCol md="5">
                            <MDBBtn
                              rounded
                              size={"sm"}
                              className="application-info-button second-action-button btn-block z-depth-1a"
                              onClick={this.state.role === '1' ? this.handleFinalReportClick : this.handleFinalReportCommentClick}
                            >
                              Review
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                        {this.state.role === '1' &&
                          <MDBRow>
                            <MDBCol md="7">
                              Final Report View
                            </MDBCol>
                            <MDBCol md="5">
                              <MDBBtn
                                rounded
                                size={"sm"}
                                className="application-info-button second-action-button btn-block z-depth-1a"
                                onClick={this.handleFinalReportCommentClick}
                              >
                                Review
                              </MDBBtn>
                            </MDBCol>
                          </MDBRow>
                        }


                        {this.state.role != '1' &&
                          <MDBRow>
                          <MDBCol md="7">
                            Send final check
                          </MDBCol>
                          <MDBCol md="5">
                            <MDBBtn
                              rounded
                              size={"sm"}
                              className="application-info-button second-action-button btn-block z-depth-1a"
                              onClick={() => {
                                const { history } = this.props;
                                const { programData: { program } } = this.state;
                                localStorage.setItem('orgId', program.orgId);
                                if (program) {
                                  history.push(`/final-check?orgId=${program.orgId}&programId=${program.objectId}`);
                                }
                              }}
                            >
                              Review
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                        }

                      </MDBCol>
                      <MDBCol md="2" />
                      <MDBCol md="12">
                        <hr/>
                      </MDBCol>


                      {this.state.role != '1' &&
                        <>
                          <MDBCol md="12" className="text-center pt-3 sub-header font-weight-bold">
                            Program Closing Report
                          </MDBCol>
                          <MDBCol md="1" />
                          <MDBCol md="10">

                            <textarea name="closeNote" className="form-control mt-2 mb-4" rows="8" value={closeNote} onChange={this.handleChange} />

                            <div style={{
                              justifyContent: 'center',
                              display: 'flex',
                            }}>
                              <div
                                style={{
                                  paddingRight: '100px',
                                }}
                              >
                                <MDBBtn
                                  rounded
                                  size={"sm"}
                                  style={{ width: '150px' }}
                                  className="second-action-button btn-block z-depth-1a red-color"
                                  onClick={this.closeReport}
                                >
                                  Close
                                </MDBBtn>
                              </div>
                              <div>
                                <MDBBtn
                                  rounded
                                  size={"sm"}
                                  style={{ width: '150px' }}
                                  className="second-action-button btn-block z-depth-1a light-green-color"
                                  onClick={() => {
                                    this.props.history.goBack();
                                  }}
                                >
                                  Back
                                </MDBBtn>
                              </div>
                            </div>
                          </MDBCol>
                          <MDBCol md="1" />
                        </>
                      }
                      {this.state.role == '1' &&
                        <>
                          <MDBCol md="1" />
                            <MDBCol md="10">
                              <div style={{
                                justifyContent: 'center',
                                display: 'flex',
                              }}>
                                <MDBBtn
                                  rounded
                                  size={"sm"}
                                  style={{ width: '250px' }}
                                  className="second-action-button btn-block z-depth-1a red-color"
                                  onClick={() => {
                                    this.history.push('/account')
                                  }}
                                >
                                  Back to Organization
                                </MDBBtn>
                              </div>
                            </MDBCol>
                          <MDBCol md="1" />
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

export default ProgramDetail;
