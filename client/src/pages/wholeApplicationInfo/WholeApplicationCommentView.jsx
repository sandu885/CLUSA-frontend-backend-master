/* eslint-disable dot-notation */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from 'mdbreact';
import {queryStringToJSON} from '../../utils/util'
import axios from 'axios';

import '../style.css';
import './wholeApplication.css';

class WholeApplicationCommentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // sessionToken in local storage
      sessionToken: localStorage.getItem('sessionToken'),
      orgId: localStorage.getItem('orgId'),
      // get response info detail =============
      getOrgName: '',
      s1q101: '',
      s1q102: '',
      s1q1CompletedYear: '',
      s1q101NoDetail: '',
      s1q2: '',
      s1q3: '',
      s1q4: '',
      s1q5: '',
      s1q6: '',
      s1q7: '',
      s1q8: '',
      s1q9: '',
      s1q10: '',
      s1q11: '',
      s1qCheck: '',
      s2q1: '',
      s2q2: '',
      s2q3: '',
      s3q1: '',
      s3q2: '',
      s4q1: '',
      s5q1: '',
      s5q2: '',
      getS5q3: '',
      s6q1: '',
      s6q2: '',
      s6q3: '',
      s6q4: '',
      s7q1: '',
      s8q1: '',
      s9q1: '',
      s10q2: '',
      s10q3: '',
      s11q1: '',
      s12q1: '',
      s12q2: '',
      s12q3: '',
      s12q4: '',
      s12q5: '',
      s12q6: '',
      s12q7: '',
      s12q8: '',
      s12q9: '',
      s12q10: '',
      s12q11: '',
      s13q1: '',
      s13q2: '',
      s13q3: '',
      s13email: '',
      s13phone: '',
      // session expire redirect to login
      redirectToLogin: false,
    };
  }

  componentWillMount() {
    const { location, history } = this.props;

    const queryData = queryStringToJSON(location.search);
      this.setState({
      ...queryData,
    });
  }

  async getOrgInfo(caller) {
    const getOrginfoByIdAPI = '/api/getOrgInfoById';
    try {
      const response = await axios({
        method: 'post',
        url: getOrginfoByIdAPI,
        data: caller,
      });
      // ======================== success ========================
      if (response.data.message === 'Successfully get organization information') {
        this.setState({
          getOrgName: response.data.info.organization.name,
        });
        console.warn('console org finish', this.state.getOrgName);
      }
      } catch (error) {
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.setState({
                redirectToLogin: true,
              });
            }
          }
        }
    }
  }

  async getWholeOrgInfo(caller) {
    const getWholeApplication = '/api/getWholeApplication';
    try {
      const response = await axios({
        method: 'post',
        url: getWholeApplication,
        data: caller,
      });
      console.warn('whole application info response with response.data', response.data);
      // ======================== success ========================
      if (response.data.message === 'Successfully get whole application') {
        console.warn('befor set state ==================', this.state);
        console.warn('response.data.application', response.data.application);
        let finalS1q101 = '';
        try { finalS1q101 = response.data.application['1'].content[1].appliedBefore } catch (error) { finalS1q101 = '';}
        let finals1q102 = '';
        try { finals1q102 = response.data.application['1'].content[1].programs[0].granted } catch (error) { finals1q102 = '';}
        let finals1q1CompletedYear= '';
        try { finals1q1CompletedYear = response.data.application['1'].content[1].programs[0].startYear } catch (error) { finals1q1CompletedYear = '';}
        let finals1q101NoDetail = '';
        try { finals1q101NoDetail = response.data.application['1'].content[1].programs[0].summary } catch (error) { finals1q101NoDetail = '';}
        let finals1qCheck= '';
        try { finals1qCheck = response.data.application['1'].content[12] } catch (error) { finals1qCheck = '';}
        let finalS1q2 = '';
        try { finalS1q2 = response.data.application['1'].content[2] } catch (error) { finalS1q2 = '';}
        let finals1q3 = '';
        try { finals1q3 = response.data.application['1'].content[3]} catch (error) { finals1q3 = '';}
        let finals1q4 = '';
        try { finals1q4 = response.data.application['1'].content[4]} catch (error) { finals1q4 = '';}
        let finals1q5 = '';
        try { finals1q5 = response.data.application['1'].content[5]} catch (error) { finals1q5 = '';}
        let finals1q6 = '';
        try { finals1q6 = response.data.application['1'].content[6]} catch (error) { finals1q6 = '';}
        let finals1q7 = '';
        try { finals1q7 = response.data.application['1'].content[7]} catch (error) { finals1q7 = '';}
        let finals1q8 = '';
        try { finals1q8 = response.data.application['1'].content[8]} catch (error) { finals1q8 = '';}
        let finals1q9 = '';
        try { finals1q9 = response.data.application['1'].content[9]} catch (error) { finals1q9 = '';}
        let finals1q10 = '';
        try { finals1q10 = response.data.application['1'].content[10]} catch (error) { finals1q10 = '';}
        let finals1q11 = '';
        try {finals1q11 = response.data.application['1'].content[11] } catch (error) { finals1q11 = '';}
        let finals2q1 = '';
        try {finals2q1 = response.data.application['2'].content[1]} catch (error) { finals2q1 = '';}
        let finals2q2 = '';
        try {finals2q2 = response.data.application['2'].content[2]} catch (error) { finals2q2 = '';}
        let finals2q3 = '';
        try {finals2q3 = response.data.application['2'].content[3]} catch (error) { finals2q3 = '';}
        let finals3q1 = '';
        try {finals3q1 = response.data.application['3'].content[1]} catch (error) { finals3q1 = '';}
        let finals3q2 = '';
        try {finals3q2 = response.data.application['3'].content[2] } catch (error) { finals3q2 = '';}
        let finals4q1 = '';
        try {finals4q1 = response.data.application['4'].content[1]} catch (error) { finals4q1 = '';}
        let finals5q1 = '';
        try {finals5q1 = response.data.application['5'].content[1]} catch (error) { finals5q1 = '';}
        let finals5q2 = '';
        try {finals5q2 = response.data.application['5'].content[2]} catch (error) { finals5q2 = '';}
        let finals5q3 = '';
        try {finals5q3 = response.data.application['5'].content[3]} catch (error) { finals5q3 = '';}
        let finals6q1 = '';
        try {finals6q1 = response.data.application['6'].content[1]} catch (error) { finals6q1 = '';}
        let finals6q2 = '';
        try {finals6q2 = response.data.application['6'].content[2]} catch (error) { finals6q2 = '';}
        let finals6q3 = '';
        try {finals6q3 = response.data.application['6'].content[3]} catch (error) { finals6q3 = '';}
        let finals6q4 = '';
        try {finals6q4 = response.data.application['6'].content[4]} catch (error) { finals6q4 = '';}
        let finals7q1 = '';
        try {finals7q1 = response.data.application['7'].content[1]} catch (error) { finals7q1 = '';}
        let finals8q1 = '';
        try {finals8q1 = response.data.application['8'].content[1]} catch (error) { finals8q1 = '';}
        let finals9q1 = '';
        try {finals9q1 = response.data.application['9'].content[1]} catch (error) { finals9q1 = '';}
        let finals10q2 = '';
        try {finals10q2 = response.data.application['10'].content[2]} catch (error) { finals10q2 = '';}
        let finals10q3 = '';
        try {finals10q3 = response.data.application['10'].content[3]} catch (error) { finals10q3 = '';}
        let finals12q1 = '';
        try {finals12q1 = response.data.application['12'].content[1]} catch (error) { finals12q1 = '';}
        let finals12q2 = '';
        try {finals12q2 = response.data.application['12'].content[2]} catch (error) { finals12q2 = '';}
        let finals12q3 = '';
        try {finals12q3 = response.data.application['12'].content[3]} catch (error) { finals12q3 = '';}
        let finals12q4 = '';
        try {finals12q4 = response.data.application['12'].content[4]} catch (error) { finals12q4 = '';}
        let finals12q5 = '';
        try {finals12q5 = response.data.application['12'].content[5]} catch (error) { finals12q5 = '';}
        let finals12q6 = '';
        try {finals12q6 = response.data.application['12'].content[6]} catch (error) { finals12q6 = '';}
        let finals12q7 = '';
        try {finals12q7 = response.data.application['12'].content[7]} catch (error) { finals12q7 = '';}
        let finals12q8 = '';
        try {finals12q8 = response.data.application['12'].content[8]} catch (error) { finals12q8 = '';}
        let finals12q9 = '';
        try {finals12q9 = response.data.application['12'].content[9]} catch (error) { finals12q9 = '';}
        let finals12q10 = '';
        try {finals12q10 = response.data.application['12'].content[10]} catch (error) { finals12q10 = '';}
        let finals12q11 = '';
        try {finals12q11 = response.data.application['12'].content[11]} catch (error) { finals12q11 = '';}
        let finals11q1 = '';
        try {finals11q1 = response.data.application['11'].content[1]} catch (error) { finals11q1 = '';}
        let finalss13q1= '';
        try {finalss13q1 = response.data.application['13'].content[1]} catch (error) { finalss13q1 = '';}
        let finalss13q2= '';
        try {finalss13q2 = response.data.application['13'].content[2]} catch (error) { finalss13q2 = '';}
        let finalss13q3= '';
        try {finalss13q3 = response.data.application['13'].content[3]} catch (error) { finalss13q3 = '';}
        let finals13email= '';
        try {finals13email = response.data.application['13'].content[4]} catch (error) { finals13email = '';}
        let finals13phone= '';
        try {finals13phone = response.data.application['13'].content[5]} catch (error) { finals13phone = '';}
        await this.setState({
          s1q101: finalS1q101,
          s1q102: finals1q102,
          s1q1CompletedYear: finals1q1CompletedYear,
          s1q101NoDetail: finals1q101NoDetail,
          s1q2: finalS1q2,
          s1q3: finals1q3,
          s1q4: finals1q4,
          s1q5: finals1q5,
          s1q6: finals1q6,
          s1q7: finals1q7,
          s1q8: finals1q8,
          s1q9: finals1q9,
          s1q10: finals1q10,
          s1q11: finals1q11,
          s1qCheck: finals1qCheck,
          s2q1: finals2q1,
          s2q2: finals2q2,
          s2q3: finals2q3,
          s3q1: finals3q1,
          s3q2: finals3q2,
          s4q1: finals4q1,
          s5q1: finals5q1,
          s5q2: finals5q2,
          getS5q3: finals5q3,
          s6q1: finals6q1,
          s6q2: finals6q2,
          s6q3: finals6q3,
          s6q4: finals6q4,
          s7q1: finals7q1,
          s8q1: finals8q1,
          s9q1: finals9q1,
          s10q2: finals10q2,
          s10q3: finals10q3,
          s12q1: finals12q1,
          s12q2: finals12q2,
          s12q3: finals12q3,
          s12q4: finals12q4,
          s12q5: finals12q5,
          s12q6: finals12q6,
          s12q7: finals12q7,
          s12q8: finals12q8,
          s12q9: finals12q9,
          s12q10: finals12q10,
          s12q11: finals12q11,
          s11q1: finals11q1,
          s13q1: finalss13q1 ? typeof finalss13q1 == 'string' ? finalss13q1 ? finalss13q1.name : finalss13q1.name : '' : '',
          s13q2: finalss13q2,
          s13q3: finalss13q3,
          s13email: finals13email,
          s13phone: finals13phone,
        });
        console.warn('after set state ==================', this.state);
        console.warn('s1qccheck-----------------', this.state.s1qCheck)
      }
     } catch (error) {
      if(error.response !== '' && error.response !== undefined) {
        if( error.response.data !== null && error.response.data !== undefined ) {
          if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
            localStorage.clear();
            alert('Your login status was expired. Please login again.');
            this.setState({
              redirectToLogin: true,
            });
          }
        }
      }
     }
  }

  async getUploadedFiles(caller) {
      try {
        const response = await axios({
          method: 'post',
          url: '/api/getApplicationFileBySectionIndex',
          data: caller,
          responseType: 'blob',
        });

        const link = document.createElement('a', { className: '', id: 'asd', style: { color: 'red', background: 'yellow' } }); let
          filename;
        const disposition = response.headers['content-disposition'];
        if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        link.href = window.URL.createObjectURL(response.data);
        link.download = filename;
        link.innerText = filename;
        document.getElementById('previousTitle').appendChild(link);
      } catch (e) {
        console.log(e);
      }
  }

  async componentDidMount() {
    console.warn('org info start');

     // get org info ==========
    const dataReviewerCall = {sessionToken: this.state.sessionToken, orgId: this.state.orgId,}
    const dataOrgCall = {sessionToken: this.state.sessionToken,}
    // get whole info ==========
    const wholeInfoReviewerCall = {
      sessionToken: this.state.sessionToken,
      programType: '0',
      orgId: this.state.orgId, }
    const wholeInfoOrgCall = {
      sessionToken: this.state.sessionToken,
      programType: '0', }
    // get uploaded file info ==========
    const uploadedFileReviewerCall = {
      sessionToken: this.state.sessionToken,
      programType: '0',
      sectionIndex:'10',
      orgId: this.state.orgId,
    }
    const uploadedFileOrgCall = {
      sessionToken: this.state.sessionToken,
      programType: '0',
      sectionIndex:'10',
    }


    // reviewer call ===================
     if (localStorage.getItem('orgId') != null) {
       // get org info
      try {
       await this.getOrgInfo(dataReviewerCall);
      } catch (error) {
        console.warn('try this.getOrgInfo error')
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.setState({
                redirectToLogin: true,
              });
            }
          }
        }
      }
      // get whole info
      try {
        await this.getWholeOrgInfo(wholeInfoReviewerCall);
      } catch (error) {
        console.warn('try this.getWholeOrgInfo error')
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.setState({
                redirectToLogin: true,
              });
            }
          }
        }
      }
      // get uploaded files
      try {
        await this.getUploadedFiles(uploadedFileReviewerCall);
      } catch (error) {
        console.warn('try this.getWholeOrgInfo error')
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.setState({
                redirectToLogin: true,
              });
            }
          }
        }
      }

      // ============================ organization call
     } else {
        // get org info
      try {
        await this.getOrgInfo(dataOrgCall);
       } catch (error) {
         console.warn('try this.getOrgInfo error')
         if(error.response !== null && error.response !== undefined) {
           if( error.response.data !== null && error.response.data !== undefined ) {
             if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
               localStorage.clear();
               alert('Your login status was expired. Please login again.');
               this.setState({
                 redirectToLogin: true,
               });
             }
           }
         }
       }
       // get whole info
      try {
        await this.getWholeOrgInfo(wholeInfoOrgCall);
      } catch (error) {
        console.warn('try this.getWholeOrgInfo error')
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.setState({
                redirectToLogin: true,
              });
            }
          }
        }
      }
       // get uploaded files
       try {
        await this.getUploadedFiles(uploadedFileOrgCall);
      } catch (error) {
        console.warn('try this.getWholeOrgInfo error')
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.setState({
                redirectToLogin: true,
              });
            }
          }
        }
      }
    }
  }

  handleClick = () => {
    this.props.history.push('/internship-application-section01')
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  s1q3TextResult = (responseNumber) => {
    if (responseNumber === '0') return 'Summer';
    if (responseNumber === '1') return 'Year Round';
    return null;
  }

  s1q4TextResult = (responseNumber) => {
    if (responseNumber === '0') return 'Would Appreciate Help';
    if (responseNumber === '1') return 'Learning/Getting There';
    if (responseNumber === '2') return 'Proficient';
    if (responseNumber === '3') return 'Experienced';
    if (responseNumber === '4') return 'N/A';
    return null;
  }

  render() {
    const { fixFooter } = this.props;

    return (
      <div className="bg-lightcolor">
        {/*<HeaderComponent />*/}
        <MDBContainer className="title-section">
          <MDBRow>
            <MDBCol
              md="6"
            >
              <h1>View detail1</h1>
            </MDBCol>
            <MDBCol
              md="6"
            >
              <MDBBtn
                color="secondary"
                  rounded className="application-info-button second-action-button z-depth-1a check-file-upload light-green-color float-right"
                  onClick={() => {
                      this.props.history.push(`/program/${this.state.programId}`)
                  }}
              >
                  Back to Program Detail
              </MDBBtn>
            </MDBCol>
           
          </MDBRow>
        </MDBContainer>
        <MDBContainer>
          <MDBRow>
            <MDBCol
              md="12"              
            >
              <MDBCard>
                <MDBCardBody className="mx-4">
                  <div className="mb-4">
                    <MDBRow style={{'border-bottom': '1px solid #bcbcbc'}}>
                    <MDBCol md="12" className="pt-2">
                      <strong className="custom-header">Organization Application Information</strong>
                      {this.state.role == '1' &&
                        <MDBBtn
                          rounded
                          style={{float:'right', 'margin-bottom': '5px' }}
                          className="green-button org-view-sub-header-button z-depth-1a"
                          disabled={this.state.status == "1"}
                          onClick={() => this.handleClick()}
                        >
                          Edit My Application
                        </MDBBtn>
                      }
                    </MDBCol>                   
                    </MDBRow>
                  </div>
                  <h5>The current applied organization is: <span className="ans-text">{this.state.getOrgName}</span></h5>
                  <div className="scroll-box">
                  {/* -----------SECTION 1: Internship Program Overview  ----------- */}
                  <div className="section01">
                    <div className="pt-2 pb-2 mt-4">
                      <h3>SECTION 1: Internship Program Overview</h3>
                    </div>
                    <div className="pt-4 text-left">
                      <form
                        id="getAllApplication-form"
                        className="form-all"
                      >
                        <p>By ticking this box, I have read the grant instructions found on the
                        immediate login portal and fully assume the responsibility of
                        fulfilling the requirements as dictated.
                        </p>
                        <h5 className="ans-text pl-4">{this.state.s1qCheck === true ? 'Have checked this box' : 'Did not check this box' } </h5>
                        {/* ----------- 1.1----------- */}
                        <label className="font-weight-bold">
                            1.1.
                          <span className="redColor">* </span>Has your organization
                            applied for the CLUSA Internship grant before? Result?
                        </label>
                        <div className="pl-4">
                          <MDBRow> Applied Before?&nbsp;&nbsp; <br /><h5 className="ans-text">{this.state.s1q101} </h5></MDBRow>
                          {this.state.s1q101 === 'Yes'
                            ? (
                              <div><MDBRow>The program applied year is &nbsp;&nbsp; <h5 className="ans-text">{this.state.s1q1CompletedYear}</h5></MDBRow><MDBRow> Granted?&nbsp;&nbsp; <h5 className="ans-text">{this.state.s1q102}</h5></MDBRow>
                              </div>
                            ) : (
                              <div><MDBRow><h5 className="ans-text">{this.state.s1q101NoDetail}</h5></MDBRow></div>
                            )}

                        </div>
                        <br />
                        {/* ----------- 1.2 years benn active ----------- */}
                        <label
                          htmlFor="internship-s1-q2"
                          className="font-weight-bold pt-3"
                        >
                            1.2.<span className="redColor">* </span>How many years has your
                            organization’s internship program been active?
                        </label>
                        <h5 className="ans-text">{this.state.s1q2}</h5>

                        {/* ----------- 1.3 term design ----------- */}
                        <label className="font-weight-bold pt-3">
                            1.3.
                          <span className="redColor">* </span>For what terms is your
                            internship program designed for?
                        </label>
                        <h5 className="ans-text">{this.s1q3TextResult(this.state.s1q3)}</h5>
                        {/* ----------- 1.4 following questions ----------- */}
                        <div>
                          <label
                            htmlFor="internship-s1-q4"
                            className="font-weight-bold pt-3"
                          >
                            1.4.<span className="redColor">* </span>Please fill out the
                            following as accurately as possible to the following scale:
                          </label>
                          <div className="pl-5 font-weight-bold">
                            <MDBRow className="pt-2">Internship Placement: &nbsp;<h5 className="ans-text"> {this.s1q4TextResult(this.state.s1q4)}</h5></MDBRow>
                            <MDBRow className="pt-2">Recruiting Passionate And high-Quality Students: &nbsp;<h5 className="ans-text"> {this.s1q4TextResult(this.state.s1q5)}</h5></MDBRow>
                            <MDBRow className="pt-2">Student Training: &nbsp;<h5 className="ans-text"> {this.s1q4TextResult(this.state.s1q6)}</h5></MDBRow>
                            <MDBRow className="pt-2">Student Support During The Internship: &nbsp;<h5 className="ans-text"> {this.s1q4TextResult(this.state.s1q7)}</h5></MDBRow>
                            <MDBRow className="pt-2">Following Up On Students: &nbsp;<h5 className="ans-text"> {this.s1q4TextResult(this.state.s1q8)}</h5></MDBRow>
                            <MDBRow className="pt-2">Community Building Including Voter Registration, Census, Government Training, etc.: &nbsp;<h5 className="ans-text"> {this.s1q4TextResult(this.state.s1q9)}</h5></MDBRow>
                            <MDBRow className="pt-2">Fundraising: &nbsp;<h5 className="ans-text"> {this.s1q4TextResult(this.state.s1q10)}</h5></MDBRow>
                            <MDBRow className="pt-2">Building A Pipeline Of APIA In Public Service To Elected Office: &nbsp;<h5 className="ans-text"> {this.s1q4TextResult(this.state.s1q11)}</h5></MDBRow>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* -----------SECTION 2. Grant Goals  ----------- */}
                  <div className="section02">
                    <div className="pt-2 pb-2 mt-4">
                    <h3>SECTION 2. Grant Goals</h3>
                    </div>
                    <div className="pt-4 text-left">
                      <form
                        id="getAllApplication-form"
                        className="form-all"
                      >
                        {/* ----------- 2.1: encouraging ----------- */}
                        <label
                          htmlFor="internship-s2-q1"
                          className="font-weight-bold text-justify"
                        >
                            2.1.
                          <span className="redColor">* </span>Encouraging local community-building through public sector engagement
                        </label>
                        <h5 className="ans-text">{this.state.s2q1}</h5>
                        {/* ----------- 2.2: inspiring ----------- */}
                        <label
                          htmlFor="internship-s2-q2"
                          className="font-weight-bold pt-3 text-justify"
                        >
                            2.2.
                          <span className="redColor">* </span>Inspiring interest in seeking local public offices—including community members, student interns, and internship program leaders engagement
                        </label>
                        <h5 className="ans-text">{this.state.s2q2}</h5>
                        {/* ----------- 2.3: building pipeline ----------- */}
                        <label
                          htmlFor="internship-s2-q3"
                          className="font-weight-bold pt-3 text-justify"
                        >
                            2.3.
                          <span className="redColor">* </span>Building a pipeline of Asian Americans in local public office
                        </label>
                        <h5 className="ans-text">{this.state.s2q3}</h5>
                      </form>
                    </div>
                  </div>
                  {/* -----------SECTION 3. Internship Leaders Team ----------- */}
                  <div className="section03">
                    <div className="pt-2 pb-2 mt-4">
                      <h3>SECTION 3. Internship Leaders Team</h3>
                    </div>
                    <div className="pt-4 text-left">
                      {/* ----------- 3.1 ----------- */}
                      <label
                        htmlFor="internship-s3-q1"
                        className="font-weight-bold text-justify"
                      >3.1.
                        <span className="redColor">* </span>The Internship Organizer leads in building relationships for internship placements in elected office/government agency internships, galvanizes community financial support, and organizes the internship graduation celebration. Please provide their name and a brief profile of <i>the Internship Organizer engagement</i>
                      </label>
                      <h5 className="ans-text"> {this.state.s3q1}</h5>
                      {/* ----------- 3.2 ----------- */}
                      <label
                        htmlFor="internship-s3-q2"
                        className="font-weight-bold pt-3 text-justify"
                      >3.2.
                        <span className="redColor">* </span><i>The Internship Trainer</i> leads in organizing training, oversight, and mentoring of student interns. This person is very skilled at relating to iGeneration youths born after the 2000s. Please provide name and a brief profile of the Internship Trainer.
                      </label>
                      <h5 className="ans-text">{this.state.s3q2}</h5>
                    </div>
                  </div>
                  {/* -----------SECTION 4. Internship Program Schedule ----------- */}
                  <div className="section04">
                    <div className="pt-2 pb-2 mt-4">                     
                      <h3> SECTION 4. Internship Program Schedule</h3>
                    </div>
                    <div className="pt-4 text-left">
                      {/* ----------- 4.1 ----------- */}
                      <label
                        htmlFor="internship-s4-q1"
                        className="font-weight-bold text-justify"
                      >4.1.
                        <span className="redColor">* </span>Please include the timeline and important time points, such as recruiting, training, internship starting and ending, graduation ceremony, other events
                      </label>
                      <h5 className="ans-text"> {this.state.s4q1}</h5>
                    </div>
                  </div>
                  {/* -----------SECTION 5. Internship Placement ----------- */}
                  <div className="section05">
                    <div className="pt-2 pb-2 mt-4">
                      <h3>SECTION 5. Internship Placement</h3>
                    </div>
                    <div className="pt-4 text-left">
                      {/* ----------- 5.1 ----------- */}
                      <label
                        htmlFor="internship-s5-q1"
                        className="font-weight-bold pt-3"
                      >5.1.<span className="redColor">* </span>How many internship placements are you targeting to have in year 2020?
                        <h5 className="ans-text">{this.state.s5q1}</h5>
                      </label>

                      {/* ----------- 5.2 ----------- */}
                      <label
                        htmlFor="internship-s5-q2"
                        className="font-weight-bold pt-3"
                      >5.2.<span className="redColor">* </span>How many of the placements are confirmed by your best knowledge?
                        <h5 className="ans-text">{this.state.s5q2}</h5>
                      </label>
                      {/* ----------- 5.3 ----------- */}
                      <label
                        htmlFor="internship-s5-q3"
                        className="font-weight-bold pt-3"
                      >
                          5.3.<span className="redColor">* </span>Please provide detailed placement information in the table below
                      </label>
                      <div>
                        <table id="placements">
                          <tbody>
                            <tr>
                              <th>Name of Elected Office/Gov. Agency</th>
                              <th>Number of Placements Confirmed</th>
                              <th>Number of Placements Likely</th>

                            </tr>
                            {
                              this.state.getS5q3 ? this.state.getS5q3.map((d) => (

                                <tr
                                  key={d.placementName}
                                  className="darkblueColor"
                                >
                                  <td>{d.placementName}</td>
                                  <td>{d.placementNumber}</td>
                                  <td>{d.placementNumberLikely}</td>
                                </tr>
                              )) : null
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* -----------SECTION 6. Student Recruiting Plan ----------- */}
                  <div className="section06">
                    <div className="pt-2 pb-2 mt-4">                    
                    <h3>SECTION 6. Student Recruiting Plan</h3>
                    </div>
                    <div className="pt-4 text-left">
                      {/* ----------- 6.1 ----------- */}
                      <label
                        htmlFor="internship-s6-q1"
                        className="font-weight-bold text-justify"
                      >
                            6.1.
                        <span className="redColor">* </span>What age range of students are you looking for as interns (ie. high school students, college, both)?
                      </label>
                      <p className="text-justify">Note: Your local organization is responsible for adhering to laws and best practices in supervising student interns experience for minors</p>
                      <h5 className="ans-text">{this.state.s6q1}</h5>
                      {/* ----------- 6.2 ----------- */}
                      <label
                        htmlFor="internship-s6-q2"
                        className="font-weight-bold text-justify pt-3"
                      >
                            6.2.
                        <span className="redColor">* </span>What criteria are you using to select students?
                      </label>
                      <h5 className="ans-text">{this.state.s6q2}</h5>
                      {/* ----------- 6.3 ----------- */}
                      <label
                        htmlFor="internship-s6-q3"
                        className="font-weight-bold text-justify pt-3"
                      >
                            6.3.
                        <span className="redColor">* </span>What procedure is your student recruitment?
                      </label>
                      <h5 className="ans-text">{this.state.s6q3}</h5>
                      {/* ----------- 6.4 ----------- */}
                      <label
                        htmlFor="internship-s6-q4"
                        className="font-weight-bold text-justify pt-3"
                      >
                            6.4.
                        <span className="redColor">* </span>If your program includes minors, please provide a rationale and describe how your organization has met laws protecting minors.
                      </label>
                      <h5 className="ans-text"> {this.state.s6q4}</h5>
                    </div>
                  </div>
                  {/* -----------SECTION 7. Student Training Plan ----------- */}
                  <div className="section07">
                    <div className="pt-2 pb-2 mt-4">                    
                    <h3>SECTION 7. Student Training Plan</h3>
                    </div>
                    <div className="pt-4 text-left">
                      {/* ----------- 7.1 ----------- */}
                      <label
                        htmlFor="internship-s7-q1"
                        className="font-weight-bold"
                      >
                            7.1.
                        <span className="redColor">* </span>Please share your student training plan:
                      </label>
                      <h5 className="ans-text">{this.state.s7q1}</h5>
                    </div>
                  </div>
                  {/* -----------SECTION 8. Graduation Ceremony Plan ----------- */}
                  <div className="section08">
                    <div className="pt-2 pb-2 mt-4">                     
                      <h3>SECTION 8. Graduation Ceremony Plan</h3>
                    </div>
                    <div className="pt-4 text-left">
                      {/* ----------- 8.1 ----------- */}
                      <label
                        htmlFor="internship-s8-q1"
                        className="font-weight-bold text-justify"
                      >
                        8.1.
                        <span className="redColor">* </span>Graduation ceremonies are great opportunities for community-building and seeking financial support. Please share your graduation ceremony plan:
                      </label>
                      <h5 className="ans-text"> {this.state.s8q1}</h5>
                    </div>
                  </div>
                  {/* -----------SECTION 9. Other Events Related ----------- */}
                  <div className="section09">
                    <div className="pt-2 pb-2 mt-4">                    
                    <h3>SECTION 9. Other Events Related</h3>
                    </div>
                    <div className="pt-4 text-left">
                      {/* ----------- 9.1 ----------- */}
                      <label
                        htmlFor="internship-s9-q1"
                        className="font-weight-bold"
                      >9.1. If you have other related events, please add them below:
                      </label>
                      <h5 className="ans-text"> {this.state.s9q1}</h5>
                    </div>
                  </div>
                  {/* -----------SECTION 10. Program Budget ----------- */}
                  <div className="section10">
                    <div className="pt-2 pb-2 mt-4">                    
                    <h3>SECTION 10. Program Budget</h3>
                    </div>
                    <div className="pt-4 text-left">
                      <label
                        htmlFor="internship-s10-q1"
                        className="font-weight-bold"
                      >
                         10.1.
                        <span className="redColor">* </span>Please provide your program’s budget. CLUSA Internship grant ranges from $2,000 to 10,000 with at least 50% matching requirement. This is to encourage self-sustainability, whether in fundraising or any other means.
                      </label>
                      <h5
                        className="ans-text pt-2"
                        id="previousTitle"
                      >Previous Upload:
                      </h5>
                    </div>
                    <MDBRow className="text-center mt-4">
                      <MDBCol md="4" />
                      <MDBCol md="4">
                        <label
                          htmlFor="internship-s10-q2"
                          className="font-weight-bold pt-1"
                        >
                          <span className="redColor">* </span>Requested Amount($)
                        </label>
                      </MDBCol>
                      <MDBCol md="4">
                        <label
                          htmlFor="internship-s10-q3"
                          className="font-weight-bold pt-1"
                        >
                          <span className="redColor">* </span>% of Total Funds Needed
                        </label>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol
                        md="4"
                        className="pt-3 font-weight-bold"
                      >CLUSA Grant Request Amount
                      </MDBCol>
                      <MDBCol md="4">
                        <h5 className="ans-text">{this.state.s10q2}</h5>
                      </MDBCol>
                      <MDBCol md="4">
                        <h5 className="ans-text">{this.state.s10q3}</h5>
                      </MDBCol>
                    </MDBRow>
                  </div>

                  {/* -----------SECTION 11. Program Budget ----------- */}
                  <div className="section11">
                    <div className="pt-2 pb-2 mt-4">                    
                    <h3>SECTION 11. Future Plan</h3>
                    </div>
                    <div className="pt-4 text-left">
                      {/* -----------11.1 ----------- */}
                      <label
                        htmlFor="internship-s11-q1"
                        className="font-weight-bold text-justify"
                      >
                        11.1.
                        <span className="redColor">* </span>Please share your vision and long-term planning for your internship program for the following year and in the future.
                      </label>
                      <h5 className="ans-text">{this.state.s11q1}</h5>
                    </div>
                  </div>
                  {/* -----------12 PART B: GRANT AFFIRMATIONS ----------- */}
                  <div className="section12">
                    <div className="pt-2 pb-2 mt-4">                    
                    <h3>PART B: GRANT AFFIRMATIONS</h3>
                    </div>
                    <div className="pt-4 text-left">
                      {/* -----------12.a1 ----------- */}
                      <label
                        htmlFor="internship-s12-qa1"
                        className="font-weight-bold text-justify"
                      >
                        A.1 Participate in one informational grant video-conference (12/14/2019 or 1/11/2020)
                      </label>
                      <h5 className="ans-text"> {this.state.s12q1 === true ? 'Agree' : null}</h5>
                      {/* -----------12.a2 ----------- */}
                      <label
                        htmlFor="internship-s12-qa2"
                        className="font-weight-bold text-justify"
                      >
                        A.2 Participate in all 4 Leaders Training Webinars (2/15/2020, 3/21/2020, 4/18/2020, 5/16/2020)
                      </label>
                      <h5 className="ans-text"> {this.state.s12q2 === true ? 'Agree' : null}</h5>
                      {/* -----------12.a3 ----------- */}
                      <label
                        htmlFor="internship-s12-qa3"
                        className="font-weight-bold text-justify"
                      >
                        A.3 Provide supporting documents and final reports on time
                      </label>
                      <h5 className="ans-text"> {this.state.s12q3 === true ? 'Agree' : null}</h5>
                      {/* -----------12.b1 -4---------- */}
                      <label
                        htmlFor="internship-s12-b1"
                        className="font-weight-bold text-justify"
                      >B.1 Student background including Name, Age(Specify age criteria), College/School, Current Class Level, Ethnicity, Gender, Email, Cell, Address
                      </label>
                      <h5 className="ans-text"> {this.state.s12q4 === true ? 'Agree' : null}</h5>
                      {/* -----------12.b2 -5---------- */}
                      <label
                        htmlFor="internship-s12-qb2"
                        className="font-weight-bold text-justify"
                      >B.2 Selection Critera One: Student inters expresses interest in exploring government, public sector careers, and elective office through written response.
                      </label>
                      <h5 className="ans-text"> {this.state.s12q5 === true ? 'Agree' : null}</h5>
                      {/* -----------12.b3 --6--------- */}
                      <label
                        htmlFor="internship-s12-qb3"
                        className="font-weight-bold text-justify"
                      >B.3 Selection Criteria Two: Student inters describes relevant exoerience such as Asian American studies, political science, and government classes, and campaign voluteering, voter registration, and public speaking experience, etc. through written response.
                      </label>
                      <h5 className="ans-text"> {this.state.s12q6 === true ? 'Agree' : null}</h5>
                      {/* -----------12.b4 -7---------- */}
                      <label
                        htmlFor="internship-s12-qb4"
                        className="font-weight-bold text-justify"
                      >B.4 Selection Criteria Three: Student inters shares about view of own ethnic identity and relate it to how government may play a role to address a social issue of concern.

                      </label>
                      <h5 className="ans-text"> {this.state.s12q7 === true ? 'Agree' : null}</h5>
                      {/* -----------12.b5 -8---------- */}
                      {/* <label
                        htmlFor="internship-s12-qb5"
                        className="font-weight-bold text-justify"
                      >B.5 Minimum GPA of 3.0 is required, even though intern selection is based on student interest and relevant experience, and NOT the highest GPA.
                      </label>
                      <h5 className="ans-text"> {this.state.s12q8 === true ? 'Agree' : null}</h5> */}
                      {/* -----------12.c1 -9---------- */}
                      <label
                        htmlFor="internship-s12-qc1"
                        className="font-weight-bold text-justify"
                      >C.1 Participate in locak interns training workshops.
                      </label>
                      <h5 className="ans-text"> {this.state.s12q9 === true ? 'Agree' : null}</h5>
                      {/* -----------12.c2 -10---------- */}
                      <label
                        htmlFor="internship-s12-qc2"
                        className="font-weight-bold text-justify"
                      >C.2 End-of-program online interns reflections and check-in with Intern Trainer.
                      </label>
                      <h5 className="ans-text"> {this.state.s12q10 === true ? 'Agree' : null}</h5>
                      {/* -----------12.c3 ----------- */}
                      <label
                        htmlFor="internship-s12-qc3"
                        className="font-weight-bold text-justify"
                      >C.3 Participate in graduation celebration.
                      </label>
                      <h5 className="ans-text"> {this.state.s12q11 === true ? 'Agree' : null}</h5>
                    </div>
                  </div>
                  {/* ----------- 13. Certification ----------- */}
                  <div className="section13">
                    <div className="pt-2 pb-2 mt-4">                    
                    <h3>Certification</h3>
                    </div>
                    <div className="pt-4 text-left">
                      <label
                        htmlFor="internship-s13-q1"
                        className="font-weight-bold"
                      >
                        <span className="redColor">* </span>I understand that an offer of grant funding by CLUSA is contingent upon the applicant organization’s agreement to terms in the grant contract. I also agree to hold CLUSA, its agents and employees, harmless from any and all liabilities for claims which may arise out of, or occur in connection with CLUSA’s grants, if any, to the application organization. By typing your name below, it serves as your signature to certify the above.
                      </label>
                      {/* ----------- 13.1 ----------- */}
                      <label
                        htmlFor="internship-s13-q1"
                        className="font-weight-bold text-justify pt-4"
                      >
                        <span className="redColor">* </span>Full Name
                      </label>
                      <h5 className="ans-text"> {this.state.s13q1}</h5>
                      {/* ----------- 13.2 ----------- */}
                      <label
                        htmlFor="internship-s13-q2"
                        className="font-weight-bold text-justify pt-3"
                      >
                        <span className="redColor">* </span>Position
                      </label>
                      <h5 className="ans-text"> {this.state.s13q2}</h5>
                      {/* ----------- 13.3email ----------- */}
                      <label
                        htmlFor="internship-s13-email"
                        className="font-weight-bold text-justify pt-3"
                      >
                        <span className="redColor">* </span>Email
                      </label>
                      <h5 className="ans-text"> {this.state.s13email}</h5>
                      {/* ----------- 13phone ----------- */}
                      <label
                        htmlFor="internship-s13-phone"
                        className="font-weight-bold text-justify pt-3"
                      >
                        <span className="redColor">* </span>Phone Number
                      </label>
                      <h5 className="ans-text"> {this.state.s13phone}</h5>
                      {/* ----------- 13.3 ----------- */}
                      <label
                        htmlFor="internship-s13-q3"
                        className="font-weight-bold text-justify pt-3"
                      >
                        <span className="redColor">* </span>Date
                      </label>
                      <h5 className="ans-text"> {this.state.s13q3}</h5>
                    </div>
                  </div>
                  </div>
                  {fixFooter && fixFooter}
                </MDBCardBody>
                
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
}

export default WholeApplicationCommentView;
