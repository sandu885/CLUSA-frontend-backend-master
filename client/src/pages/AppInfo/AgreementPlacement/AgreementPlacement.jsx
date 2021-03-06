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

import { queryStringToJSON } from "../../../utils/util";
import CLUSAAgreementPlacement from '../../../images/Internship-Placement-Confirmation-Template.xlsx';
import './agreementPlacement.css'
import HomeIcon from "@material-ui/icons/Home";
import {Link} from "react-router-dom";
import { roleBaseBreadCrumbHeading } from '../../../utils/util.js'
import CLUSAStudentTrainingReport from "../../../images/CLUSA-Student-Training-Report.xlsx";

class AgreementPlacement extends Component {
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

    if (!data.awardAmount) {
      alert('Please enter check Amount');
      return true
    }

    // if (!data.agreementTemplate) {
    //   alert('Please pass agreement template file');
    //   return true
    // }
    //
    // if (!data.placementTemplate) {
    //   alert('Please pass placement template file');
    //   return true
    // }

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
      formData.append('path', `${this.state.orgName}/agreement`);
      formData.append('agreementTemplate', postData.agreementTemplate);
      formData.append('placementTemplate', postData.placementTemplate);
      formData.append('awardAmount', postData.awardAmount);
      formData.append('finalFilledPlacement', postData.finalFilledPlacement);

