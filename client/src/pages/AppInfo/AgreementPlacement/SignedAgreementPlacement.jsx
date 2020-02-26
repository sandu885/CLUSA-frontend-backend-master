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

class SignedAgreementPlacement extends Component {
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

    if (!data.filledPlacement) {
      alert('Please pass filled placement file');
      return true
    }
    return false
  };

  handlePostAgreementPlacementClick = () => {
    const { formData: postData, orgId, programId, role } = this.state;

    const formData = new FormData();
    if (!postData.objectId && this.validate(postData)) {
      return
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


    console.log('formData', formData);
    let heading = 'Agreement and Placement';

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

                <MDBRow className="text-center pt-3 user-org-management-header sub-management-header">
                  <MDBCol>
                    A description about the agreement and placement
                  </MDBCol>
                </MDBRow>

                <MDBCardBody>

                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10" className="block-header">
                      <MDBRow>
                        <MDBCol>
                          Agreement
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow>

                        <MDBCol sm="12">
                          {formData.agreementTemplateLink && formData.agreementTemplateLink.filename ? <a href={`/${formData.agreementTemplateLink.path}`} rel="noopener noreferrer" target="_blank">Click to download the agreement template.</a> : 'Agreement file is not uploaded'}
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  {/*<MDBCol md="2" />*/}
                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow className="pt-3">
                        <MDBCol sm="12" className="block-header">
                          Signed Agreement
                        </MDBCol>
                        {role === '0' ? null :
                          <MDBCol sm="5">
                            <input type="file" className="form-control" style={{ display: 'none' }} name="signedAgreement" onChange={this.handleFileChange}/>
                            <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload" onClick={() => this.handleFileClick('signedAgreement')}>
                              Click here to Upload/Replace Image
                            </MDBBtn>
                          </MDBCol>
                        }

                        <MDBCol sm="7" className="align-item-center">
                          {
                            formData.signedAgreement ? formData.signedAgreement.name : formData.signedAgreementLink ?
                              <a href={formData.signedAgreementLink && formData.signedAgreementLink.filename ? `/${formData.signedAgreementLink.path}`: '#'} rel="noopener noreferrer" target="_blank">{formData.signedAgreementLink && formData.signedAgreementLink.filename}</a>
                              : 'Image file details over here'
                          }
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="pt-3">
                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow>
                        <MDBCol sm="2" className="block-header align-item-center">
                          Award amount :-
                        </MDBCol>
                        <MDBCol sm="5" className="blue-font-color">
                          {formData.awardAmount}
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="11">
                      <MDBRow style={{ display: 'block'}}>
                        <hr/>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10">


                      <MDBRow className="pt-3">
                        <MDBCol sm="12" className="block-header">
                          Placement Confirmation Template
                        </MDBCol>
                        <MDBCol sm="12">

                          <MDBRow>
                            <MDBCol sm="12">
                              {formData.placementTemplateLink && formData.placementTemplateLink.filename ? <a href={`/${formData.placementTemplateLink.path}`} rel="noopener noreferrer" target="_blank">Click to download the agreement template.</a> : 'Placement file is not uploaded'}
                            </MDBCol>
                          </MDBRow>



                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow className="pt-3">
                        <MDBCol sm="12" className="block-header">
                          Filled placement
                        </MDBCol>
                        <MDBCol sm="5">
                          <input type="file" className="form-control" style={{ display: 'none' }} name="filledPlacement" onChange={this.handleFileChange}/>
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload" onClick={() => this.handleFileClick('filledPlacement')}>
                            Click here to Upload/Replace Image
                          </MDBBtn>
                        </MDBCol>


                        <MDBCol sm="7" className="align-item-center">
                          {
                            formData.filledPlacement ? formData.filledPlacement.name : formData.filledPlacementLink ?
                              <a href={formData.filledPlacementLink && formData.filledPlacementLink.filename ? `/${formData.filledPlacementLink.path}`: '#'} rel="noopener noreferrer" target="_blank">{formData.filledPlacementLink && formData.filledPlacementLink.filename}</a>
                              : 'Image file details over here'
                          }
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow className="pt-3">
                        <MDBCol sm="2" className="block-header align-item-center">
                          Uploaded Date:-
                        </MDBCol>
                        <div style={{ color: '#2e8ab8' }}>
                          {formData.placementUploadDate && formData.placementUploadDate}
                        </div>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>


                  <MDBRow>
                    <MDBCol md="11">
                      <MDBRow style={{ display: 'block'}}>
                        <hr/>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  <div>
                    <MDBRow>
                      <MDBCol md="2" />
                      <MDBCol md="10">
                        <MDBRow className="pt-3">
                          <MDBCol sm="1" className="block-header">
                            Result
                          </MDBCol>
                          <MDBCol sm="11" className="blue-font-color">
                            {formData.status && (formData.status == '0' ? 'Pending' : 'Approved')}
                          </MDBCol>
                          <MDBCol sm="12">
                            {formData.finalFilledPlacementLink && formData.finalFilledPlacementLink.filename && <a href={`/${formData.finalFilledPlacementLink.path}`} rel="noopener noreferrer" target="_blank">Click to download final placement file.</a>}
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>
                    </MDBRow>
                  </div>
                  <MDBRow className="text-center pt-4">
                    <MDBCol md="3" />
                    {role === '0' ?
                      <MDBCol md="3" >
                        <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload"
                                onClick={() => this.state.programId && this.props.history.push(`/program/${this.state.programId}`)}
                        >
                          Back
                        </MDBBtn>
                      </MDBCol>
                      :
                      <>
                        <MDBCol md="3" >
                          <MDBBtn
                            rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload light-green-color"
                            onClick={this.handlePostAgreementPlacementClick}
                          >
                            Save
                          </MDBBtn>
                        </MDBCol>
                        <MDBCol md="3">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload red-color"
                                  onClick={() => this.state.programId && this.props.history.push(`/program/${this.state.programId}`)}
                          >
                            Cancel
                          </MDBBtn>
                        </MDBCol>
                      </>
                    }

                    <MDBCol md="3" />
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
    const { orgId, programId } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllAgreementPlacementsByOrgIdProgId,
        {
          sessionToken: this.state.sessionToken,
          orgId,
          programId,
        },
      ).then((response) => {
        if (response.data.agreementPlacement.length) {
          this.setState({
            formData: {
              ...response.data.agreementPlacement[0],
              agreementTemplate: undefined, placementTemplate: undefined,
              agreementTemplateLink: response.data.agreementPlacement[0].agreementTemplate && response.data.agreementPlacement[0].agreementTemplate,
              placementTemplateLink: response.data.agreementPlacement[0].placementTemplate && response.data.agreementPlacement[0].placementTemplate,
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
    this.fetchAgreementPlacementData()
  }
}

export default SignedAgreementPlacement;
