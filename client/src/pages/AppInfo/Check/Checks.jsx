/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard,
} from 'mdbreact';
import axios from 'axios';

import {queryStringToJSON, roleBaseBreadCrumbHeading} from '../../../utils/util'
import FooterComponent from '../../Footer';
import HeaderComponent from '../../Header';
import './checks.css'
import HomeIcon from "@material-ui/icons/Home";
import {Link} from "react-router-dom";

class Checks extends Component {
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

  componentWillMount() {
    const { location, history } = this.props;
    // props.location.search
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

  saveFirstCheck = () => {
    const { formData: { first }, orgId, programId } = this.state;
    const formData = new FormData();
    if (this.validate(first)) {
      return
    }

    let postProgram = '/api/createNewCheck';

    if (first.objectId) {
      postProgram = '/api/updateCheckById';
      // delete first.checkFile
      formData.append('objectId', first.objectId);
    } else {
      postProgram = '/api/createNewCheck';
    }
    formData.append('path', `${this.state.orgName}/firstCheck`);
    formData.append('sessionToken', this.state.sessionToken);
    formData.append('checkAmount', first.checkAmount);
    formData.append('checkId', first.checkId); //
    formData.append('checkDate', first.checkDate);
    formData.append('orgId', orgId);
    formData.append('programId', programId);
    formData.append('checkType', '1');

    if (first.checkFile) {
      formData.append('checkFile', first.checkFile);
    }

    axios.post(
      postProgram,
      formData,
    ).then((response) => {

      alert('Save Successfully');
      // this.fetchCheckData('1');
      console.warn('reponse message', response.data);
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

  saveSecondCheck = () => {
    const { formData: { second }, orgId, programId } = this.state;
    const formData = new FormData();
    if (this.validate(second)) {
      return
    }

    let postProgram = '/api/createNewCheck';

    if (second.objectId) {
      postProgram = '/api/updateCheckById';
      formData.append('objectId', second.objectId);
    } else {
      postProgram = '/api/createNewCheck';
    }
    // formData.append('sessionToken', this.state.sessionToken);
    formData.append('path', `${this.state.orgName}/finalCheck`);
    formData.append('checkAmount', second.checkAmount);
    formData.append('checkId', second.checkId); //
    formData.append('checkDate', second.checkDate);
    formData.append('orgId', orgId);
    formData.append('programId', programId);
    formData.append('checkType', '2');

    if (second.checkFile) {
      formData.append('checkFile', second.checkFile);
    }

    axios.post(
      postProgram,
      formData,
    ).then((response) => {
      alert('????Save Successfully');
      // this.fetchCheckData('2');
      console.warn('reponse message', response.data);
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
    const fieldName = e.target.name.split('-');

    this.setState({
      formData: {
        ...formData,
        [fieldName[0]]: {
          ...formData[fieldName[0]],
          [fieldName[1]]: e.target.value,
        }
      }
    });
  };

  render() {
    const { formData: { first = {}, second = {} }, role, programId, } = this.state;
    let heading = 'Send Check';

    const headingBreadCrumbs = roleBaseBreadCrumbHeading(role);

    const breadCrums = [{
      name: 'dashboard',
      child: <li key={`dashboard1`} className="breadcrumb-item"><HomeIcon/> <Link to={'/view-program'}>{headingBreadCrumbs} Dashboard</Link></li>,
    }, {
      name: 'programView',
      child: <li key={`programView2`} className="breadcrumb-item"><Link to={`/program/${programId}`}> Program Detail</Link></li>,
    }, {
      name: 'checks',
      child: <li key={`checks1`} className="breadcrumb-item active"> Send Check</li>,
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
                  <MDBRow>
                    <MDBCol md="6" className="pt-3 font-weight-bold check-sub-header">
                        <h3>First Check</h3>
                        <div className="form-group font-weight-bold">                        
                          <div className="col-sm-12 p-0 pb-3">
                          <label className="col-form-label check-form-label" style={{ padding: '0' }}>Check Amount:-</label><br></br>
                            {role == '0' ? first && <label className="col-form-label check-form-label font-weight-light">{first.checkAmount || ''}</label>
                              : <input type="number" className="form-control" name="first-checkAmount" value={first.checkAmount} onChange={this.handleChange} />
                            }
                        </div>                       
                        <div className="col-sm-12 p-0 ">
                        <label className="col-form-label check-form-label" style={{ padding: '0' }}>Check #:-</label><br></br>
                          {role == '0' ? <label className="col-form-label check-form-label font-weight-light">{first && first.checkId}</label>
                            : <input type="text" className="form-control" name="first-checkId" value={first.checkId} onChange={this.handleChange}/>
                          }
                        </div>
                      </div>
                      <div className="form-group font-weight-bold">                        
                        <MDBRow>
                        <div className="col-sm-12">
                        <label className="col-form-label check-form-label" style={{ padding: '0' }}>Check Image:-</label><br></br>
                          <label className="col-form-label" style={{
                            fontWeight: '100',
                            color: '#b6b6b6',
                          }}>
                          {
                            first.checkFile ?
                              <a href={`${this.state.orgName}/agreement/${first.checkFile.name }`} rel="noopener noreferrer" target="_blank" className="link-under-line">
                                {first.checkFile.name }
                              </a>
                            :
                            first.checkFileLink &&
                              <a href={`/${first.checkFileLink.path}`} rel="noopener noreferrer" target="_blank" className="link-under-line">
                                {first.checkFileLink.originalname}
                              </a>
                          }
                          </label>
                        </div>
                        <div className="col-sm-12">
                          {role == '0' ? null :
                            <>
                              <input type="file" className="form-control" style={{ display: 'none' }} name="first-checkFile" onChange={this.handleFileChange}/>
                              <MDBBtn rounded color="default" className="application-info-button second-action-button file-upload z-depth-1a check-file-upload" onClick={() => this.handleFileClick('first-checkFile')}>
                                Click to Upload/Replace Image
                              </MDBBtn>
                            </>
                          }
                        </div>
                        </MDBRow>
                      </div>
                      <div className="form-group font-weight-bold">
                        
                        <div className="col-sm-6 p-0">
                        <label className="col-form-label check-form-label" style={{ padding: '0' }}>Check Date:-</label><br></br>
                          {role == '0' ? first && <label className="col-form-label check-form-label font-weight-light">{first.checkDate || ''}</label>
                            : <input type="text" className="form-control" name="first-checkDate" value={first.checkDate} onChange={this.handleChange}/>
                          }
                        </div>
                      </div>
                      {role == '0' ? null :
                        <MDBRow className="form-group font-weight-bold">
                          <MDBCol sm="12">

                            <MDBBtn rounded 
                                    className="send-button second-action-button z-depth-1a check-file-upload"
                                    onClick={this.saveFirstCheck}>
                              Send
                            </MDBBtn>

                            <MDBBtn rounded
                                    color="danger"
                                    className="cancel-button second-action-button  z-depth-1a check-file-upload"
                                    onClick={event => {
                                      this.props.history.goBack();
                                    }}>
                              Back To Program Detail
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol sm="3">

                          </MDBCol>
                        </MDBRow>
                      }
                    </MDBCol>
                    <MDBCol md="6" className="pt-3 font-weight-bold check-sub-header">
                      <h3>Second check</h3>

                        <div className="form-group font-weight-bold">
                         
                          <div className="col-sm-12 p-0 pb-3">
                          <label className="col-form-label check-form-label" style={{ padding: '0' }}>Check Amount:-</label><br></br>
                            {role == '0' ? second && <label className="col-form-label check-form-label font-weight-light">{second.checkAmount || ''}</label>
                              : <input type="number" className="form-control" name="second-checkAmount" value={second.checkAmount} onChange={this.handleChange}/>
                            }
                          </div>
                          
                          <div className="col-sm-12 p-0">
                          <label className="col-form-label check-form-label" style={{ padding: '0' }}>Check #:-</label><br></br>
                            {role == '0' ? second && <label className="col-form-label check-form-label font-weight-light">{second.checkId || ''}</label>
                              : <input type="text" className="form-control" name="second-checkId" value={second.checkId} onChange={this.handleChange}/>
                            }
                          </div>
                        </div>

                        <div className="form-group font-weight-bold">
                          <label className="col-form-label check-form-label" style={{ padding: '0' }}>Check Image:-</label><br></br>
                          <MDBRow>
                            <div className="col-sm-12">
                              <label className="col-form-label" style={{
                                fontWeight: '100',
                                color: '#b6b6b6',
                              }}>
                                {
                                  second.checkFile ?
                                    <a href={`uploads/checks/${second.checkFile.name }`} rel="noopener noreferrer" target="_blank" className="link-under-line">
                                      {second.checkFile.name }
                                    </a>
                                  :
                                  second.checkFileLink &&
                                    <a href={`/${second.checkFileLink.path}`} rel="noopener noreferrer" target="_blank" className="link-under-line">
                                      {second.checkFileLink.originalname}
                                    </a>
                                }
                              </label>
                            </div>
                            <div className="col-sm-12">
                              {role == '0' ? null :
                                <>
                                  <input type="file" className="form-control" style={{display: 'none'}}
                                        name="second-checkFile" onChange={this.handleFileChange}/>
                                  <MDBBtn rounded
                                          className="application-info-button second-action-button file-upload z-depth-1a check-file-upload"
                                          onClick={() => this.handleFileClick('second-checkFile')}>
                                    Click to Upload/Replace Image
                                  </MDBBtn>
                                </>
                              }
                            </div>
                          </MDBRow>
                        </div>

                        <div className="form-group font-weight-bold">
                          <div className="col-sm-6 p-0">
                          <label className="col-form-label check-form-label" style={{ padding: '0' }}>Check Date:-</label><br></br>
                            {role == '0' ? second && <label className="col-form-label check-form-label font-weight-light">{second.checkDate || ''}</label>
                              : <input type="text" className="form-control" name="second-checkDate" value={second.checkDate} onChange={this.handleChange} />
                            }
                          </div>
                        </div>
                        {role == '0' ?
                          <div className="form-group font-weight-bold">
                            <MDBCol sm="5"/>
                            <MDBCol sm="3 p-0" md="5">
                              <MDBBtn rounded
                              color="danger"
                                      className="send-button second-action-button z-depth-1a check-file-upload mt-2"
                                      onClick={event => {
                                        this.props.history.goBack();
                                      }}
                              >
                                Back To Program Detail
                              </MDBBtn>
                            </MDBCol>
                          </div>
                          :
                          <div className="form-group font-weight-bold">
                              <MDBBtn rounded  
                                      className="send-button second-action-button z-depth-1a check-file-upload"
                                      onClick={this.saveSecondCheck}>
                                Send
                              </MDBBtn>
                              <MDBBtn rounded 
                                      color="danger"
                                      className="cancel-button second-action-button z-depth-1a check-file-upload"
                                      onClick={event => {
                                        this.props.history.goBack();
                                      }}
                              >
                                Back To Program Detail
                              </MDBBtn>
                          </div>
                        }



                    </MDBCol>
                  </MDBRow>
                  <br/>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>


        </MDBContainer>
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  fetchCheckData = (getCheckTypeData) => {
    const fetchAllChecksByOrgIdProgId = '/api/fetchAllChecksByOrgIdProgId';
    const { orgId, programId, formData } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllChecksByOrgIdProgId,
        {
          sessionToken: this.state.sessionToken,
          orgId,
          programId,
        },
      ).then((response) => {
        const first = response.data.checks.find(e => e.type === '1') || {};
        const second = response.data.checks.find(e => e.type === '2') || {};
        if (getCheckTypeData === '1') {
          this.setState({
            formData: {
              ...formData,
              first: { ...first, checkAmount: first.amount, checkFile: '', checkDate: first.date, checkFileLink: first.checkFile },
            },
          })
        } else if (getCheckTypeData === '2') {
          this.setState({
            formData: {
              ...formData,
              second: { ...second, checkAmount: second.amount, checkFile: '', checkDate: second.date, checkFileLink: second.checkFile },
            },
          })
        } else {
          this.setState({
            formData: {
              first: { ...first, checkAmount: first.amount, checkFile: '', checkDate: first.date, checkFileLink: first.checkFile },
              second: { ...second, checkAmount: second.amount, checkFile: '', checkDate: second.date, checkFileLink: second.checkFile },
            },
          })
        }



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

export default Checks;
