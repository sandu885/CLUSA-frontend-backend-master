/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */

/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBTooltip, MDBIcon, MDBNotification } from 'mdbreact';
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


class Section12 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      s12q1: false,
      s12q2: false,
      s12q3: false,
      s12q4: false,
      s12q5: false,
      s12q6: false,
      s12q7: false,
      s12q8: true,
      s12q9: false,
      s12q10: false,
      s12q11: false,
      // s12q1: false,
      // s12q2: false,
      // s12q3: false,
      // s12q4: false,
      // s12q5: false,
      // s12q6: false,
      // s12q7: false,
      // s12q8: false,
      // s12q9: false,
      // s12q10: false,
      // s12q11: false,
      // s12q1: null,
      // s12q2: null,
      // s12q3: null,
      // s12q4: null,
      // s12q5: null,
      // s12q6: null,
      // s12q7: null,
      // s12q8: null,
      // s12q9: null,
      // s12q10: null,
      // s12q11: null,
      // db data for previous submit ===========
      // getS12q1: null,
      // getS12q2: null,
      // getS12q3: null,
      // getS12q4: null,
      // getS12q5: null,
      // getS12q6: null,
      // getS12q7: null,
      // getS12q8: null,
      // getS12q9: null,
      // getS12q10: null,
      // getS12q11: null,
      responseMessage: '',
      // save status ===========
      saveSuccess: false,
      // local storage ==========
      sessionToken: localStorage.getItem('sessionToken'),
      userName: localStorage.getItem('userName'),
      shouldRedirectToNext: false,
      shouldRedirectToPrevious: false,
      redirectToLogin: false,
      // disable save button after one click
      disableSaveButton: false,
    };
  }


  componentDidMount() {
    // get user input
    const getSectionInputAPI = '/api/getApplicationContentBySectionIndex';

    if (this.state.userName === null) {
      this.setState({
        logedin: false,
      });
      console.warn('section 12 logedin', this.state.logedin);
    } else {
      axios.post(
        getSectionInputAPI,
        { sessionToken: this.state.sessionToken,
          programType: '0',
          sectionIndex: '12' },
      ).then((response) => {
        if (response.data.message === 'Successfully get application content') {
          console.warn('section 12 get information successfully!', response.data.content);
          this.setState({
            s12q1: response.data.content[1],
            s12q2: response.data.content[2],
            s12q3: response.data.content[3],
            s12q4: response.data.content[4],
            s12q5: response.data.content[5],
            s12q6: response.data.content[6],
            s12q7: response.data.content[7],
            s12q8: response.data.content[8],
            s12q9: response.data.content[9],
            s12q10: response.data.content[10],
            s12q11: response.data.content[11],
          });
          console.warn('after response data =======', this.state);
        } else if (response.data.message === 'No saved application for this section') {
          console.warn('no saved history');
        } else {
          console.warn('section 12 Failed to save');
        }
        console.warn(response.data);
      }).catch((error) => {
        console.warn('section 12 error.response', error.response);
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

  getData = (key, defaultValue = '') => {
    const data = this.state.responseMessage;
    return data[key] || defaultValue;
  }

  toNextPage = () => {
    this.setState({
      shouldRedirectToNext: true,
    });
  }

  toPreviousPage = () => {
    this.setState({
      shouldRedirectToPrevious: true,
    });
  }

  clickSaveBtn = () => {
    const saveAPI = '/api/saveApplicationContent';
    const currentComponent = this;
    const formData = new FormData();
    formData.append('sessionToken', this.state.sessionToken);
    formData.append('programType', '0');
    formData.append('sectionIndex', '12');
    formData.append('sectionContent', JSON.stringify(
      { 1: this.state.s12q1,
        2: this.state.s12q2,
        3: this.state.s12q3,
        4: this.state.s12q4,
        5: this.state.s12q5,
        6: this.state.s12q6,
        7: this.state.s12q7,
        8: this.state.s12q8,
        9: this.state.s12q9,
        10: this.state.s12q10,
        11: this.state.s12q11 },
      // { 1: finalS12q1,
      //   2: finalS12q2,
      //   3: finalS12q3,
      //   4: finalS12q4,
      //   5: finalS12q5,
      //   6: finalS12q6,
      //   7: finalS12q7,
      //   8: finalS12q8,
      //   9: finalS12q9,
      //   10: finalS12q10,
      //   11: finalS12q11 },
    ));

    axios.post(
      saveAPI,
      formData,
    ).then((response) => {
      currentComponent.setState({
        responseMessage: response.data,
      });
      if (response.data.message === 'Successfully save section content') {
        this.setState({
          saveSuccess: true,
          // getS12q1: response.data.content['1'],
          disableSaveButton: true,
        });
        console.warn('getS12q1', response.data.content);
        document.getElementById('internship-s12').reset();
        window.location.reload();
      } else {
        console.warn('section 12 Failed to save');
        alert('section 12 Failed to save, please try again');
      }
      // console.warn(this.state.responseMessage);
    }).catch((error) => {
      console.warn('section 12 error.response', error.response);
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

  handleCheck = () => {
    this.setState({ checked: !this.state.checked });
  };

  render() {
    const { saveSuccess, redirectToLogin } = this.state;
    if (this.state.shouldRedirectToNext === true) return <Redirect to="/internship-application-section13" />;
    if (this.state.shouldRedirectToPrevious === true) return <Redirect to="/internship-application-section11" />;
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
                title="PART B: GRANT AFFIRMATIONS"
                message="Save Successfully."
                style={{
                  position: 'fixed',
                  top: '50%',
                  right: '40%',
                  zIndex: 9999,
                }}
              />
            </MDBContainer>
          ) : null}
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
                    <MDBCardBody className="mx-4 pb-50px">
                      <div className="text-left">
                        <MDBRow className="mbottom0Imp">
                          <MDBCol md="10">
                            <h3 className="dark-grey-text mb-2">
                              <strong>PART B: GRANT AFFIRMATIONS</strong>
                            </h3>
                          </MDBCol>
                          <MDBCol md="2">  <p className="redColor text-right">* Required</p></MDBCol>
                        </MDBRow>
                        <hr className="h4m0p10" />
                        <p className="text-justify lineHeight90">
                        By consenting to CLUSA internship grant criteria and requirements, your organization agrees to include them as part of your internship program process.
                        </p>
                      </div>
                      {/* ----------- main questions ----------- */}
                      <div className="text-left">
                        <form
                          id="internship-s12"
                          className="form-all"
                        >
                          {/* ----------- A ----------- */}
                          <label className="font-weight-bold">
                            A
                            <span className="redColor">* </span>CLUSA Internship Program Leaders need
                          </label>
                          <MDBRow className="greyBG pt-2 pb-2 align-middle">
                            <MDBCol md="10" />
                            <MDBCol md="2">
                              <h6>Agree</h6>
                            </MDBCol>
                            <hr />
                          </MDBRow>
                          {/* ----------- 12.A.1 ----------- */}

                          <MDBRow className="pt-2">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >A.1 Participate in grant informational Zoom-conference (12/14/2019 or 1/11/2020)
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q1radio"
                                  checked={this.state.s12q1}
                                  onChange={() => this.setState((prevState) => ({ s12q1: !prevState.s12q1 }))}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow>
                          {/* ----------- 12.A.2 ----------- */}
                          <MDBRow className="pt-2">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >A.2 Participate in all 4 Leaders Training Webinars (2/15/2020, 3/21/2020, 4/18/2020, 5/16/2020)
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q2radio"
                                  checked={this.state.s12q2}
                                  onChange={() => this.setState((prevState) => ({ s12q2: !prevState.s12q2 }))}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow>
                          {/* ----------- 12.A.3 ----------- */}
                          <MDBRow className="pt-2">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >A.3 Provide supporting documents and final reports on time
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q3radio"
                                  checked={this.state.s12q3}
                                  onChange={() => this.setState((prevState) => ({ s12q3: !prevState.s12q3 }))}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow>
                          <hr />
                          <label className="font-weight-bold">
                            B
                            <span className="redColor">* </span>Student Intern Selection. These criteria will be included in your organization’s student internship application, and are in addition to local criteria, if any, such as age, reference, stipend, etc
                          </label>
                          {/* ----------- 12.B.1  4----------- */}
                          <MDBRow className="pt-2">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >B.1 Student background including Name, Age(Specify age criteria), College/School, Current Class Level, Ethnicity, Gender, Email, Cell, Address
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q4radio"
                                  checked={this.state.s12q4}
                                  onChange={() => this.setState((prevState) => ({ s12q4: !prevState.s12q4 }))}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow>
                          {/* ----------- 12.B.2 5----------- */}
                          <MDBRow className="pt-4">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >B.2 Selection Critera One: Student intern expresses interest in exploring government, public sector careers, and elective office through written response.
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q5radio"
                                  checked={this.state.s12q5}
                                  onChange={() => this.setState((prevState) => ({ s12q5: !prevState.s12q5 }))}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow>
                          {/* ----------- 12.B.3 6----------- */}
                          <MDBRow className="pt-4">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >B.3 Selection Criteria Two: Student intern describes relevant experience such as Asian American studies, political science, and government classes, and campaign voluteering, voter registration, and public speaking experience, etc. through written response.
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q6radio"
                                  checked={this.state.s12q6}
                                  onChange={() => this.setState((prevState) => ({ s12q6: !prevState.s12q6 }))}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow>
                          {/* ----------- 12.B.4 7----------- */}
                          <MDBRow className="pt-4">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >B.4 Selection Criteria Three: Student intern shares about view of own ethnic identity and relate it to how government may play a role to address a social issue of concern.
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q7radio"
                                  value="true"
                                  checked={this.state.s12q7}
                                  onChange={() => this.setState((prevState) => ({ s12q7: !prevState.s12q7 }))}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow>
                          {/* ----------- 12.B.5 8----------- */}
                          {/* <MDBRow className="pt-4">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >B.5 Minimum GPA of 3.0 is required, even though intern selection is based on student interest and relevant experience, and NOT the highest GPA.
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q8radio"
                                  checked={this.state.s12q8}
                                  onChange={() => this.setState( prevState => { return {s12q8: !prevState.s12q8}})}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow> */}
                          <hr />
                          <label className="font-weight-bold">
                            C
                            <span className="redColor">* </span>Student Intern Requirements. These requirements will be included in your student internship application in addition to any local requirements such as intern hours, etc.
                          </label>
                          {/* ----------- 12.C.1 9----------- */}
                          <MDBRow className="pt-2">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >C.1 Participate in interns training workshops.
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q9radio"
                                  checked={this.state.s12q9}
                                  onChange={() => this.setState((prevState) => ({ s12q9: !prevState.s12q9 }))}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow>
                          {/* ----------- 12.C.2 10----------- */}
                          <MDBRow className="pt-2">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >C.2 Check-in with Internship Trainers during internship and submit End-of-program online interns reflections.
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q10radio"
                                  checked={this.state.s12q10}
                                  onChange={() => this.setState((prevState) => ({ s12q10: !prevState.s12q10 }))}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow>
                          {/* ----------- 12.C.3 11----------- */}
                          <MDBRow className="pt-2">
                            <MDBCol
                              md="10"
                              className="text-justify"
                            >C.3 Participate in graduation ceremony.
                            </MDBCol>
                            <MDBCol md="2">
                              <label className="radio-inline">
                                <input
                                  type="checkbox"
                                  name="s12q11radio"
                                  checked={this.state.s12q11}
                                  onChange={() => this.setState((prevState) => ({ s12q11: !prevState.s12q11 }))}
                                />
                              </label>
                            </MDBCol>
                          </MDBRow>
                          {/* ---------------------- result ---------------------- */}
                        </form>
                      </div>

                      {/* ----------- button group ----------- */}
                      <div className="text-center mb-3 mt-5">
                        <MDBRow>
                          {/*  ----------- previous button  ----------- */}
                          <MDBCol
                            md="2"
                            className="text-center"
                          >
                            <div style={{ display: 'flex' }}>
                              <MDBTooltip
                                placement="top"
                              >
                                <MDBBtn
                                  onClick={this.toPreviousPage}
                                  color="light-blue"
                                  rounded
                                  className="btn-block z-depth-1a"
                                >
                                  <MDBIcon
                                    icon="angle-double-left"
                                  />
                                </MDBBtn>
                                <div>
                                Previous
                                </div>
                              </MDBTooltip>
                            </div>
                          </MDBCol>

                          {/*  ----------- save button  ----------- */}
                          <MDBCol
                            md="8"
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

export default Section12;