      formData.append('status', postData.status || '0');
    } else {
      postProgram = '/api/createNewAgreementPlacement';
      formData.append('path', `${this.state.orgName}/agreement`);
      formData.append('agreementTemplate', postData.agreementTemplate);
      formData.append('placementTemplate', postData.placementTemplate);
      formData.append('awardAmount', postData.awardAmount);
      formData.append('finalFilledPlacement', postData.finalFilledPlacement);

      formData.append('status', postData.status || '0');
    }
    formData.append('orgId', orgId);
    formData.append('programId', programId);
    formData.append('sessionToken', this.state.sessionToken);
    formData.append('role', role);

    axios.post(
      postProgram,
      formData,
    ).then(() => {
      this.fetchAgreementPlacementData();
      alert('????Save Successfully');
      this.props.history.push(`/program/${programId}`);
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

  render(){
    const { formData, role, programId } = this.state;

    let heading = 'Agreement and Placement';

    const headingBreadCrumbs = roleBaseBreadCrumbHeading(role);

    const breadCrums = [{
      name: 'dashboard',
      child: <li key={`dashboard0`} className="breadcrumb-item"><HomeIcon/> <Link to={'/view-program'}>{headingBreadCrumbs} Dashboard</Link></li>,
    }, {
      name: 'programView',
      child: <li key={`programView1`} className="breadcrumb-item"><Link to={`/program/${programId}`}> Program Detail</Link></li>,
    }, {
      name: 'agreementAndPlacement',
      child: <li key={`agreementAndPlacement2`} className="breadcrumb-item active"> Agreement and Placement</li>,
    }];

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
            <MDBCol md="12">
              <MDBCard className="card-padding">
                <MDBCardBody>
                  <MDBRow className="user-org-management-header sub-management-header">
                    <MDBCol>
                      <h5 className="section">Section 1</h5>
                      <div style={{ fontSize: 'initial' }}>
                        Congratulations to being awarded by
                        CLUSA Internship Grant! Please download the agreement template below and
                        review it. If everything is fine, please sign and upload your signed agreement
                        below. Please also provide the internship placement confirmation information
                        using the template in the second section on this page. Please note, the
                        placement confirmation is needed before CLUSA sign the agreement.
                      </div>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="pt-2">
                    <MDBCol md="6" className="block-header">
                      <h3>Agreement</h3>
                      <p><strong>Draft Agreement</strong></p>

                        <div className="mb-4">
                          {role === '0' ? null :
                            <>
                              <input type="file" className="form-control" style={{display: 'none'}}
                                     name="agreementTemplate" onChange={this.handleFileChange}/>
                              <MDBBtn rounded className="application-info-button second-action-button file-upload z-depth-1a check-file-upload" onClick={() => this.handleFileClick('agreementTemplate')}>Click to Upload/Replace Template file</MDBBtn>
                            </>
                          }
                          {
                            formData.agreementTemplate ? formData.agreementTemplate.name : formData.agreementTemplateLink ?
                              // <a href={formData.agreementTemplateLink && formData.agreementTemplateLink.filename ? `/${formData.agreementTemplateLink.path}`: '#'} rel="noopener noreferrer" className="file-upload-name" target="_blank">{formData.agreementTemplateLink && formData.agreementTemplateLink.filename}</a>
                              <a href={formData.agreementTemplateLink && formData.agreementTemplateLink.filename ? `/${formData.agreementTemplateLink.path}`: '#'} rel="noopener noreferrer" target="_blank" className="link-under-line">
                                {formData.agreementTemplateLink.filename}
                              </a>
                              : ''
                          }
                          {role === '0' &&
                            <div>Please click here to download the agreement template. </div>
                          }
                        </div>

                      <div className="">
                        <div className="block-header">
                          <p><strong>Signed Agreement (by applicant)</strong><br></br>
                            {formData.signedAgreementLink ?
                              <a href={`/${formData.signedAgreementLink.path}`} rel="noopener noreferrer" className="link-under-line" target="_blank">
                                {formData.signedAgreementLink.filename}
                              </a>
                              : 'File is not uploaded'}
                            <div>Please click here to download the signed agreement.</div>
                          </p>
                        </div>
                      </div>
                      <MDBRow>
                        <MDBCol md="12" className="block-header align-item-center">
                          <p>
                            <strong>Award Amount: </strong>
                            {role === '0' ? formData.awardAmount :
                              <input type="number" style={{ width: 'auto', display: 'unset' }}  className="form-control" name="awardAmount" value={formData.awardAmount} onChange={this.handleChange} />
                            }
                          </p>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol md="6" className="block-header">
                      <h3>Placement</h3>

                        <div className="mb-4">
                          <p><strong>Placement template file shows here</strong></p>
                          {role === '0' ? <a href={CLUSAAgreementPlacement} rel="noopener noreferrer" target="_blank" className="link-under-line">Internship Placement Confirmation Template.xlsx</a> :
                            <>
                              <a href={CLUSAAgreementPlacement} rel="noopener noreferrer" target="_blank" className="link-under-line">Internship Placement Confirmation Template.xlsx</a>
                              {/*<input type="file" className="form-control" style={{ display: 'none' }} name="placementTemplate" onChange={this.handleFileChange}/>*/}
                              {/*<MDBBtn rounded className="application-info-button second-action-button file-upload z-depth-1a check-file-upload" onClick={() => this.handleFileClick('placementTemplate')}>*/}
                              {/*  Click to Upload/Replace Template Files*/}
                              {/*</MDBBtn>*/}
                            </>
                          }
                          {/*{*/}
                          {/*  formData.placementTemplate ? formData.placementTemplate.name : formData.placementTemplateLink ?*/}
                          {/*    <MDBBtn rounded className="application-info-button second-action-button z-depth-1a check-file-upload white-button" href={formData.placementTemplateLink && formData.placementTemplateLink.filename ? `/${formData.placementTemplateLink.path}`: '#'}>*/}
                          {/*      Download Placement File*/}
                          {/*    </MDBBtn>*/}
                          {/*    : 'File is not uploaded'*/}
                          {/*}*/}
                          <div>Please click here to download the template for the placement Confirmation
                          information and fill it out. </div>
                        </div>

                      <MDBRow>
                        <MDBCol md="12 pb-4">
                          <MDBRow>
                            <MDBCol sm="12" className="block-header">
                              <p><strong>Filled placement</strong><br></br>
                                {formData.filledPlacementLink ?
                                  <a href={`/${formData.filledPlacementLink.path}`} rel="noopener noreferrer" target="_blank" className="link-under-line">
                                    {formData.filledPlacementLink.filename}
                                  </a>
                                  // <a href={`/${formData.filledPlacementLink.path}`} rel="noopener noreferrer" target="_blank" className="btn btn-default">Download Placement Confirmation</a>
                                  : 'File is not uploaded'}
                                <div>Please click here to download the filled placement.</div>
                              </p>
                            </MDBCol>
                            <MDBCol sm="12" className="pt-2">
                              <p><strong>Uploaded Date: </strong>{formData.placementUploadDate && formData.placementUploadDate}</p>
                            </MDBCol>
                          </MDBRow>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                  </MDBRow>
                  {/*<MDBCol md="2" />*/}

                  <div>
                    <MDBRow>
                      <MDBCol md="12">
                        <MDBRow className="pt-3">
                          <MDBCol sm={12} style={{ paddingLeft: '15px' }} className="block-header">
                            <h5 className="section">Section 2</h5>
                            <h3>Result</h3>
                          </MDBCol>
                          <MDBCol md="12">
                            <strong>Internship Placement Confirmation</strong>
                          </MDBCol>
                          
                          {role === '0' ?
                            <MDBCol sm="12" className="pt-2">
                              {formData.finalFilledPlacementLink ? <a href={formData.finalFilledPlacementLink && formData.finalFilledPlacementLink.filename ? `/${formData.finalFilledPlacementLink.path}` : '#'} rel="noopener noreferrer" target="_blank" className="link-under-line">
                                    {formData.finalFilledPlacementLink.filename}
                                  </a> : 'File not uploaded'
                              }
                              <div style={{ marginBottom: '10px' }}>This is the final agreement signed by both parties. You can download to keep a copy for your reference</div>
                              <strong><span style={{ color: '#556ee6' }}>{formData.status ? ((formData.status == '0' || formData.status == 'undefined') ? 'Under Review' : 'APPROVED') : 'Under Review'}</span></strong>
                            </MDBCol>
                            :
                              <MDBCol sm="12" className="pt-2">
                                <input type="file" className="form-control" style={{ display: 'none' }} name="finalFilledPlacement" onChange={this.handleFileChange}/>
                                <MDBBtn rounded className="application-info-button second-action-button file-upload z-depth-1a check-file-upload" onClick={() => this.handleFileClick('finalFilledPlacement')}>
                                  Click to Upload/Replace Template Files
                                </MDBBtn>
                                {

                                  formData.finalFilledPlacement ? formData.finalFilledPlacement.name : formData.finalFilledPlacementLink ?
                                    <a href={formData.finalFilledPlacementLink && formData.finalFilledPlacementLink.filename ? `/${formData.finalFilledPlacementLink.path}`: '#'} rel="noopener noreferrer" target="_blank" className="link-under-line pb-2">
                                      {formData.finalFilledPlacementLink.filename}
                                    </a>
                                    // <a href={formData.finalFilledPlacementLink && formData.finalFilledPlacementLink.filename ? `/${formData.finalFilledPlacementLink.path}`: '#'} rel="noopener noreferrer" target="_blank" className="file-upload-name">{formData.finalFilledPlacementLink && formData.finalFilledPlacementLink.filename}</a>
                                    : ''
                                }
                                <div style={{ marginBottom: '10px' }}>This is the final agreement signed by both parties. You can download to keep a copy for your reference</div>
                                <div>
                                {
                                  (role === '3' || role === '2') &&
                                    <select name="status" value={formData.status} className="browser-default" onChange={this.handleChange}>
                                      <option>Preparing Agreement</option>
                                      <option value="1">Approve</option>
                                    </select>
                                }
                                </div>
                              </MDBCol>
                          }
                        </MDBRow>
                        {role === '0' ?
                          <MDBRow>
                            <MDBCol className="text-right">
                              <MDBBtn
                                color="secondary"
                                rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color col-md-3"
                                onClick={() => {
                                  if (role !== '1')
                                    this.props.history.push('/view-program')
                                }}
                              >
                                Back to Account Dashboard
                              </MDBBtn>
                              <MDBBtn
                                color="secondary"
                                rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color col-md-3"
                                onClick={() => {
                                  if (role !== '1')
                                    this.props.history.push(`/program/${programId}`)
                                }}
                              >
                                Back to Program Detail
                              </MDBBtn>
                            </MDBCol>
                          </MDBRow>
                          :
                          <>
                          <MDBRow>
                            <MDBCol md="5">
                            <span className="pr-2">Click SAVE to save your changes</span>
                              <MDBBtn
                                rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color mt-2"
                                onClick={this.handlePostAgreementPlacementClick}
                                style={{ width: '70px' }}
                              >
                                Save
                              </MDBBtn>

                              <MDBBtn rounded color="danger" className="application-info-button second-action-button z-depth-1a check-file-upload red-color mt-2"
                                      onClick={() => this.state.programId && this.props.history.push(`/program/${this.state.programId}`)}
                                      style={{ width: '80px' }}
                              >
                                Cancel
                              </MDBBtn>
                            </MDBCol>
                            <MDBCol md="7" className="text-right">
                              <MDBBtn
                                color="secondary"
                                rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color col-md-5"
                                onClick={() => {
                                  if (role !== '1')
                                    this.props.history.push('/view-program')
                                }}
                              >
                                Back to Account Dashboard
                              </MDBBtn>
                              <MDBBtn
                                color="secondary"
                                rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color col-md-5"
                                onClick={() => {
                                  if (role !== '1')
                                    this.props.history.push(`/program/${programId}`)
                                }}
                              >
                                Back to Program Detail
                              </MDBBtn>
                            </MDBCol>
                          </MDBRow>
                          </>
                        }
                      </MDBCol>
                    </MDBRow>
                  </div>
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
              agreementTemplate: undefined, placementTemplate: undefined, finalFilledPlacement: undefined,
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
    this.fetchAgreementPlacementData()
  }
}

export default AgreementPlacement;
