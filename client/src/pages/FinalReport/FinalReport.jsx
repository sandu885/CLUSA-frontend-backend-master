/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard
} from 'mdbreact';
import axios from 'axios';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import './finalReport.css'
import { questionList } from './questionList'
import { queryStringToJSON } from "../../utils/util";

class FinalReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      dataReceived: false,
      formData: {},
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
    };
  }

  handleFileClick = (name) => {
    const fileUpload = document.getElementsByName(name)[0];
    fileUpload.click();
  };

  handleFileChange = (e) => {
    const { formData } = this.state;

    const nameSplit = e.target.name.split('-');

    this.setState({
      formData: {
        ...formData,
        [nameSplit[0]]: {
          ...formData[nameSplit[0]],
          [nameSplit[1]]: e.target.files[0],
        }
      }
    });

  };

  handleChange = (e) => {
    const { formData } = this.state;

    const nameSplit = e.target.name.split('-');

    this.setState({
      formData: {
        ...formData,
        [nameSplit[0]]: {
          ...formData[nameSplit[0]],
          [nameSplit[1]]: e.target.value,
        }
      }
    });
  };

  componentWillMount() {
    // const { location, history } = this.props;
    const { location } = this.props;
    const queryData = queryStringToJSON(location.search);
    // if (!queryData.orgId && !queryData.programId) {
    //   alert('Not having proper data to access this route');
    //   history.goBack();
    // }
    this.setState({
      ...queryData,
    });
  }

  clickCancel = () => {
    const { history } = this.props;
    history.goBack();
  };

  validate = (data) => {
    if (data && data.q2 && data.q2['third'] && data.q2['third']) {
      const fileName = data.q2['third'].name;
      const allowFileExt = ['csv', 'xlx', 'xlsx'];
      if (!allowFileExt.includes(/[^.]+$/.exec(fileName)[0])) {
        alert('The file format is not supported');
        return true
      }
    }
    return false
  };
  
  handleFinalReportPost = async (isSubmitted) => {
    const { history } = this.props;
    const { formData: postData, sessionToken, role, programId, orgId } = this.state;

    if (this.validate(postData)) {
      return 
    }

    const formData = new FormData();
    let postFinalReportURL = '/api/createNewFinalReport';

    if (postData.q2['third']) {
      postData.q2['third'] && formData.append('file', postData.q2['third']);
      delete postData.q2['third']
    }

    if (postData.objectId) {
      postFinalReportURL = '/api/updateFinalReportById';
      formData.append('objectId', postData.objectId);
    } else {
      postFinalReportURL = '/api/createNewFinalReport';
    }
    formData.append("q1[first]", postData.q1['first'] || '');
    formData.append("q1[second]", postData.q1['second'] || '');
    formData.append("q1[third]", postData.q1['third'] || '');

    formData.append("q2[first]", postData.q2['first'] || '');
    formData.append("q2[second]", postData.q2['second'] || '');

    formData.append("q3[first]", postData.q3['first'] || '');
    formData.append("q3[second]", postData.q3['second'] || '');
    formData.append("q3[third]", postData.q3['third'] || '');
    formData.append("q3[forth]", postData.q3['forth'] || '');

    formData.append('orgId', orgId);
    formData.append('programId', programId);
    formData.append('sessionToken', sessionToken);
    formData.append('role', role);
    formData.append('isSubmitted', isSubmitted);
    formData.append('path', 'final-report');


    try {
      await axios.post(
        postFinalReportURL,
        formData,
      );
      console.warn('console User finish');
      history.goBack();
    } catch (error) {
      if(error.response !== null && error.response !== undefined) {
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
    }
  };

  render() {
    const { formData: { q1 = {}, q2 = {}, q3 = {}, fileLink } } = this.state;

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBRow className="text-center p-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    Final Report
                  </MDBCol>
                </MDBRow>
                <MDBCardBody>

                  <MDBRow>

                    <MDBCol md="1" />

                    <MDBCol md="10">
                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size">
                          {questionList['question1-1']}
                        </label>
                        <input type="number" className="form-control ml-4 final-report-input" name="q1-first" value={q1['first']} onChange={this.handleChange} />
                      </div>


                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size">
                          {questionList['question1-2']}
                        </label>
                        <input type="number" className="form-control ml-4 final-report-input" name="q1-second" value={q1['second']} onChange={this.handleChange} />
                      </div>

                      <div className="pt-second text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size">
                          {questionList['question1-3']}
                        </label>
                        <textarea className="form-control ml-4 final-report-input" name="q1-third" value={q1['third']} onChange={this.handleChange} />
                      </div>

                      <div className="pt-second text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size">
                          {questionList['question2-1']}
                        </label>
                        <input type="number" className="form-control ml-4 final-report-input" name="q2-first" value={q2['first']} onChange={this.handleChange} />
                      </div>

                      <div className="pt-second text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size">
                          {questionList['question2-2']}
                        </label>
                        <input type="number" className="form-control ml-4 final-report-input" name="q2-second" value={q2['second']} onChange={this.handleChange} />
                      </div>

                      <div className="pt-second text-left">
                        <label htmlFor="internship-s4-q1" style={{ width: '100%' }} className="font-weight-bold text-justify large-font-size">
                          {questionList['question2-3']}
                        </label>

                        {
                          fileLink &&
                          <a href={`/${fileLink.path}`} rel="noopener noreferrer" target="_blank">Click to download Expense Template</a>
                        }
                        <input type="file" className="form-control ml-4 final-report-input" name="q2-third" style={{ display: 'none' }} onChange={this.handleFileChange} />
                        <br/>
                        <MDBBtn rounded size={"sm"} style={{ width: '50%' }}  className="application-info-button second-action-button btn-block z-depth-1a check-file-upload" onClick={() => this.handleFileClick('q2-third')}>
                          Click to Upload Template
                        </MDBBtn>
                        <span> {q2['third'] && q2['third'].name} </span>

                      </div>

                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size">
                          {questionList['question3-1']}
                        </label>
                        <textarea className="form-control ml-4 final-report-input" name="q3-first" value={q3['first']} onChange={this.handleChange} />
                      </div>

                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size">
                          {questionList['question3-2']}
                        </label>
                        <textarea className="form-control ml-4 final-report-input" name="q3-second" value={q3['second']} onChange={this.handleChange} />
                      </div>
                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size">
                          {questionList['question3-3']}
                        </label>
                        <textarea className="form-control ml-4 final-report-input" name="q3-third" value={q3['third']} onChange={this.handleChange} />
                      </div>
                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size">
                          {questionList['question3-4']}
                        </label>
                        <textarea className="form-control ml-4 final-report-input" name="q3-forth" value={q3['forth']} onChange={this.handleChange} />
                      </div>

                      <div className="pt-4 text-center">
                        <MDBRow>
                          <MDBCol md="2"/>
                          <MDBCol md="3">
                            <MDBBtn
                              rounded
                              className="application-info-button second-action-button btn-block z-depth-1a check-file-upload light-green-color"
                              onClick={() => this.handleFinalReportPost(false)}
                            >
                              Save
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="3">
                            <MDBBtn
                              rounded
                              className="application-info-button second-action-button btn-block z-depth-1a check-file-upload"
                              onClick={() => this.handleFinalReportPost(true)}
                            >
                              Submit
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="3">
                            <MDBBtn
                              color="red"
                              rounded
                              className="application-info-button second-action-button btn-block z-depth-1a check-file-upload red-color"
                              onClick={this.clickCancel}
                            >
                              Cancel
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="1"/>
                        </MDBRow>
                      </div>
                    </MDBCol>
                    <MDBCol md="1" />
                  </MDBRow>
                </MDBCardBody>

                <br />

                <br />
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>

        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  fetchFinalReport = () => {
    const fetchAllFinalReportByOrgIdProgId = '/api/fetchAllFinalReportByOrgIdProgId';
    const { orgId, programId } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllFinalReportByOrgIdProgId,
        {
          sessionToken: this.state.sessionToken,
          orgId,
          programId
        },
      ).then((response) => {
        console.warn('clusa response', response.data);
        const formData = {
          ...response.data.finalReport,
          q1: response.data.finalReport.q1[0],
          q2: { ...response.data.finalReport.q2[0], file: '' },
          q3: response.data.finalReport.q3[0],
          fileLink: response.data.finalReport.q2[0].file,
        };
        // ======================== success ========================

        this.setState({
          formData,
        });

      }).catch((error) => {
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
    this.fetchFinalReport()
  }
}

export default FinalReport;
