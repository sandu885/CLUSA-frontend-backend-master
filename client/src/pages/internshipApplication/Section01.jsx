/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */

/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBIcon, MDBTooltip, MDBNotification } from 'mdbreact';
import axios from 'axios';
import { Redirect } from 'react-router';

import '../style.css';
import './internshipApplication.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import SidebarComponent from './Sidebar';

class Section01 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // s1q1 section showing status
      showingS1q1YesSubQuestion: false,
      showingS1q1NoSubQuestion: false,
      showingCompleteYear: false,
      //
      s1q101: '',
      s1q102: '',
      s1q103: '',
      s1q1AppliedYear: '',
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
      s1qCheck: false,

      responseMessage: '',
      // save status ===========
      saveSuccess: false,
      // local storage ==========
      sessionToken: localStorage.getItem('sessionToken'),
      userName: localStorage.getItem('userName'),
      shouldRedirectToNext: false,
      redirectToLogin: false,
      // disable save button after one click
      disableSaveButton: false,
    };
  }

  componentDidMount() {
    console.warn('all ===============', this.state);
    // get user input
    const getSectionInputAPI = '/api/getApplicationContentBySectionIndex';

    if (this.state.userName === undefined || this.state.userName === null) {
      this.setState({
        logedin: false,
      });
      console.warn('section 1 logedin', this.state.logedin);
    } else {
      axios.post(
        getSectionInputAPI,
        { sessionToken: this.state.sessionToken,
          programType: '0',
          sectionIndex: '1' },
      ).then((response) => {
        if (response.data.message === 'Successfully get application content') {
          console.warn('section 1 get information successfully!', response.data);
          this.setState({
            s1q101: response.data.content[1].appliedBefore,
            s1q102: response.data.content[1].programs[0].granted,
            s1q1AppliedYear: response.data.content[1].programs[0].startYear,
            s1q101NoDetail: response.data.content[1].programs[0].summary,
            s1q2: response.data.content['2'],
            s1q3: response.data.content['3'],
            s1q4: response.data.content['4'],
            s1q5: response.data.content['5'],
            s1q6: response.data.content['6'],
            s1q7: response.data.content['7'],
            s1q8: response.data.content['8'],
            s1q9: response.data.content['9'],
            s1q10: response.data.content['10'],
            s1q11: response.data.content['11'],
            s1qCheck: response.data.content['12'],
            // s1q103: undefined,
          });
          if(this.state.s1q101 === 'Yes') this.setState({ showingS1q1YesSubQuestion: true, showingS1q1NoSubQuestion: false });
          if(this.state.s1q101 === 'No') this.setState({ showingS1q1YesSubQuestion: false, showingS1q1NoSubQuestion: true });
          console.warn('S1qCheck', this.state.s1qCheck);
        } else if (response.data.message === 'No saved application for this section') {
          console.warn('no saved history');
        } else {
          console.warn('section 1 Failed to get');
        }
        console.warn(response.data);
      }).catch((error) => {
        console.warn('section 1 error.response', error.response);
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
      });
    }
  }

  toNextPage = () => {
    this.setState({
      shouldRedirectToNext: true,
    });
  }

  clickSaveBtn = () => {
    const saveAPI = '/api/saveApplicationContent';
    const currentComponent = this;
    console.warn('q2 state', this.state.s1q2);

    const formData = new FormData();
    formData.append('sessionToken', this.state.sessionToken);
    formData.append('programType', '0');
    formData.append('sectionIndex', '1');
    formData.append('sectionContent', JSON.stringify(
      { 1: { appliedBefore: this.state.s1q101,
        programs: [{ granted: this.state.s1q102, startYear: this.state.s1q1AppliedYear, summary: this.state.s1q101NoDetail }] },
      2: this.state.s1q2,
      3: this.state.s1q3,
      4: this.state.s1q4,
      5: this.state.s1q5,
      6: this.state.s1q6,
      7: this.state.s1q7,
      8: this.state.s1q8,
      9: this.state.s1q9,
      10: this.state.s1q10,
      11: this.state.s1q11,
      12: this.state.s1qCheck,
      },
    ));

    axios.post(
      saveAPI,
      formData,
    ).then((response) => {
      currentComponent.setState({
        responseMessage: response.data,
      });
      console.warn('response =======', response.data);
      if (response.data.message === 'Successfully save section content' || response.data.message === 'You can not leave required field blank' ) {
        if(response.data.message === 'You can not leave required field blank') {
          alert('This is a required field, you can’t leave this field blank. Please check and try again.');
          this.setState({saveSuccess: false})
        }
        console.warn('disableSaveButton', this.state.disableSaveButton);
        this.setState({
            s1q101: response.data.content[1].appliedBefore,
            s1q102: response.data.content[1].programs[0].granted,
            s1q1AppliedYear: response.data.content[1].programs[0].startYear,
            s1q101NoDetail: response.data.content[1].programs[0].summary,
            s1q2: response.data.content['2'],
            s1q3: response.data.content['3'],
            s1q4: response.data.content['4'],
            s1q5: response.data.content['5'],
            s1q6: response.data.content['6'],
            s1q7: response.data.content['7'],
            s1q8: response.data.content['8'],
            s1q9: response.data.content['9'],
            s1q10: response.data.content['10'],
            s1q11: response.data.content['11'],
            s1qCheck: response.data.content['12'],
        })
        if(response.data.message === 'Successfully save section content') this.setState({saveSuccess: true})
        document.getElementById('internship-s1').reset();
        window.location.reload();
      } else {
        console.warn('section 1 Failed to save');
        alert('section 1 Failed to save, please try again');
      }
      // console.warn(this.state.responseMessage);
    }).catch((error) => {
      console.warn('section 1 error.response', error.response);
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
    });
  }

  render() {
    const { showingS1q1NoSubQuestion } = this.state;
    const { saveSuccess, redirectToLogin } = this.state;
    if (this.state.shouldRedirectToNext === true) return <Redirect to="/internship-application-section02" />;
    if (redirectToLogin === true) return <Redirect to="/login" />;

    return (
      <div className="bg-lightcolor">
        <div>
          { saveSuccess ? (
            <MDBContainer className="grey darken-3 p-3">
              <MDBNotification
                show
                fade
                autohide={5000} // by default = ∞ ms
                bodyClassName="p-5 font-weight-bold"
                iconClassName="text-primary"
                title="SECTION 1: Internship Program Overview"
                message="Save Successfully."
                style={{
                  position: 'fixed',
                  top: '50%',
                  right: '40%',
                  zIndex: 9999,
                }}
              />
            </MDBContainer>
          ) : undefined }
        </div>
        <HeaderComponent />
        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            {/* ----------- left navigation ----------- */}
            <MDBCol md="3">
              <div className="text-center mb-4 sticky-div">
                <SidebarComponent />
              </div>
            </MDBCol>
            {/* ----------- right main info section ----------- */}
            <MDBCol md="9">
              <MDBRow>
                <MDBCol
                  md="12"
                  className="text-center"
                >
                  <MDBCard>
                    <MDBCardBody className="mx-4">
                      <div className="text-left">
                        <h3 className="dark-grey-text mb-2">
                          <strong>PART A: Program Information</strong>
                        </h3>
                        <MDBRow className="mbottom0Imp">
                          <MDBCol md="10">
                            <h5>
                              <strong>SECTION 1: Internship Program Overview</strong>
                            </h5>
                          </MDBCol>
                          <MDBCol md="2">  <p className="redColor text-right">* Required</p></MDBCol>
                        </MDBRow>
                        <hr className="h4m0p10" />
                        <label
                          htmlFor="s1q0Read"
                          className="text-justify lineHeight90"
                        >
                          <input
                            id="s1q0Read"
                            type="checkbox"
                            checked={this.state.s1qCheck}
                            onChange={() => this.setState((prevState) => ({ s1qCheck: !prevState.s1qCheck }))}
                          /> By ticking this box, I have read the grant instructions found on the
                        immediate login portal and fully assume the responsibility of
                        fulfilling the requirements as dictated.
                        </label>
                      </div>
                      {/* ----------- main questions ----------- */}
                      <div className="text-left">
                        <form
                          id="internship-s1"
                          className="form-all"
                        >
                          {/* ----------- 1.1: has applied before ? ----------- */}
                          <label className="font-weight-bold">
                            1.1.
                            <span className="redColor">* </span>Has your organization
                            applied for the CLUSA Internship grant before?
                          </label>
                          <div>
                            <MDBRow className="dark-grey-text font-weight-light pt-1">
                              <MDBCol>
                                {/* Group of radios - option 1 Yes */}
                                <div className="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    className="custom-control-input"
                                    id="defaultGroupExample1"
                                    name="groupOfDefaultRadios"
                                    checked={this.state.s1q101 === 'Yes'}
                                    onChange={() => this.setState({
                                      s1q101: 'Yes',
                                      showingS1q1YesSubQuestion: true,
                                      showingS1q1NoSubQuestion: false,
                                      s1q101NoDetail: '',
                                    })}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="defaultGroupExample1"
                                  >
                                    Yes
                                  </label>
                                </div>
                                <div className="sub1 granted">
                                  {
                                  this.state.showingS1q1YesSubQuestion === true ? (
                                    <div className="ml-5 pt-2">
                                      <MDBRow>
                                        <label
                                          htmlFor="s1q102"
                                        > Applied Year:&nbsp;&nbsp;
                                          <input
                                            id="s1q102"
                                            type="number"
                                            maxLength="4"
                                            value={this.state.s1q1AppliedYear}
                                            onChange={(e) => this.setState({ s1q1AppliedYear: e.target.value })}
                                          />
                                        </label>
                                      </MDBRow>
                                      {/* ============ sub1 group 1============= */}
                                      <div className="custom-control custom-radio ml-3">
                                        <input
                                          type="radio"
                                          className="custom-control-input mt-2"
                                          id="defaultGroupExample1-1"
                                          name="groupOfDefaultRadios1-1"
                                          checked={this.state.s1q102 === 'Yes'}
                                          onClick={() => this.setState({
                                            showingS1q1YesSubQuestion: true,
                                            // showingS1q1GrantedubQuestion: true,
                                            showingS1q1NoSubQuestion: false,
                                            s1q102: 'Yes',
                                            s1q101: 'Yes',
                                            s1q101NoDetail: '',
                                          })}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="defaultGroupExample1-1"
                                        >
                                          Granted
                                        </label>
                                      </div>
                                      {/* ============ sub1 group 2============= */}
                                      <div className="custom-control custom-radio ml-3">
                                        <input
                                          type="radio"
                                          className="custom-control-input"
                                          id="defaultGroupExample1-2"
                                          name="groupOfDefaultRadios1-1"
                                          checked={this.state.s1q102 === 'No'}
                                          onClick={() => this.setState({
                                            showingS1q1YesSubQuestion: true,
                                            // showingS1q1GrantedubQuestion: false,
                                            showingS1q1NoSubQuestion: false,
                                            s1q102: 'No',
                                            s1q101: 'Yes',
                                            s1q101NoDetail: '',
                                          })}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="defaultGroupExample1-2"
                                        >
                                        Not Granted
                                        </label>
                                      </div>
                                    </div>
                                  ) : null }
                                </div>

                                {/* Group of radios - option 2 No */}
                                <div className="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    className="custom-control-input"
                                    id="defaultGroupExample2"
                                    name="groupOfDefaultRadios"
                                    checked={this.state.s1q101 === 'No'}
                                    onChange={() => (this.setState({
                                      s1q101: 'No',
                                      showingS1q1NoSubQuestion: true,
                                      showingS1q1YesSubQuestion: false,
                                      // showingS1q1GrantedubQuestion: false,
                                      s1q102: 'No',
                                      s1q1AppliedYear: '',
                                    }))}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="defaultGroupExample2"
                                  >
                                    No
                                  </label>
                                </div>
                                {showingS1q1NoSubQuestion || (this.state.s1q101 === 'No') ? (
                                  <div className="pl-4 text-justify lineHeight90 font-weight-bold s1q1 pt-2 pr-4">
                                    <p>
                                      If No, please fill one page of executive summary of your proposed Internship program and request amount (range of grant is from $2,000 to 10,000 with at least 50% matching requirement).
                                    </p>
                                    <p>
                                      In order to provide grant funding, we require supporting documentation. Please follow the instructions below to give yourself sufficient time to prepare; you will need to periodically provide reports prior to disbursement of interval grant allocations. Final reports are due in 30 days after the end of your program. If you require more time, you may contact us to be granted an extension on a case-by-case basis.
                                    </p>
                                    <label
                                      htmlFor="internship-s1-q1-no"
                                      className="dark-grey-text font-weight-light"
                                    />
                                    <textarea
                                      id="internship-s1-q1-no"
                                      className="form-control"
                                      rows="4"
                                      maxLength="500"
                                      placeholder="500 max characters"
                                      value={this.state.s1q101NoDetail}
                                      onChange={(e) => this.setState({
                                        s1q101NoDetail: e.target.value,
                                        showingS1q1YesSubQuestion: false,
                                        showingS1q1NoSubQuestion: true,
                                        s1q101: 'No',
                                        s1q102: undefined,
                                      })}
                                    />
                                  </div>
                                ) : null}
                              </MDBCol>
                            </MDBRow>
                          </div>
                          {/* ----------- 1.2 years benn active ----------- */}
                          <label
                            htmlFor="internship-s1-q2"
                            className="font-weight-bold pt-3"
                          >
                            1.2.<span className="redColor">* </span>How many years has your
                            organization’s internship program been active?
                            <input
                              type="text"
                              id="internship-s1-q2"
                              className="form-control mt-2"
                              value={this.state.s1q2}
                              onChange={(e) => this.setState({ s1q2: e.target.value })}
                            />
                          </label>
                          {/* ----------- 1.3 term design ----------- */}
                          <label className="font-weight-bold pt-3">
                            1.3.
                            <span className="redColor">* </span>For what terms is your
                            internship program designed for?
                          </label>
                          <div>
                            <MDBRow className="dark-grey-text font-weight-light pt-1">
                              <MDBCol>
                                {/* Group of radios - option 1 summer */}
                                <div className="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    className="custom-control-input"
                                    id="internship-s1-q3-summer"
                                    name="groupOfInternshipS1Q3"
                                    value="0"
                                    checked={this.state.s1q3 === '0'}
                                    onChange={(e) => this.setState({ s1q3: e.target.value })}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="internship-s1-q3-summer"
                                  >
                                    Summer
                                  </label>
                                </div>

                                {/* Group of radios - option 2 all year round */}
                                <div className="custom-control custom-radio">
                                  <input
                                    type="radio"
                                    className="custom-control-input"
                                    id="internship-s1-q3-year"
                                    name="groupOfInternshipS1Q3"
                                    value="1"
                                    checked={this.state.s1q3 === '1'}
                                    onChange={(e) => this.setState({ s1q3: e.target.value })}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="internship-s1-q3-year"
                                  >
                                    Year Round
                                  </label>
                                </div>
                              </MDBCol>
                            </MDBRow>
                          </div>
                          {/* ----------- 1.4 following questions ----------- */}
                          <div>
                            <label
                              htmlFor="internship-s1-q4"
                              className="font-weight-bold pt-3"
                            >
                            1.4.<span className="redColor">* </span>Please fill out the
                            following as accurately as possible to the following scale:
                            </label>
                            <MDBRow className="greyBG pt-2 pb-2 align-middle">
                              <MDBCol md="3" />
                              <MDBCol md="2">
                                <h6>Would Appreciate Help</h6>
                              </MDBCol>
                              <MDBCol md="2">
                                <h6>Learning/   Getting There</h6>
                              </MDBCol>
                              <MDBCol md="2">
                                <h6>Proficient</h6>
                              </MDBCol>
                              <MDBCol md="2">
                                <h6>Experienced</h6>
                              </MDBCol>
                              <MDBCol md="1">
                                <h6>N/A</h6>
                              </MDBCol>
                              <hr />
                            </MDBRow>
                            <hr />
                            {/* ----------- 1.4.1 -4---------- */}
                            <MDBRow className="pt-2">
                              <MDBCol md="3">Internship Placement</MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q141radio"
                                    value="0"
                                    checked={this.state.s1q4 === '0'}
                                    onChange={() => this.setState({ s1q4: '0' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q141radio"
                                    value="Learning/Getting Here"
                                    checked={this.state.s1q4 === '1'}
                                    onChange={() => this.setState({ s1q4: '1' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q141radio"
                                    value="Proficient"
                                    checked={this.state.s1q4 === '2'}
                                    onChange={() => this.setState({ s1q4: '2'})}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q141radio"
                                    value="Experienced"
                                    checked={this.state.s1q4 === '3'}
                                    onChange={() => this.setState({ s1q4: '3' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="1">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q141radio"
                                    value="n/a"
                                    checked={this.state.s1q4 === '4'}
                                    onChange={() => this.setState({ s1q4: '4' })}
                                  />
                                </label>
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            {/* ----------- 1.4.2 -5---------- */}
                            <MDBRow className="pt-2">
                              <MDBCol md="3">
                              Recruiting Passionate And high-Quality Students
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q142radio"
                                    value="Would Appreciate Help"
                                    checked={this.state.s1q5 === '0'}
                                    onChange={() => this.setState({ s1q5: '0'})}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q142radio"
                                    value="Learning/Getting Here"
                                    checked={this.state.s1q5 === '1'}
                                    onChange={() => this.setState({ s1q5: '1'})}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q142radio"
                                    value="Proficient"
                                    checked={this.state.s1q5 === '2'}
                                    onChange={() => this.setState({ s1q5: '2' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q142radio"
                                    value="Experienced"
                                    checked={this.state.s1q5 === '3'}
                                    onChange={() => this.setState({ s1q5: '3' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="1">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q142radio"
                                    value="n/a"
                                    checked={this.state.s1q5 === '4'}
                                    onChange={() => this.setState({ s1q5: '4' })}
                                  />
                                </label>
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            {/* ----------- 1.4.3 -6---------- */}
                            <MDBRow className="pt-2">
                              <MDBCol md="3">Student Training</MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q143radio"
                                    value="Would Appreciate Help"
                                    checked={this.state.s1q6 === '0'}
                                    onChange={() => this.setState({ s1q6: '0' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q143radio"
                                    value="Learning/Getting Here"
                                    checked={this.state.s1q6 === '1'}
                                    onChange={() => this.setState({ s1q6: '1' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q143radio"
                                    value="Proficient"
                                    checked={this.state.s1q6 === '2'}
                                    onChange={() => this.setState({ s1q6: '2' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q143radio"
                                    value="Experienced"
                                    checked={this.state.s1q6 === '3'}
                                    onChange={() => this.setState({ s1q6: '3' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="1">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q143radio"
                                    value="n/a"
                                    checked={this.state.s1q6 === '4'}
                                    onChange={() => this.setState({ s1q6: '4' })}
                                  />
                                </label>
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            {/* ----------- 1.4.4 -7---------- */}
                            <MDBRow className="pt-2">
                              <MDBCol md="3">Student Support During The Internship</MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q144radio"
                                    value="Would Appreciate Help"
                                    checked={this.state.s1q7 === '0'}
                                    onChange={() => this.setState({ s1q7: '0' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q144radio"
                                    value="Learning/Getting Here"
                                    checked={this.state.s1q7 === '1'}
                                    onChange={() => this.setState({ s1q7: '1' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q144radio"
                                    value="Proficient"
                                    checked={this.state.s1q7 === '2'}
                                    onChange={() => this.setState({ s1q7: '2' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q144radio"
                                    value="Experienced"
                                    checked={this.state.s1q7 === '3'}
                                    onChange={() => this.setState({ s1q7: '3' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="1">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q144radio"
                                    value="n/a"
                                    checked={this.state.s1q7 === '4'}
                                    onChange={() => this.setState({ s1q7: '4' })}
                                  />
                                </label>
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            {/* ----------- 1.4.5 -8---------- */}
                            <MDBRow className="pt-2">
                              <MDBCol md="3">Following Up On Students</MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q145radio"
                                    value="Would Appreciate Help"
                                    checked={this.state.s1q8 === '0'}
                                    onChange={() => this.setState({ s1q8: '0' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q145radio"
                                    value="Learning/Getting Here"
                                    checked={this.state.s1q8 === '1'}
                                    onChange={() => this.setState({ s1q8: '1' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q145radio"
                                    value="Proficient"
                                    checked={this.state.s1q8 === '2'}
                                    onChange={() => this.setState({ s1q8: '2' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q145radio"
                                    value="Experienced"
                                    checked={this.state.s1q8 === '3'}
                                    onChange={() => this.setState({ s1q8: '3' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="1">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q145radio"
                                    value="n/a"
                                    checked={this.state.s1q8 === '4'}
                                    onChange={() => this.setState({ s1q8: '4' })}
                                  />
                                </label>
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            {/* ----------- 1.4.6 -9---------- */}
                            <MDBRow className="pt-2">
                              <MDBCol md="3">Community Building Including Voter Registration, Census, Government Training, etc.</MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q146radio"
                                    value="Would Appreciate Help"
                                    checked={this.state.s1q9 === '0'}
                                    onChange={() => this.setState({ s1q9: '0' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q146radio"
                                    value="Learning/Getting Here"
                                    checked={this.state.s1q9 === '1'}
                                    onChange={() => this.setState({ s1q9: '1' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q146radio"
                                    value="Proficient"
                                    checked={this.state.s1q9 === '2'}
                                    onChange={() => this.setState({ s1q9: '2' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q146radio"
                                    value="Experienced"
                                    checked={this.state.s1q9 === '3'}
                                    onChange={() => this.setState({ s1q9: '3' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="1">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q146radio"
                                    value="n/a"
                                    checked={this.state.s1q9 === '4'}
                                    onChange={() => this.setState({ s1q9: '4' })}
                                  />
                                </label>
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            {/* ----------- 1.4.7 ----------- */}
                            <MDBRow className="pt-2">
                              <MDBCol md="3">Fundraising</MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q147radio"
                                    value="Would Appreciate Help"
                                    checked={this.state.s1q10 === '0'}
                                    onChange={() => this.setState({ s1q10: '0' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q147radio"
                                    value="Learning/Getting Here"
                                    checked={this.state.s1q10 === '1'}
                                    onChange={() => this.setState({ s1q10: '1' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q147radio"
                                    value="Proficient"
                                    checked={this.state.s1q10 === '2'}
                                    onChange={() => this.setState({ s1q10: '2'})}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q147radio"
                                    value="Experienced"
                                    checked={this.state.s1q10 === '3'}
                                    onChange={() => this.setState({ s1q10: '3'})}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="1">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q147radio"
                                    value="n/a"
                                    checked={this.state.s1q10 === '4'}
                                    onChange={() => this.setState({ s1q10: '4' })}
                                  />
                                </label>
                              </MDBCol>
                            </MDBRow>
                            <hr />
                            {/* ----------- 1.4.8 ----------- */}
                            <MDBRow className="pt-2">
                              <MDBCol md="3">Building A Pipeline Of APIA In Public Service To Elected Office</MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q148radio"
                                    value="Would Appreciate Help"
                                    checked={this.state.s1q11 === '0'}
                                    onChange={() => this.setState({ s1q11: '0' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q148radio"
                                    value="Learning/Getting Here"
                                    checked={this.state.s1q11 === '1'}
                                    onChange={() => this.setState({ s1q11: '1'})}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q148radio"
                                    value="Proficient"
                                    checked={this.state.s1q11 === '2'}
                                    onChange={() => this.setState({ s1q11: '2'})}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="2">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q148radio"
                                    value="Experienced"
                                    checked={this.state.s1q11 === '3'}
                                    onChange={() => this.setState({ s1q11: '3' })}
                                  />
                                </label>
                              </MDBCol>
                              <MDBCol md="1">
                                <label className="radio-inline">
                                  <input
                                    type="radio"
                                    name="q148radio"
                                    value="n/a"
                                    checked={this.state.s1q11 === '4'}
                                    onChange={() => this.setState({ s1q11: '4'})}
                                  />
                                </label>
                              </MDBCol>
                            </MDBRow>
                          </div>
                        </form>
                      </div>

                      {/* ----------- button group ----------- */}
                      <div className="text-center mb-3 mt-5">
                        <MDBRow>
                          {/*  ----------- cancel button  ----------- */}
                          <MDBCol
                            md="5"
                            className="text-center"
                          >
                            <div style={{ display: 'flex' }}>
                              <MDBTooltip
                                placement="top"
                              >
                                <MDBBtn
                                  href="/internship-information/"
                                  color="light-blue"
                                  rounded
                                  className="btn-block z-depth-1a"
                                >
                                  <MDBIcon
                                    icon="angle-double-left"
                                    className="pr-3"
                                  />
                                  To Information page
                                </MDBBtn>
                                <div>
                                Back to information page
                                </div>
                              </MDBTooltip>
                            </div>
                          </MDBCol>

                          {/*  ----------- save button  ----------- */}
                          <MDBCol
                            md="5"
                            className="text-center"
                          >
                            <MDBBtn
                              gradient="aqua"
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.clickSaveBtn}
                              disabled={this.state.disableSaveButton}
                            >
                              <MDBIcon
                                icon="save"
                                className="pr-3"
                              />
                              Save
                            </MDBBtn>
                          </MDBCol>
                          {/*  ----------- next button  ----------- */}
                          <MDBCol
                            md="2"
                            className="text-center"
                          >
                            <div style={{ display: 'flex' }}>
                              <MDBTooltip
                                placement="top"
                                tag="span"
                              >
                                <MDBBtn
                                  onClick={this.toNextPage}
                                  color="cyan"
                                  rounded
                                  className="btn-block z-depth-1a"
                                >
                                  <MDBIcon
                                    icon="angle-double-right"
                                  />
                                </MDBBtn>
                                <div>
                                Note: Please click SAVE first! Otherwise you will lose all the data history that you have filled on this page.
                                </div>
                              </MDBTooltip>
                            </div>
                          </MDBCol>
                        </MDBRow>
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <FooterComponent />
      </div>
    );
  }
}

export default Section01;
