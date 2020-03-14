import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard, MDBTable, MDBTableBody, MDBTableHead,
  MDBModal, MDBModalBody
} from 'mdbreact';
import axios from 'axios';

import { queryStringToJSON } from '../../utils/util'
import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import CLUSAStudentTrainingReport from '../../images/CLUSA-Student-Training-Report.xlsx';
import CLUSAGraduationCeremonyReport from '../../images/CLUSA-Graduation-Ceremony-Report.xlsx';
import CLUSAInternshipBudget from '../../images/CLUSA Internship -budget-template.xlsx';
import CLUSAOtherEvent from '../../images/CLUSA-Other-Event.xlsx';
import CLUSAEssayContest from '../../images/CLUSA-Essay-Contest.xlsx';
import CLUSAInternInformation from '../../images/CLUSA-Intern-Information.xlsx';

import './programReport.css'
import HomeIcon from "@material-ui/icons/Home";
import {Link} from "react-router-dom";

const reportType  = [
  { value: '1', name: 'Student Training' },
  { value: '2', name: 'Graduation Ceremony' },
  { value: '3', name: 'Inter Documentation' },
  { value: '4', name: 'Other event' },
  { value: '5', name: 'Essay Content' },
  { value: '6', name: 'Inter Information' },
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
        this.fetchProgramReport();
      }).catch((error) => {
        this.toggleDeleteModal();
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
    const { formData, programReportData = [], role, programId } = this.state;

    let heading = 'Program Report';

    const breadCrums = role != '1' ? [{
      name: 'dashboard',
      child: <li key={`dashboard0`} className="breadcrumb-item"><HomeIcon/> <Link to={'/view-program'}>Program Management</Link></li>,
    }, {
      name: 'programView',
      child: <li key={`programView1`} className="breadcrumb-item"><Link to={`/program/${programId}`}> Program Detail</Link></li>,
    }, {
      name: 'finalReport',
      child: <li key={`programReport2`} className="breadcrumb-item active"> {heading}</li>,
    }] : [
      {
        name: 'dashboard',
        child: <li key={`dashboard1`} className="breadcrumb-item"><HomeIcon/> <Link to={'/account'}>Dashboard</Link></li>,
      }, {
        name: 'programView',
        child: <li key={`programView1`} className="breadcrumb-item"><Link to={`/program/${programId}`}> Program Detail</Link></li>,
      }, {
        name: 'appView',
        child: <li key={`appView1`} className="breadcrumb-item active"> {heading}</li>,
      }
    ];

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
        <MDBContainer>
          <MDBRow>
            <MDBCol md={12}>
              <MDBCard className="card-padding">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol md={12}>
                      <p>Here list all the report type, requirement and template</p>
                    </MDBCol>
                    <MDBTable responsive>
                      <MDBTableHead>
                        <tr>
                          <th><strong>Report Type</strong></th>
                          <th><strong>Requirement</strong></th>
                          <th><strong>Template</strong></th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        <tr>
                          <td><strong>Student Training Report</strong></td>
                          <td>Report requirement sort introduction</td>
                          <td><MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button"
                                  href={CLUSAStudentTrainingReport}
                          >
                            Download Template File
                          </MDBBtn></td>
                        </tr>
                        <tr>
                          <td><strong>Graduation Ceremony Reports</strong></td>
                          <td>Report requirement sort introduction</td>
                          <td><MDBBtn rounded className="application-info-button second-action-button z-depth-1a white-button check-file-upload"
                                  href={CLUSAGraduationCeremonyReport}
                          >
                            Download Template File
                          </MDBBtn></td>
                        </tr>
                        <tr>
                          <td><strong>Intern Documentation</strong></td>
                          <td>Report requirement sort introduction</td>
                          <td><MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button"
                                  href={CLUSAInternshipBudget}
                          >
                            Download Template File
                          </MDBBtn></td>
                        </tr>
                        <tr>
                          <td><strong>Other Event</strong></td>
                          <td>Report requirement sort introduction</td>
                          <td><MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button"
                                  href={CLUSAOtherEvent}
                          >
                            Download Template File
                          </MDBBtn></td>
                        </tr>
                        <tr>
                          <td><strong>Essay Contest</strong></td>
                          <td>Report requirement sort introduction</td>
                          <td><MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button"
                                  href={CLUSAEssayContest}
                          >
                            Download Template File
                          </MDBBtn></td>
                        </tr>
                        <tr>
                          <td><strong>Intern Information</strong></td>
                          <td>Report requirement sort introduction</td>
                          <td><MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button"
                                  href={CLUSAInternInformation}
                          >
                            Download Template File
                          </MDBBtn></td>
                        </tr>

                       
                      </MDBTableBody>
                    </MDBTable>
                    <MDBRow className="pt-4">
                      <MDBCol md={12}>
                        <p><strong>Reports note:</strong> Please submit all Student Training, Graduation Ceremony Reports, Intern Documentation, Other Event, Essay Contest and Intern Information</p><br></br>
                      </MDBCol>
                    </MDBRow>
                    {/* <MDBCol md={12}>
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
                          <MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button"
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
                          <MDBBtn rounded className="application-info-button second-action-button z-depth-1a white-button check-file-upload"
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
                          <MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button"
                                  href={CLUSAInternshipBudget}
                          >
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md={4} className="table-header font-weight-bold">
                          Other Event
                        </MDBCol>
                        <MDBCol md={4} className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md={4} className="table-header font-weight-bold text-center">
                          <MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button"
                                  href={CLUSAOtherEvent}
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
                          <MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button"
                                  href={CLUSAEssayContest}
                          >
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ alignItems: 'center'}} className="pt-3">
                        <MDBCol md={4} className="table-header font-weight-bold">
                          Intern Information
                        </MDBCol>
                        <MDBCol md={4} className="text-center">
                          Report requirement sort introduction
                        </MDBCol>
                        <MDBCol md={4} className="table-header font-weight-bold text-center">
                          <MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button"
                                  href={CLUSAInternInformation}
                          >
                            Download Template File
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol> */}
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md={12}>
                      <MDBRow>
                        <MDBCol md={role == '1' ? 2 : 7} className="table-header font-weight-bold">Report File</MDBCol>
                        <MDBCol md={3} className="table-header font-weight-bold">Type</MDBCol>
                        <MDBCol md={role == '1' ? 7 : 2} className="table-header font-weight-bold">Upload Date</MDBCol>
                      </MDBRow>
                      {programReportData.map((pRD, index) =>
                        <MDBRow key={pRD.objectId + index}>
                          <MDBCol md={role == '1' ? 2 : 7} className="pt-2 ellipsis">
                            <a href={pRD.file.path} rel="noopener noreferrer" target="_blank">{pRD.file.filename}</a>
                          </MDBCol>
                          <MDBCol md={3} className="pt-2">
                            {reportType.find(e => e.value == pRD.type).name}
                          </MDBCol>
                          <MDBCol md={2} className="pt-2">{pRD.uploadDate}</MDBCol>

                          {role == '1' && <MDBCol md={5} style={{ display: 'flex' }} className="pt-2">
                            <MDBBtn
                              rounded
                              className="application-info-button second-action-button z-depth-1a"
                              onClick={(e) => this.selectProgramReport(e, pRD)}
                            >
                              Upload/Replace
                            </MDBBtn>
                            <MDBBtn
                              rounded
                              color="danger"
                              className="second-action-button z-depth-1a red-color"
                              onClick={(e) => this.selectDeleteProgramReport(e, pRD)}
                            >
                              Delete
                            </MDBBtn>
                          </MDBCol>}
                        </MDBRow>
                      )}

                    </MDBCol>
                    {/*<MDBCol md={2} />*/}

                    {role &&
                      <>
                        <MDBCol md={4} className="pt-4">
                          <MDBBtn
                            rounded
                            className="second-action-button z-depth-1a"
                            onClick={() => {
                              this.setState({ formData: {} });
                              this.toggleModal()
                            }}
                            style={{ width: '150px' }}
                          >
                            Upload Report
                          </MDBBtn>
                        </MDBCol>
                        <MDBCol md={8} className="pt-4 text-right">
                          <MDBBtn
                            color="secondary"
                            rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color"
                            onClick={() => {
                              if (role !== '1')
                                this.props.history.push('/view-program')
                              else
                                this.props.history.push('/account')
                            }}
                          >
                            Back to Account Dashboard
                          </MDBBtn>
                          <MDBBtn
                          color="secondary"
                            rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color"
                            onClick={() => {
                              // if (role !== '1')
                                this.props.history.push(`/program/${programId}`)
                            }}
                          >
                            Back to Program Detail
                          </MDBBtn>
                        </MDBCol>
                      </>
                    }
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
                    className="application-info-button second-action-button z-depth-1a"
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
                    <option value="6">Intern Information</option>
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
                    className="second-action-button z-depth-1a"
                    onClick={this.postProgramReport}
                  >
                    Upload
                  </MDBBtn>
                </MDBCol>
                <MDBCol md={4} className="text-center">
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="second-action-button z-depth-1a red-color"
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
                    className="second-action-button z-depth-1a red-color"
                    onClick={this.postDeleteProgramReport}
                  >
                    Yes
                  </MDBBtn>
                </MDBCol>
                <MDBCol md={4} className="text-center">
                  <MDBBtn
                    rounded
                    size={"sm"}
                    className="second-action-button z-depth-1a"
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
