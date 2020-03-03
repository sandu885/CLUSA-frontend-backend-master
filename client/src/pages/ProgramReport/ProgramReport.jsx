import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard,
  MDBModal, MDBModalBody
} from 'mdbreact';
import axios from 'axios';

import { queryStringToJSON } from '../../utils/util'
import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import CLUSAStudentTrainingReport from '../../images/CLUSA-Student-Training-Report.xlsx';
import CLUSAGraduationCeremonyReport from '../../images/CLUSA-Graduation-Ceremony-Report.xlsx';
import CLUSAInternshipBudget from '../../images/CLUSA Internship -budget-template.xlsx';
import CLUSAEssayContest from '../../images/CLUSA-Essay-Contest.xlsx';

import './programReport.css'

const reportType  = [
  { value: '1', name: 'Student Training' },
  { value: '2', name: 'Graduation Ceremony' },
  { value: '3', name: 'Inter Documentation' },
  { value: '4', name: 'Other event' },
  { value: '5', name: 'Essay Content' },
];

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
      deleteConfirm: false,
      disableAllPostButton: false,
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

    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.files[0],
      }
    });
  };

  validate = (data) => {
    if (!data) {
      alert('Please fill the form first');
      return true
    }

    if (!data.file) {
      alert('Please select file for upload');
      return true
    }

    if (!data.type) {
      alert('Please select Report Type');
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

  postDeleteProgramReport = () => {
    const { history } = this.props;
    const { formData, sessionToken } = this.state;

    let deleteProgramReportURL = '/api/deleteProgramReportById';

    try {
      axios.post(
        deleteProgramReportURL,
        { ...formData, sessionToken },
      ).then(() => {
        this.toggleDeleteModal();
        this.setState({
          formData: {},
        });
        this.fetchProgramReport()
      }).catch((error) => {
        if (error.response !== null && error.response !== undefined) {
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
      });
    } catch (error) {
      console.log(error);
    }
  }

  postProgramReport = () => {
    const { history } = this.props;
    const { formData: postData, sessionToken, role, orgId, programId, disableAllPostButton } = this.state;
    if (disableAllPostButton) {
      return alert('You can not perform this action now as report is submitted.');
    }

    if (!postData.objectId && this.validate(postData)) {
      return true
    }

    const formData = new FormData();
    let postProgramReportURL = '/api/createNewProgramReport';

    if (postData.objectId) {
      postProgramReportURL = '/api/updateProgramReportById';
      formData.append('objectId', postData.objectId);
    } else {
      postProgramReportURL = '/api/createNewProgramReport';
    }

    formData.append('file', postData.file);
    formData.append('orgId', orgId);
    formData.append('programId', programId);
    formData.append('sessionToken', sessionToken);
    formData.append('type', postData.type);
    formData.append('role', role);
    formData.append('path', 'program-report');

    try {
      axios.post(
        postProgramReportURL,
        formData,
      ).then(() => {
        this.toggleModal();
        this.setState({
          formData: {},
        });
        this.fetchProgramReport()
      }).catch((error) => {
        if (error.response !== null && error.response !== undefined) {
          if (error.response.data !== null && error.response.data !== undefined) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              history.push('/');
            } else if (error && error.response && error.response.data && error.response.data.message) {
              alert(error.response.data.message);
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  selectProgramReport = (e, data = {}) => {
    this.setState({
      formData: { ...data, file: '', fileLink: data.file }
    });
    this.toggleModal();
  };

  selectDeleteProgramReport = (e, data) => {
    this.setState({
      formData: { ...data, file: '' }
    });
    this.toggleDeleteModal();
  };

  toggleModal = () => {
    this.setState({
      open: !this.state.open,
    })
  };

  toggleDeleteModal = () => {
    this.setState({
      deleteConfirm: !this.state.deleteConfirm,
    })
  }

  render() {
    const { formData, programReportData = [] } = this.state;

    let heading = 'Program Report';

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md={12}>
              <MDBCard>
                <MDBRow className="text-center pt-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    {heading}
                  </MDBCol>
                </MDBRow>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol md={1}/>
                    <MDBCol md={10}>
                      <MDBRow style={{ display: 'block'}}>
                        <hr/>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol md={1}/>
                    <MDBCol md={1}/>
                    <MDBCol md={10} className="text-center">
                      Here list all the report type, requirement and template
                    </MDBCol>
                    <MDBCol md={1} />

                    <MDBCol md={1} />
                    <MDBCol md={10}>
                      <MDBRow>
                        <MDBCol md={4} className="table-header font-weight-bold">
                          Report Type
                        </MDBCol>
                        <MDBCol md={4} className="table-header font-weight-bold text-center">
                          Requirement
                        </MDBCol>
                        <MDBCol md={4} className="table-header font-weight-bold text-center">
                          Template
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md={4} className="table-header font-weight-bold">

                          Student Training Report
                        </MDBCol>
                        <MDBCol md={4} className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md={4} className="table-header font-weight-bold text-center">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload"
                                  href={CLUSAStudentTrainingReport}
                          >
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md={4} className="table-header font-weight-bold">
                          Graduation Ceremony Reports
                        </MDBCol>
                        <MDBCol md={4} className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md={4} className="table-header font-weight-bold text-center">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload"
                                  href={CLUSAGraduationCeremonyReport}
                          >
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md={4} className="table-header font-weight-bold">
                          Intern Documentation
                        </MDBCol>
                        <MDBCol md={4} className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md={4} className="table-header font-weight-bold text-center">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload"
                                  href={CLUSAInternshipBudget}
                          >
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md={4} className="table-header font-weight-bold">
                          Essay Contest
                        </MDBCol>
                        <MDBCol md={4} className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md={4} className="table-header font-weight-bold text-center">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload"
                                  href={CLUSAEssayContest}
                          >
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
                    <MDBCol md={1} />
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md={12}>
                      <MDBRow style={{ display: 'block'}}>
                        <hr/>
                      </MDBRow>
                    </MDBCol>

                    <MDBCol md={1} />
                    <MDBCol md={11}>
                      <MDBRow>
                        <MDBCol md={11}>
                          <MDBRow>

                            <MDBCol md={2} className="table-header font-weight-bold">Report File</MDBCol>
                            <MDBCol md={3} className="table-header font-weight-bold">Type</MDBCol>
                            <MDBCol md={7} className="table-header font-weight-bold">Upload Date</MDBCol>
                          </MDBRow>
                          {programReportData.map((pRD, index) =>
                            <MDBRow key={pRD.objectId + index}>
                              <MDBCol md={2} className="pt-2 ellipsis">
                                <a href={pRD.file.path} rel="noopener noreferrer" target="_blank">{pRD.file.filename}</a>
                              </MDBCol>
                              <MDBCol md={3} className="pt-2">{reportType.find(e => e.value == pRD.type).name}</MDBCol>
                              <MDBCol md={2} className="pt-2">{pRD.uploadDate}</MDBCol>
                              <MDBCol md={5} style={{ display: 'flex' }} className="pt-2">
                                <MDBBtn
                                  rounded
                                  size={"sm"}
                                  className="application-info-button second-action-button btn-block z-depth-1a"
                                  style={{ width: '50%' }}
                                  onClick={(e) => this.selectProgramReport(e, pRD)}
                                >
                                  Upload/Replace
                                </MDBBtn>
                                <MDBBtn
                                  rounded
                                  size={"sm"}
                                  className="second-action-button btn-block z-depth-1a red-color"
                                  style={{ width: '40%', marginLeft: '30px' }}
                                  onClick={(e) => this.selectDeleteProgramReport(e, pRD)}
                                >
                                  Delete
                                </MDBBtn>
                              </MDBCol>
                            </MDBRow>
                          )}

                        </MDBCol>
                        {/*<MDBCol md={2} />*/}

                        <MDBCol md={1}/>
                        <MDBCol md={9} className="pt-4">
                          <MDBCol md={4}>
                            <MDBBtn
                              rounded
                              size={"sm"}
                              className="second-action-button btn-block z-depth-1a"
                              onClick={() => {
                                this.setState({ formData: {} });
                                this.toggleModal()
                              }}
                            >
                              Upload Report
                            </MDBBtn>
                          </MDBCol>
                        </MDBCol>
                        <MDBCol md={2}/>

                      </MDBRow>

                    </MDBCol>
                  </MDBRow>

                  <br/>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>

          <MDBModal isOpen={this.state.open} toggle={this.toggleModal} size="lg">
            <MDBModalBody className="text-center">
              <MDBRow>
                <MDBCol className="table-header font-weight-bold pt-3">
                  Report file:
                </MDBCol>
              </MDBRow>

              <MDBRow>
                <MDBCol md={1} />
                <MDBCol md={5} className="pt-3">
                  <input type="file" name="file" style={{ display: 'none' }} onChange={this.handleFileChange} />
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="application-info-button second-action-button btn-block z-depth-1a"
                    onClick={() => this.handleFileClick('file')}
                  >
                    Click to Upload/Replace Files
                  </MDBBtn>
                </MDBCol>
                  {
                    formData.file ?
                      <MDBCol md={5} className="pt-3">
                        {formData.file.name}
                      </MDBCol>
                      :
                      <MDBCol md={5} className="pt-3">
                        {
                          formData.fileLink && <a href={`/${formData.fileLink.path}`} rel="noopener noreferrer" target="_blank">{formData.fileLink.originalname}</a>
                        }
                      </MDBCol>
                  }



                <MDBCol md={5} />
                <MDBCol md={1} />


                <MDBCol md={2} />
              </MDBRow>

              <MDBRow>
                <MDBCol md={1} />
                <MDBCol md={3} className="pt-3 font-weight-bold align-item-center">
                  Type:
                </MDBCol>
                <MDBCol md={7} className="pt-3">
                  <select name="type" value={formData.type} className="browser-default custom-select" onChange={this.handleChange}>
                    <option>Choose Report Type</option>
                    <option value="1">Student Training</option>
                    <option value="2">Graduation Ceremony</option>
                    <option value="3">Inter Documentation</option>
                    <option value="4">Other event</option>
                    <option value="5">Essay Content</option>
                  </select>
                </MDBCol>
                <MDBCol md={1} />
              </MDBRow>

              <MDBRow className="mt-4">
                <MDBCol md={2} />
                <MDBCol md={4} className="text-center">
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="second-action-button btn-block z-depth-1a"
                    onClick={this.postProgramReport}
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

          <MDBModal isOpen={this.state.deleteConfirm} toggle={this.toggleDeleteModal}>
            <MDBModalBody className="text-center">
              <MDBRow>
                <MDBCol className="table-header  pt-3">
                  Sure to delete?
                </MDBCol>
              </MDBRow>

              <MDBRow className="mt-4">
                <MDBCol md={2} />
                <MDBCol md={4} className="text-center">
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="second-action-button btn-block z-depth-1a red-color"
                    onClick={this.postDeleteProgramReport}
                  >
                    Yes
                  </MDBBtn>
                </MDBCol>
                <MDBCol md={4} className="text-center">
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="second-action-button btn-block z-depth-1a"
                    onClick={this.toggleDeleteModal}
                  >
                    No
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
    const { orgId, programId, role } = this.state;
    const fetchProgramById = '/api/fetchAllFinalReportByOrgIdProgId';

    if (this.state.sessionToken) {
      axios.post(
        fetchAllProgramReportByOrgIdProgId,
        {
          sessionToken: this.state.sessionToken,
          orgId,
          programId,
        },
      ).then(async (response) => {

        if (role === '1') {
          try {
            const sd = await axios.post(
              fetchProgramById,
              {
                sessionToken: this.state.sessionToken,
                orgId,
                programId,
              },
            )
            if (sd.data && sd.data.finalReport) {
              if (sd.data.finalReport.isSubmitted && sd.data.finalReport.isSubmitted == '1') {
                this.setState({
                  disableAllPostButton: true
                });
              }
            }

          } catch (idError) {
            console.log(idError);
          }
        }

        this.setState({
          programReportData: response.data.programReport,
        })
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
    this.fetchProgramReport();
  }
}

export default ProgramReport;
