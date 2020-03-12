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
import CLUSAAgreementPlacement from '../../../images/CLUSA-Agreement-Placement.xlsx';
import './agreementPlacement.css'
import HomeIcon from "@material-ui/icons/Home";
import {Link} from "react-router-dom";

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
      formData.append('agreementTemplate', postData.agreementTemplate);
      formData.append('placementTemplate', postData.placementTemplate);
      formData.append('awardAmount', postData.awardAmount);
      formData.append('finalFilledPlacement', postData.finalFilledPlacement);

      formData.append('status', postData.status || '0');
    } else {
      postProgram = '/api/createNewAgreementPlacement';

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
      alert('🦄Save Successfully');
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

    const breadCrums = [{
      name: 'dashboard',
      child: <li key={`dashboard0`} className="breadcrumb-item"><HomeIcon/> <Link to={'/view-program'}>Program Management</Link></li>,
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
                      <h4>A description about the agreement and placement</h4>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="pt-3">
                    <MDBCol md="5" className="block-header">
                      <h3>Agreement</h3>
                      <p><strong>Upload Agreement</strong></p>

                        <div className="mb-4">
                          {role === '0' ? null :
                            <>
                              <input type="file" className="form-control" style={{display: 'none'}}
                                     name="agreementTemplate" onChange={this.handleFileChange}/>
                              <MDBBtn rounded className="btn btn-default" onClick={() => this.handleFileClick('agreementTemplate')}>Click to Upload/Replace Template file</MDBBtn>
                            </>
                          }
                          {
                            formData.agreementTemplate ? formData.agreementTemplate.name : formData.agreementTemplateLink ?
                              <a href={formData.agreementTemplateLink && formData.agreementTemplateLink.filename ? `/${formData.agreementTemplateLink.path}`: '#'} rel="noopener noreferrer" className="file-upload-name" target="_blank">{formData.agreementTemplateLink && formData.agreementTemplateLink.filename}</a>
                              : ''
                          }
                        </div>

                      <div className="">
                        <div className="block-header">
                          <p><strong>Signed Agreement</strong><br></br>
                            {formData.signedAgreementLink ?
                              <a href={`/${formData.signedAgreementLink.path}`} rel="noopener noreferrer" target="_blank" className="btn btn-default">Download Agreement</a>
                              : 'File is not uploaded'}
                            {/*Signed Agreement file name shows here if the organization uploaded it*/}
                          </p>
                        </div>
                      </div>
                      <MDBRow>
                        <MDBCol md="3" className="block-header align-item-center">
                          <p><strong>Award Amount :-</strong></p>
                        </MDBCol>
                        <MDBCol md="9" className="block-header">
                        {role === '0' ? formData.awardAmount :
                            <input type="number" style={{ width: 'auto' }}  className="form-control" name="awardAmount" value={formData.awardAmount} onChange={this.handleChange} />
                          }
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol md="5" className="block-header">
                      <h3>Placement</h3>

                        <div className="mb-4">
                          <p><strong>Placement template file shows here</strong></p>
                          {role === '0' ? null :
                            <>
                              {/*<a href={CLUSAAgreementPlacement} rel="noopener noreferrer" target="_blank" className="btn btn-default">Download Placement File</a>*/}
                              <input type="file" className="form-control" style={{ display: 'none' }} name="placementTemplate" onChange={this.handleFileChange}/>
                              <MDBBtn rounded className="btn btn-default" onClick={() => this.handleFileClick('placementTemplate')}>
                                Click to Upload/Replace Template Files
                              </MDBBtn>
                            </>
                          }
                          {
                            formData.placementTemplate ? formData.placementTemplate.name : formData.placementTemplateLink ?
                              <a href={formData.placementTemplateLink && formData.placementTemplateLink.filename ? `/${formData.placementTemplateLink.path}`: '#'} rel="noopener noreferrer" className="file-upload-name"  target="_blank">{formData.placementTemplateLink && formData.placementTemplateLink.filename}</a>
                              : ''
                          }
                        </div>

                      <MDBRow>
                        <MDBCol md="12 pb-4">
                          <MDBRow>
                            <MDBCol sm="12" className="block-header">
                              <p><strong>Filled placement</strong><br></br>
                                {formData.filledPlacementLink ?
                                  <a href={`/${formData.filledPlacementLink.path}`} rel="noopener noreferrer" target="_blank" className="btn btn-default">Download Placement Confirmation</a>
                                  : 'File is not uploaded'}
                                {/*Internship Placement Confirmation file name shows here if the organization uploaded placement confirmation*/}
                              </p>
                            </MDBCol>
                            <MDBCol sm="12" className="pt-2">
                              <p><strong>Uploaded Date:- </strong>{formData.placementUploadDate && formData.placementUploadDate}</p>
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
                      <MDBCol md="10">
                        <MDBRow className="pt-3">
                          <MDBCol sm={12} style={{ paddingLeft: '15px' }} className="block-header">
                            <h3>Result</h3>
                          </MDBCol>
                          
                          {role === '0' ? null :
                              <MDBCol sm="12" className="pt-2">
                                <input type="file" className="form-control" style={{ display: 'none' }} name="finalFilledPlacement" onChange={this.handleFileChange}/>
                                <MDBBtn rounded className="btn btn-default" onClick={() => this.handleFileClick('finalFilledPlacement')}>
                                  Click to Upload/Replace Template Files
                                </MDBBtn>
                                {
                                  formData.finalFilledPlacement ? formData.finalFilledPlacement.name : formData.finalFilledPlacementLink ?
                                    <a href={formData.finalFilledPlacementLink && formData.finalFilledPlacementLink.filename ? `/${formData.finalFilledPlacementLink.path}`: '#'} rel="noopener noreferrer" target="_blank" className="file-upload-name">{formData.finalFilledPlacementLink && formData.finalFilledPlacementLink.filename}</a>
                                    : ''
                                }
                                <p>
                                {
                                  (role === '3' || role === '2') &&
                                    <select name="status" value={formData.status} className="browser-default" onChange={this.handleChange}>
                                      <option>Preparing Agreement</option>
                                      <option value="1">Approve</option>
                                    </select>
                                }
                                </p>
                              </MDBCol>
                          }
                        </MDBRow>
                        {role === '0' ?
                          null
                            // <MDBBtn rounded  color="danger" className="application-info-button second-action-button  z-depth-1a check-file-upload"
                            //         onClick={() => this.state.programId && this.props.history.push(`/program/${this.state.programId}`)}>
                            //   Back
                            // </MDBBtn>
                          :
                          <>
                              <MDBBtn
                                rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color"
                                onClick={this.handlePostAgreementPlacementClick}
                                style={{ width: '70px' }}
                              >
                                Save
                              </MDBBtn>

                              <MDBBtn rounded color="danger" className="application-info-button second-action-button z-depth-1a check-file-upload red-color"
                                      onClick={() => this.state.programId && this.props.history.push(`/program/${this.state.programId}`)}
                                      style={{ width: '80px' }}
                              >
                                Cancel
                              </MDBBtn>
                          </>
                        }
                      </MDBCol>
                      <MDBCol md="12">
                        <p className="text-right">
                          <MDBBtn
                            rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color col-md-3"
                            onClick={() => {
                              if (role !== '1')
                                this.props.history.push('/view-program')
                            }}
                          >
                            Back to Account Dashboard
                          </MDBBtn>
                          <MDBBtn
                            rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color col-md-3"
                            onClick={() => {
                              if (role !== '1')
                                this.props.history.push(`/program/${programId}`)
                            }}
                          >
                            Back to Program Detail
                          </MDBBtn>
                        </p>
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
