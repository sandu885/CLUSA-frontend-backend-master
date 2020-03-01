/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard,
} from 'mdbreact';
import axios from 'axios';

import FooterComponent from '../../Footer';
import HeaderComponent from '../../Header';
import './checks.css'
import {queryStringToJSON} from "../../../utils/util";

class FinalCheck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      dataReceived: false,
      checkData: [],
      formData: {},
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
    };
  }

  handleFileClick = (name) => {
    const fileUpload = document.getElementsByName(name)[0];
    fileUpload.click();
  };

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

  postFinalCheck = () => {
    const { formData: postData, orgId, programId } = this.state;
    const formData = new FormData();
    if (this.validate(postData)) {
      return
    }
    let postProgram = '/api/createNewCheck';

    if (postData.objectId) {
      postProgram = '/api/updateCheckById';
      // delete first.checkFile
      formData.append('objectId', postData.objectId);
    } else {
      postProgram = '/api/createNewCheck';
    }

    formData.append('sessionToken', this.state.sessionToken);
    formData.append('checkAmount', postData.checkAmount);
    formData.append('checkId', postData.checkId); //
    formData.append('checkDate', postData.checkDate);
    formData.append('orgId', orgId);
    formData.append('programId', programId);
    formData.append('checkType', '2');

    if (postData.checkFile) {
      formData.append('checkFile', postData.checkFile);
    }

    axios.post(
      postProgram,
      formData,
    ).then((response) => {
      this.props.history.goBack(`/program${programId}`);
      // this.fetchCheckData();
      console.warn('reponse message', response.data);

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
          } else {
            alert(error.response.data.message);
          }
        }
      }
    });

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

  render() {
    const { formData, programId, role } = this.state;

    let heading = 'Final Check';

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
                  <MDBRow className="header-section">
                    <MDBCol md="1" />
                    <MDBCol md="10">
                      <MDBRow style={{ display: 'block'}}>
                        <hr/>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol md="1" />
                    <MDBCol md="2" />
                    <MDBCol md="9">

                      <MDBRow className="form-group font-weight-bold">
                        <label className="col-form-label check-form-label">Check Amount:-</label>
                        <div className="col-sm-4">
                          {role == '0' ? formData && <label className="col-form-label check-form-label font-weight-light">{formData.checkAmount || ''}</label>
                            : <input type="number" className="form-control" name="checkAmount" value={formData.checkAmount} onChange={this.handleChange}/>
                          }
                        </div>
                        <MDBCol sm="1" />
                        <label className="col-form-label">Check #:-</label>
                        <div className="col-sm-4">
                          {role == '0' ? formData && <label
                            className="col-form-label check-form-label font-weight-light">{formData.checkId || ''}</label>
                            : <input type="text" className="form-control" name="checkId" value={formData.checkId} onChange={this.handleChange}/>
                          }
                        </div>
                      </MDBRow>

                      <MDBRow className="form-group font-weight-bold">
                        <label className="col-form-label check-form-label">Check Image:-</label>
                        <div className="col-sm-3">
                          <label className="col-form-label" style={{
                            fontWeight: '100',
                            color: '#b6b6b6',
                          }}>
                            {
                              formData.checkFile ? formData.checkFile.name :
                                formData.checkFileLink && <a href={`/${formData.checkFileLink.path}`} rel="noopener noreferrer" target="_blank"> {formData.checkFileLink.filename} </a>
                            }
                            {/*{formData.checkFile ? formData.checkFile.name : 'Image name is here'}*/}
                          </label>
                        </div>
                        <div className="col-sm-6">
                          {role == '0' ? null :
                            <>
                              <input type="file" className="form-control" style={{ display: 'none' }} name="checkFile" onChange={this.handleFileChange}/>
                              <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload" onClick={() => this.handleFileClick('checkFile')}>
                                Click here to Upload/Replace Image
                              </MDBBtn>
                            </>
                          }
                        </div>
                      </MDBRow>

                      <MDBRow className="form-group font-weight-bold">
                        <label className="col-form-label check-form-label">Check Date:-</label>
                        <div className="col-sm-4">
                          {role == '0' ? formData && <label
                            className="col-form-label check-form-label font-weight-light">{formData.checkDate || ''}</label>
                            : <input type="text" className="form-control" name="checkDate" value={formData.checkDate} onChange={this.handleChange}/>
                          }
                        </div>
                      </MDBRow>

                      {role == '0' ?
                        <MDBRow className="form-group font-weight-bold">
                          <MDBCol sm="5"/>
                          <MDBCol sm="3">
                            <MDBBtn rounded size={"sm"}
                                    className="send-button second-action-button btn-block z-depth-1a check-file-upload"
                                    onClick={event => {
                                      this.props.history.goBack();
                                    }}
                            >
                              Go Back
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                        :
                        <MDBRow className="form-group font-weight-bold">
                          <MDBCol sm="3"/>
                          <MDBCol sm="3">
                            <MDBBtn rounded size={"sm"}
                                    className="send-button second-action-button btn-block z-depth-1a check-file-upload"
                                    onClick={this.postFinalCheck}
                            >
                              Send
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol sm="3">
                            <MDBBtn rounded size={"sm"}
                                    className="cancel-button second-action-button btn-block z-depth-1a check-file-upload"
                                    onClick={event => {
                                      this.props.history.goBack(`/program${programId}`);
                                    }}
                            >
                              Cancel
                            </MDBBtn>
                          </MDBCol>
                        </MDBRow>
                      }
                    </MDBCol>
                    <MDBCol md="1" />
                  </MDBRow>
                  <br />

                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  fetchCheckData = () => {
    const fetchAllChecksByOrgIdProgId = '/api/fetchAllChecksByOrgIdProgId';
    const { orgId, programId } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllChecksByOrgIdProgId,
        {
          sessionToken: this.state.sessionToken,
          orgId,
          programId,
        },
      ).then((response) => {
        const formData = response.data.checks.find(e => e.type === '2') || {};

        this.setState({
          formData: {
            ...formData,
            checkAmount: formData.amount, checkFile: '', checkDate: formData.date, checkFileLink: formData.checkFile,
          },
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
    this.fetchCheckData();
  }
}

export default FinalCheck;
