import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBRow, MDBCol, MDBCard
} from 'mdbreact';
import axios from 'axios';
import { cloneDeep } from 'lodash';

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
    if (!queryData.orgId && !queryData.programId) {
      alert('Not having proper data to access this route');
      history.goBack();
    }
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
    const emailReg = /\S+@\S+\.\S+/;
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

  render() {
    const { formData: { q1 = {}, q2 = {}, q3 = {}, fileLink } } = this.state;
    const { fixFooter } = this.props;

    return (
      <div className="bg-withImage">
        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBRow className="text-center p-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    Final Report View
                  </MDBCol>
                </MDBRow>
                <MDBCardBody className="comment-card-body">
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
                          <a href={`/${fileLink.path}`} className="ml-4" rel="noopener noreferrer" target="_blank">Click to download Expense Template</a>
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
                {fixFooter && fixFooter}

                <br />
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>


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

        // if (response.data.finalReport.isSubmitted) {
          // thi
          this.setState({
            formData: cloneDeep(formData),
          });
        // }

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
