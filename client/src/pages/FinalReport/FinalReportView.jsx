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

class FinalReportView extends Component {
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
    const { location, history } = this.props;
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

  validate = (formData) => {
    if (!formData.username) {
      alert('Please enter username.');
      return true
    }
    if (!formData.name) {
      alert('Please enter full name address.');
      return true
    }
    const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!formData.email) {
      alert('Please enter email address.');
      return true
    } else if (emailReg.test(formData.email) === false) {
      alert('Email address is invalid. So, please enter email address.');
      return true
    }

    if (!formData.role) {
      alert('Please select any role for the user.');
      return true
    }
    return false
  };

  handleFinalReportPost = async (isSubmitted) => {
    const { history } = this.props;
    const { formData: postData, sessionToken, role, programId, orgId } = this.state;

    const formData = new FormData();
    let postFinalReportURL = '/api/createNewFinalReport';

    if (postData.q2['third']) {
      postData.q2['third'] && formData.append('file', postData.q2['third']);
      delete postData.q2['third']
    }

    if (postData.objectId) {
      postFinalReportURL = '/api/updateFinalReportById';
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
    formData.append('sessionToken', this.state.sessionToken);
    formData.append('role', role);
    formData.append('isSubmitted', isSubmitted);
    formData.append('path', 'final-report');

    try {
      await axios.post(
        postFinalReportURL,
        formData,
      );
      console.warn('console User finish');
      // history.push('/user-organization-management');
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

    console.log('this.state', this.state);

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBRow className="text-center p-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    Final Report View
                  </MDBCol>
                </MDBRow>
                <MDBCardBody>

                  <MDBRow>

                    <MDBCol md="1" />

                    <MDBCol md="10">
                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size full-label-width">
                          {questionList['question1-1']}
                        </label>
                        <label htmlFor="internship-s4-q1" className="text-justify ml-4 large-font-size full-label-width">
                          {q1['first']}
                        </label>
                      </div>


                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size full-label-width">
                          {questionList['question1-2']}
                        </label>
                        <label htmlFor="internship-s4-q1" className="text-justify ml-4 large-font-size full-label-width">
                          {q1['second']}
                        </label>
                      </div>

                      <div className="pt-second text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size full-label-width">
                          {questionList['question1-3']}
                        </label>
                        <label htmlFor="internship-s4-q1" className="text-justify ml-4 large-font-size full-label-width">
                          {q1['third']}
                        </label>
                      </div>

                      <div className="pt-second text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size full-label-width">
                          {questionList['question2-1']}
                        </label>
                        <label htmlFor="internship-s4-q1" className="text-justify ml-4 large-font-size full-label-width">
                          {q2['first']}
                        </label>
                      </div>

                      <div className="pt-second text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size full-label-width">
                          {questionList['question2-2']}
                        </label>
                        <label htmlFor="internship-s4-q1" className="text-justify ml-4 large-font-size full-label-width">
                          {q1['second']}
                        </label>
                      </div>

                      <div className="pt-second text-left">
                        <label htmlFor="internship-s4-q1" style={{ width: '100%' }} className="font-weight-bold text-justify large-font-size full-label-width">
                          {questionList['question2-3']}
                        </label>
                        {
                          fileLink &&
                          <a href={`/${fileLink.path}`} className="ml-4" target="_blank">Click to download Expense Template</a>
                        }
                      </div>

                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size full-label-width">
                          {questionList['question3-1']}
                        </label>
                        <label htmlFor="internship-s4-q1" className="text-justify ml-4 large-font-size full-label-width">
                          {q3['first']}
                        </label>
                      </div>

                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size full-label-width">
                          {questionList['question3-2']}
                        </label>
                        <label htmlFor="internship-s4-q1" className="text-justify ml-4 large-font-size full-label-width">
                          {q3['second']}
                        </label>
                      </div>
                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size full-label-width">
                          {questionList['question3-3']}
                        </label>
                        <label htmlFor="internship-s4-q1" className="text-justify ml-4 large-font-size full-label-width">
                          {q3['third']}
                        </label>
                      </div>
                      <div className="pt-2 text-left">
                        <label htmlFor="internship-s4-q1" className="font-weight-bold text-justify large-font-size full-label-width full-label-width">
                          {questionList['question3-4']}
                        </label>
                        <label htmlFor="internship-s4-q1" className="text-justify ml-4 large-font-size full-label-width">
                          {q3['forth']}
                        </label>
                      </div>
                    </MDBCol>
                    <MDBCol md="1" />

                  </MDBRow>

                </MDBCardBody>

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
        const formData = {
          ...response.data.finalReport,
          q1: response.data.finalReport.q1[0],
          q2: response.data.finalReport.q2[0],
          q3: response.data.finalReport.q3[0],
          fileLink: response.data.finalReport.q2[0].file,
        };
        // ======================== success ========================

        // const formData = {
        //   username: response.data.user.username,
        //   email: response.data.user.emailAddress || response.data.user.email,
        //   name: response.data.user.firstName + ' ' + response.data.user.lastName,
        //   role: response.data.user.userType,
        // }
        // // console.warn('organizations in CLUSA', this.getData('organizations'));
        if (response.data.finalReport.isSubmitted) {
          this.setState({
            formData,
          });
        }

        // console.warn('orgAll', this.state.orgAll);

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

export default FinalReportView;
