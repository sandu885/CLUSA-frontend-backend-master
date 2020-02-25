import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard,
  MDBModal, MDBModalHeader, MDBModalBody
} from 'mdbreact';
import axios from 'axios';
import moment from 'moment';

import { queryStringToJSON } from '../../utils/util'
import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import './programReport.css'

class ProgramReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      dataReceived: false,
      programReportData: [],
      formData: {},
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
      open: false,
    };
  }

  componentWillMount() {
    const { location, history } = this.props;

    const queryData = queryStringToJSON(location.search);
    if (!queryData.orgId && !queryData.programId) {
      alert('Not having proper data to access this route')
      history.goBack();
    }
    this.setState({
      ...queryData,
    });
  }

  handleFileClick = (name) => {
    const fileUpload = document.getElementsByName(name)[0];
    fileUpload.click();
  };

  handleFileChange = (e) => {
    const { formData } = this.state;
    const fieldName = e.target.name.split('-');

    this.setState({
      formData: {
        ...formData,
        [fieldName[0]]: {
          ...formData[fieldName[0]],
          [fieldName[1]]: e.target.files[0],
        }
      }
    });
  };

  validate = (data) => {
    if (!data) {
      alert('Please fill the form first');
      return true
    }
    if (!data.checkAmount) {
      alert('Please enter check Amount');
      return true
    }
    if (!data.checkId) {
      alert('Please enter check#');
      return true
    }
    if (!data.checkDate) {
      alert('Please enter check date.');
      return true
    }
    return false
  };

  handleChange = (e) => {
    const { formData } = this.state;

    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.value,
      }
    });
  };

  toggleModal = () => {
    this.setState({
      open: !this.state.open,
    })
  };

  render() {
    const { formData } = this.state;

    let heading = 'Program Report';

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBRow className="text-center pt-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    {heading}
                  </MDBCol>
                </MDBRow>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol md="1" />
                    <MDBCol md="10">
                      <MDBRow style={{ display: 'block'}}>
                        <hr/>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol md="1" />
                    <MDBCol md="1" />
                    <MDBCol md="10" className="text-center">
                      Here list all the report type, requirement and template
                    </MDBCol>
                    <MDBCol md="1" />

                    <MDBCol md="1" />
                    <MDBCol md="10">
                      <MDBRow>
                        <MDBCol md="4" className="table-header font-weight-bold">
                          Report Type
                        </MDBCol>
                        <MDBCol md="4" className="table-header font-weight-bold text-center">
                          Requirement
                        </MDBCol>
                        <MDBCol md="4" className="table-header font-weight-bold text-center">
                          Template
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md="4" className="table-header font-weight-bold">
                          Student Training Report
                        </MDBCol>
                        <MDBCol md="4" className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md="4" className="table-header font-weight-bold text-center">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload">
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md="4" className="table-header font-weight-bold">
                          Graduation Ceremony Reports
                        </MDBCol>
                        <MDBCol md="4" className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md="4" className="table-header font-weight-bold text-center">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload">
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md="4" className="table-header font-weight-bold">
                          Intern Documentation
                        </MDBCol>
                        <MDBCol md="4" className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md="4" className="table-header font-weight-bold text-center">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload">
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md="4" className="table-header font-weight-bold">
                          Other Event
                        </MDBCol>
                        <MDBCol md="4" className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md="4" className="table-header font-weight-bold text-center">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload">
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md="4" className="table-header font-weight-bold">
                          Essay Contest
                        </MDBCol>
                        <MDBCol md="4" className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md="4" className="table-header font-weight-bold text-center">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload">
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow className="pt-4">
                        <MDBCol md={12}>
                          Reports note: Please submit all Student Training, Graduation Ceremony Reports, Intern Documentation and essay Contest
                        </MDBCol>
                      </MDBRow>

                    </MDBCol>
                    <MDBCol md="1" />
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md="12">
                      <MDBRow style={{ display: 'block'}}>
                        <hr/>
                      </MDBRow>
                    </MDBCol>

                    <MDBCol md="1" />
                    <MDBCol md="11">
                      <MDBRow>
                        <MDBCol md="11">
                          <MDBRow>
                            <MDBCol md={2} className="table-header font-weight-bold">Report File</MDBCol>
                            <MDBCol md={3} className="table-header font-weight-bold">Type</MDBCol>
                            <MDBCol md={7} className="table-header font-weight-bold">Upload Date</MDBCol>

                            <MDBCol md={2}>File.pdf</MDBCol>
                            <MDBCol md={3}>Graduation Ceremony</MDBCol>
                            <MDBCol md={2}>05/19/2020</MDBCol>
                            <MDBCol md={5} style={{ display: 'flex' }}>
                              <MDBBtn
                                rounded
                                size={"sm"}
                                className="application-info-button second-action-button btn-block z-depth-1a"
                                style={{ width: '50%' }}
                              >
                                Upload/Replace
                              </MDBBtn>
                              <MDBBtn
                                rounded
                                size={"sm"}
                                className="second-action-button btn-block z-depth-1a red-color"
                                style={{ width: '40%', marginLeft: '30px' }}
                              >
                                Delete
                              </MDBBtn>
                            </MDBCol>

                          </MDBRow>
                        </MDBCol>
                        {/*<MDBCol md="2" />*/}

                        <MDBCol md="1"/>
                        <MDBCol md="9" className="pt-4">
                          <MDBCol md="4">
                            <MDBBtn
                              rounded
                              size={"sm"}
                              className="second-action-button btn-block z-depth-1a"
                              onClick={this.toggleModal}
                            >
                              Upload Report
                            </MDBBtn>
                          </MDBCol>
                        </MDBCol>
                        <MDBCol md="2"/>

                      </MDBRow>

                    </MDBCol>
                  </MDBRow>

                  <br/>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>

          <MDBModal isOpen={this.state.open} toggle={this.toggle}>
            <MDBModalBody className="text-center">
              <MDBRow>
                <MDBCol className="table-header font-weight-bold pt-3">
                  Report file:
                </MDBCol>
              </MDBRow>

              <MDBRow>
                <MDBCol md={2} />
                <MDBCol md={8} className="pt-3">
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="application-info-button second-action-button btn-block z-depth-1a"
                  >
                    Click to Upload/Replace Files
                  </MDBBtn>
                </MDBCol>
                <MDBCol md={2} />
              </MDBRow>

              <MDBRow>
                <MDBCol md={2} />
                <MDBCol md={2} className="pt-3 font-weight-bold align-item-center">
                  Type:
                </MDBCol>
                <MDBCol md={6} className="pt-3">
                  <select name="type" value={formData.type} className="browser-default custom-select" onChange={this.handleChange}>
                    <option>Choose Role</option>
                    <option value="1">Student Training</option>
                    <option value="2">Graduation Ceremony</option>
                    <option value="3">Inter Documentation</option>
                    <option value="4">Other event</option>
                    <option value="4">Essay Content</option>
                  </select>
                </MDBCol>
                <MDBCol md={2} />
              </MDBRow>

              <MDBRow className="mt-4">
                <MDBCol md={2} />
                <MDBCol md={4} className="text-center">
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="second-action-button btn-block z-depth-1a"
                    onClick={this.toggleModal}
                  >
                    Upload
                  </MDBBtn>
                </MDBCol>
                <MDBCol md={4} className="text-center">
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="second-action-button btn-block z-depth-1a red-color"
                    onClick={this.toggleModal}
                  >
                    Cancel
                  </MDBBtn>
                </MDBCol>
                <MDBCol md={2} />
              </MDBRow>
            </MDBModalBody>
          </MDBModal>

        </MDBContainer>
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  fetchProgramReport = () => {
    const fetchAllProgramReportByOrgIdProgId = '/api/fetchAllProgramReportByOrgIdProgId';
    const { orgId, programId } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllProgramReportByOrgIdProgId,
        {
          sessionToken: this.state.sessionToken,
          orgId,
          programId,
        },
      ).then((response) => {
        // const first = response.data.checks.find(e => e.type === '1') || {};
        // const second = response.data.checks.find(e => e.type === '2') || {};

        // this.setState({
        //   formData: {
        //     first: { ...first, checkAmount: first.amount, checkFile: '', checkDate: first.date, checkFileLink: first.checkFile },
        //     second: { ...second, checkAmount: second.amount, checkFile: '', checkDate: second.date, checkFileLink: second.checkFile },
        //   },
        // })

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
  };

  componentDidMount() {
    this.fetchProgramReport()
  }
}

export default ProgramReport;
