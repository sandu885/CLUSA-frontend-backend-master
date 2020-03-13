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
      alert('Not having proper data to access this route');
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
            <MDBCol md="12">
              <MDBCard>               
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol md="12 pl-5 pr-5">
                      <MDBRow className="form-group font-weight-bold">                        
                        <div className="col-sm-12">
                        <label className="col-form-label check-form-label" style={{ padding: '0' }}>Check Amount:-</label><br></br>
                          {role == '0' ? formData && <label className="col-form-label check-form-label font-weight-light">{formData.checkAmount || ''}</label>
                            : <input type="number" className="form-control" name="checkAmount" value={formData.checkAmount} onChange={this.handleChange}/>
                          }
                        </div>
                        
                        <div className="col-sm-12">
                          <label className="col-form-label">Check #:-</label><br></br>
                          {role == '0' ? formData && <label
                            className="col-form-label check-form-label font-weight-light" style={{ padding: '0' }}>{formData.checkId || ''}</label>
                            : <input type="text" className="form-control" name="checkId" value={formData.checkId} onChange={this.handleChange}/>
                          }
                        </div>
                        
                        <div className="col-sm-12">
                        <label className="col-form-label check-form-label">Check Image:-</label><br></br>
                          <label className="col-form-label" style={{                            
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
                              <MDBBtn rounded className="application-info-button second-action-button file-upload z-depth-1a check-file-upload" onClick={() => this.handleFileClick('checkFile')}>
                                Click here to Upload/Replace Image
                              </MDBBtn>
                            </>
                          }
                        </div>
                      </MDBRow>

                      <MDBRow className="form-group font-weight-bold">
                        
                        <div className="col-sm-12">
                        <label className="col-form-label check-form-label" style={{ padding: '0' }}>Check Date:-</label><br></br>
                          {role == '0' ? formData && <label
                            className="col-form-label check-form-label font-weight-light">{formData.checkDate || ''}</label>
                            : <input type="text" className="form-control" name="checkDate" value={formData.checkDate} onChange={this.handleChange}/>
                          }
                        </div>
                      </MDBRow>

                      {role == '0' ?
                        
                        <MDBRow className="form-group font-weight-bold">
                           <MDBCol md="12">
                            <MDBBtn rounded
                                    className="send-button second-action-button z-depth-1a check-file-upload"
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
                        
                          <MDBCol md="12">
                            <MDBBtn rounded 
                                    className="send-button second-action-button z-depth-1a check-file-upload"
                                    onClick={this.postFinalCheck}
                            >
                              Send
                            </MDBBtn>
                        
                         
                            <MDBBtn rounded 
                                    color="danger"
                                    className="cancel-button second-action-button z-depth-1a check-file-upload"
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
