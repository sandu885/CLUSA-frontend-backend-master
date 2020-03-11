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

import { queryStringToJSON } from "../../../utils/util";

import './agreementPlacement.css'
import CLUSAAgreementPlacement from "../../../images/CLUSA-Agreement-Placement.xlsx";

class SignedAgreementPlacement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      dataReceived: false,
      checkData: [],
      formData: {},
      disableAllPostButton: false,
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

    if (e.target.name === 'filledPlacement') {
      return this.setState({
        formData: {
          ...formData,
          placementUploadDate: moment().format('MM/DD/YYYY'),
          [e.target.name]: e.target.files[0],
        }
      });
    }

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

    if (!data.signedAgreement) {
      alert('Please pass Signed Agreement file');
      return true
    }
    //
    // if (!data.filledPlacement) {
    //   alert('Please pass filled placement file');
    //   return true
    // }
    return false
  };

  handlePostAgreementPlacementClick = () => {
    const { formData: postData, orgId, programId, role, disableAllPostButton } = this.state;
    if (disableAllPostButton) {
      return alert('You can not perform this action now as report is submitted.');
    }

    const formData = new FormData();
    if (!postData.objectId && this.validate(postData)) {
      return
    }
    if (role === '1' && postData.status === '1') {
      return alert('Cannot update the agreement now as it is approved.');
    }

    let postProgram = '/api/createNewAgreementPlacement';

    if (postData.objectId) {
      postProgram = '/api/updateAgreementPlacementById';
      // delete first.checkFile
      formData.append('objectId', postData.objectId);
      formData.append('signedAgreement', postData.signedAgreement);
      formData.append('filledPlacement', postData.filledPlacement);

    } else {
      postProgram = '/api/createNewAgreementPlacement';

      formData.append('signedAgreement', postData.signedAgreement);
      formData.append('filledPlacement', postData.filledPlacement);
    }
    formData.append('orgId', orgId);
    formData.append('programId', programId);
    formData.append('sessionToken', this.state.sessionToken);
    formData.append('role', role);

    axios.post(
      postProgram,
      formData,
    ).then((response) => {
      alert('🦄Agreement is saved!');
      this.fetchAgreementPlacementData();

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
    const { formData, role } = this.state;
    console.log( 'formData', formData);

    let heading = 'Agreement and Placement';

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
                <MDBRow className="user-org-management-header sub-management-header">
                  <MDBCol>
                    <h4>A description about the agreement and placement</h4>
                  </MDBCol>
                </MDBRow>

                  <MDBRow>
                    <MDBCol md="5" className="block-header">
                      <MDBRow>
                        <MDBCol>
                          <h3>Agreement</h3>
                          <MDBRow>
                            <MDBCol sm="12">
                              <p><strong>Agreement Template file name show here if CLUSA uploaded Agreement template</strong></p>
                              {formData.agreementTemplateLink && formData.agreementTemplateLink.filename ? <a href={`/${formData.agreementTemplateLink.path}`} rel="noopener noreferrer" target="_blank" className="btn btn-default">Download Agreement</a> : 'Agreement file is not uploaded'}
                            </MDBCol>
                          </MDBRow>
                          <MDBRow className="pt-3">
                            <MDBCol sm="12 pt-4" className="block-header">
                            <strong>Signed Agreement</strong>
                            </MDBCol>
                            {role === '0' ? null :
                              <MDBCol sm="12">
                                <input type="file" className="form-control" style={{ display: 'none' }} name="signedAgreement" onChange={this.handleFileChange}/>
                                <MDBBtn rounded className="application-info-button second-action-button file-upload z-depth-1a check-file-upload" onClick={() => this.handleFileClick('signedAgreement')}>
                                  Click to Upload/Replace Template File
                                </MDBBtn>
                                {
                                  formData.signedAgreement ? formData.signedAgreement.name : formData.signedAgreementLink ?
                                    <a href={formData.signedAgreementLink && formData.signedAgreementLink.filename ? `/${formData.signedAgreementLink.path}`: '#'} rel="noopener noreferrer" target="_blank">{formData.signedAgreementLink && formData.signedAgreementLink.filename}</a>
                                    : 'Image file details over here'
                                }
                              </MDBCol>
                            }

                            <MDBCol sm="7" className="align-item-center">
                              
                            </MDBCol>
                            <MDBCol md="12 pt-4">
                              <MDBRow>
                                <MDBCol sm="12" className="block-header align-item-center">
                                  <strong>Award amount :</strong> {formData.awardAmount}
                                </MDBCol>
                              </MDBRow>
                            </MDBCol>
                          </MDBRow>                          
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol md="5" className="block-header">
                      <h3>Placement Confirmation Template</h3>
                      <MDBRow>
                        <MDBCol sm="12">
                          <p><strong>Placement template file name shows here</strong></p>
                          {/*{formData.placementTemplateLink && formData.placementTemplateLink.filename ? <a href={`/${formData.placementTemplateLink.path}`} rel="noopener noreferrer" target="_blank">Click to download the agreement template.</a> : 'Placement file is not uploaded'}*/}
                        </MDBCol>
                        <MDBCol sm="12"><a href={CLUSAAgreementPlacement} rel="noopener noreferrer" target="_blank" className="btn btn-default">Click to download</a></MDBCol>
                      </MDBRow>
                      <MDBRow className="pt-3">
                        <MDBCol sm="12" className="block-header">
                          Filled placement
                        </MDBCol>
                        <MDBCol sm="12">
                          <input type="file" className="form-control" style={{ display: 'none' }} name="filledPlacement" onChange={this.handleFileChange}/>
                          <MDBBtn rounded className="application-info-button second-action-button file-upload z-depth-1a check-file-upload" onClick={() => this.handleFileClick('filledPlacement')}>
                            Click to Upload/Replace Template File
                          </MDBBtn>
                          {
                            formData.filledPlacement ? formData.filledPlacement.name : formData.filledPlacementLink ?
                              <a href={formData.filledPlacementLink && formData.filledPlacementLink.filename ? `/${formData.filledPlacementLink.path}`: '#'} rel="noopener noreferrer" target="_blank">{formData.filledPlacementLink && formData.filledPlacementLink.filename}</a>
                              : 'Image file details over here'
                          }
                        </MDBCol>
                      </MDBRow>
                      <MDBRow className="pt-3">
                        <MDBCol sm="12" className="block-header align-item-center">
                          <strong>Uploaded Date:-</strong> {formData.placementUploadDate && formData.placementUploadDate}
                        </MDBCol>                        
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>                  
                  <div>
                    <MDBRow>
                      <MDBCol md="10 pt-4">
                        <h3>Result:-</h3>                                              
                      </MDBCol>
                      <MDBCol sm="10" className="blue-font-color">
                        <strong><span style={{ color: '#17a44c' }}>{formData.status ? ((formData.status == '0' || formData.status == 'undefined') ? 'Under Review' : 'APPROVED') : 'Under Review'}</span></strong>
                      </MDBCol>
                      <MDBCol sm="12" className="pt-2">
                        {formData.finalFilledPlacementLink && formData.finalFilledPlacementLink.filename && <a href={`/${formData.finalFilledPlacementLink.path}`} rel="noopener noreferrer" target="_blank" className="btn btn-default">Download Placement File</a>}
                      </MDBCol> 
                    </MDBRow>
                  </div>
                  <MDBRow className="pt-4">
                    <MDBCol md="12" >
                      {role === '0' ?
                        
                          <MDBBtn rounded color="danger" className="application-info-button second-action-button z-depth-1a check-file-upload"
                                  onClick={() => this.state.programId && this.props.history.push(`/program/${this.state.programId}`)}
                          >
                            Back
                          </MDBBtn>
                        
                        :
                        <>
                          
                            <MDBBtn
                              rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color"
                              onClick={this.handlePostAgreementPlacementClick}
                            >
                              Save
                            </MDBBtn>
                         
                          
                            <MDBBtn rounded color="danger" className="application-info-button second-action-button z-depth-1a check-file-upload red-color"
                                    onClick={() => this.state.programId && this.props.history.push(`/program/${this.state.programId}`)}
                            >
                              Cancel
                            </MDBBtn>
                          
                        </>
                      }

                    </MDBCol>
                    <MDBCol md="12">
                        <p className="text-right">
                          <MDBBtn
                            rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color"
                            onClick={this.handlePostAgreementPlacementClick}
                          >
                            Back to Account Dashboard
                          </MDBBtn>
                          <MDBBtn
                            rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color"
                            onClick={this.handlePostAgreementPlacementClick}
                          >
                            Back to Program Detail
                          </MDBBtn>
                        </p>
                      </MDBCol>
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

  fetchAgreementPlacementData = () => {
    const fetchAllAgreementPlacementsByOrgIdProgId = '/api/fetchAllAgreementPlacementsByOrgIdProgId';
    const fetchProgramById = '/api/fetchAllAgreementPlacementsByOrgIdProgId';
    const { orgId, programId, role } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllAgreementPlacementsByOrgIdProgId,
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

        if (response.data.agreementPlacement.length) {
          this.setState({
            formData: {
              ...response.data.agreementPlacement[0],
              signedAgreement: undefined, filledPlacement: undefined,
              agreementTemplateLink: response.data.agreementPlacement[0].agreementTemplate && response.data.agreementPlacement[0].agreementTemplate,
              placementTemplateLink: response.data.agreementPlacement[0].placementTemplate && response.data.agreementPlacement[0].placementTemplate,
              filledPlacementLink: response.data.agreementPlacement[0].filledPlacement && response.data.agreementPlacement[0].filledPlacement,
              signedAgreementLink: response.data.agreementPlacement[0].signedAgreement && response.data.agreementPlacement[0].signedAgreement,
              finalFilledPlacementLink: response.data.agreementPlacement[0].finalFilledPlacement && response.data.agreementPlacement[0].finalFilledPlacement,
            },
          })
        }
        this.setState({
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
  };

  componentDidMount() {
    this.fetchAgreementPlacementData();
  }
}

export default SignedAgreementPlacement;
