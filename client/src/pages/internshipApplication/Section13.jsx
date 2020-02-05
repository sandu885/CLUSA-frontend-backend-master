/* eslint-disable no-useless-escape */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
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


class Section13 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      s13q1: null,
      s13q2: null,
      s13q3: null,
      s13email: null,
      s13phone: null,
      // db data for previous submit ===========
      getS13q1: null,
      getS13q2: null,
      getS13q3: '',
      getS13email: null,
      getS13phone: null,
      responseMessage: '',
      // save status ===========
      saveSuccess: false,
      // local storage ==========
      sessionToken: localStorage.getItem('sessionToken'),
      userName: localStorage.getItem('userName'),
      shouldRedirectToNext: false,
      shouldRedirectToPrevious: false,
      // disable save button after one click
      disableSaveButton: false,
      // redirect to submit review
      redirectToApplicationHistory: false,
      redirectToLogin: false,
    };
  }

  componentDidMount() {
    // get user input
    const getSectionInputAPI = '/api/getApplicationContentBySectionIndex';

    if (this.state.userName === null) {
      this.setState({
        logedin: false,
      });
      console.warn('section 13 logedin', this.state.logedin);
    } else {
      axios.post(
        getSectionInputAPI,
        { sessionToken: this.state.sessionToken,
          programType: '0',
          sectionIndex: '13' },
      ).then((response) => {
        if (response.data.message === 'Successfully get application content') {
          console.warn('section 13 get information successfully!', response.data);
          this.setState({
            getS13q1: response.data.content[1],
            getS13q2: response.data.content[2],
            getS13q3: response.data.content[3],
            getS13email: response.data.content[4],
            getS13phone: response.data.content[5],
          });
        } else if (response.data.message === 'No saved application for this section') {
          console.warn('no saved history');
        } else {
          console.warn('section 13 Failed to save');
        }
        console.warn(response.data);
      }).catch((error) => {
        console.warn('section 13 error.response', error.response);
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

  validateEmail = (email) => {
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }

  validPhoneNumber = (phone) => {
    const isphone = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(phone);
    return isphone;
  }

  clickSaveBtn = () => {
    const saveAPI = '/api/saveApplicationContent';
    const currentComponent = this;
    console.warn('============== section 13 save data', this.state);
    const finalS13q1 = this.state.s13q1 === null ? this.state.getS13q1 : this.state.s13q1;
    const finalS13q2 = this.state.s13q2 === null ? this.state.getS13q2 : this.state.s13q2;
    const finalS13q3 = this.state.s13q3 === null ? this.state.getS13q3 : this.state.s13q3;
    const finalS13email = this.state.s13email === null ? this.state.getS13email : this.state.s13email;
    const finalS13phone = this.state.s13phone === null ? this.state.getS13phone : this.state.s13phone;

    if (this.validateEmail(finalS13email) === false) {
      alert('Your email input is not a valid email address, please refill your email and save again');
      return;
    }
    if (this.validPhoneNumber(finalS13phone) === false) {
      alert('Your phone number input is not a valid phone number, please refill your phone number and save again');
      return;
    }

    const formData = new FormData();
    formData.append('sessionToken', this.state.sessionToken);
    formData.append('programType', '0');
    formData.append('sectionIndex', '13');
    formData.append('sectionContent', JSON.stringify(
      { 1: finalS13q1,
        2: finalS13q2,
        3: finalS13q3,
        4: finalS13email,
        5: finalS13phone },
    ));

    axios.post(
      saveAPI,
      formData,
    ).then((response) => {
      currentComponent.setState({
        responseMessage: response.data,
      });
      console.warn('response', response.data);
      if (response.data.message === 'Successfully save section content') {
        this.setState({
          saveSuccess: true,
          getS13q1: response.data.content['1'],
          disableSaveButton: true,
        });
        document.getElementById('internship-s13').reset();
        window.location.reload();
      } else {
        console.warn('section 13 Failed to save');
        alert('section 13 Failed to save, please try again');
      }
      // console.warn(this.state.responseMessage);
    }).catch((error) => {
      console.warn('section 13 error.response', error.response);
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

  clickSubmitBtn = () => {
    const submitAPI = ' /api/submitApplication';
    const currentComponent = this;
    console.warn('============== section 13 submit data', this.state);
    axios.post(
      submitAPI,
      { sessionToken: this.state.sessionToken,
        programType: '0' },
    ).then((response) => {
      currentComponent.setState({
        responseMessage: response.data,
      });
      console.warn('response', response.data);
      // submit success
      if (response.data.message === 'You have successfully submitted your application') {
        alert('You have successfully submitted your application');
        this.setState({
          redirectToApplicationHistory: true,
        });
      } else if (response.data.message === 'Application is not completed') {
        let unfinishList = 'Sorry, your application is not completed because of the following sections required field are not filled: ';
        console.warn('not complete');
        const unfinishedSections = Object.keys(response.data.incompleteSections);
        for (const i in unfinishedSections) {
          unfinishList += `Section ${unfinishedSections[i]}, `;
        }
        // if (response.data.incompleteSections[1].status === 'Not saved' || response.data.incompleteSections[1].status === 'Parts of the section are not completed') unfinishList += 'Section 1, ';
        // if (response.data.incompleteSections[2].status === 'Not saved') unfinishList += 'Section 2, ';
        // if (response.data.incompleteSections[3].status === 'Not saved') unfinishList += 'Section 3, ';
        // if (response.data.incompleteSections[4].status === 'Not saved') unfinishList += 'Section 4, ';
        // if (response.data.incompleteSections[5].status === 'Not saved') unfinishList += 'Section 5, ';
        // if (response.data.incompleteSections[6].status === 'Not saved') unfinishList += 'Section 6, ';
        // if (response.data.incompleteSections[7].status === 'Not saved') unfinishList += 'Section 7, ';
        // if (response.data.incompleteSections[8].status === 'Not saved') unfinishList += 'Section 8, ';
        // if (response.data.incompleteSections[9].status === 'Not saved') unfinishList += 'Section 9, ';
        // if (response.data.incompleteSections[10].status === 'Not saved') unfinishList += 'Section 10, ';
        // if (response.data.incompleteSections[11].status === 'Not saved') unfinishList += 'Section 11, ';
        // if (response.data.incompleteSections[12].status === 'Not saved') unfinishList += 'Grant Affirmations, ';
        // if (response.data.incompleteSections[13].status === 'Not saved') unfinishList += 'Certification, ';
        console.warn('didn finish =============', unfinishList);
        alert(unfinishList);
      } else {
        console.warn('section 13 Failed to save');
        alert('section 13 Failed to save, please try again');
      }
      // console.warn(this.state.responseMessage);
    }).catch((error) => {
      console.warn('section 13 error.response', error.response);
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
    const { saveSuccess, redirectToLogin } = this.state;
    if (this.state.shouldRedirectToPrevious === true) return <Redirect to="/internship-application-section12" />;
    if (this.state.redirectToApplicationHistory === true) return <Redirect to="/organization-application-information" />;
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
                title="Certification"
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
                    <MDBCardBody className="mx-4">
                      <div className="text-left">
                        <MDBRow className="mbottom0Imp">
                          <MDBCol md="10">
                            <h3>
                              <strong>Certification</strong>
                            </h3>
                          </MDBCol>
                          <MDBCol md="2">  <p className="redColor text-right">* Required</p></MDBCol>
                        </MDBRow>
                        <hr className="h4m0p10" />
                      </div>
                      {/* ----------- main questions ----------- */}
                      <div className="text-left">
                        <h6>I understand that an offer of grant funding by CLUSA is contingent upon the applicant organization’s agreement to terms in the grant contract. I also agree to hold CLUSA, its agents and employees, harmless from any and all liabilities for claims which may arise out of, or occur in connection with CLUSA’s grants, if any, to the application organization. By typing your name below, it serves as your signature to certify the above. </h6>
                        <form
                          id="internship-s13"
                          className="form-all"
                        >
                          {/* ----------- 13.1 ----------- */}
                          <label
                            htmlFor="internship-s13-q1"
                            className="font-weight-bold text-justify pt-4"
                          >
                            <span className="redColor">* </span>Full Name
                          </label>
                          <input
                            type="text"
                            id="internship-s13-q1"
                            className="form-control"
                            defaultValue={this.state.getS13q1}
                            onChange={(e) => this.setState({ s13q1: e.target.value })}
                          />

                          {/* ----------- 13.2 ----------- */}
                          <label
                            htmlFor="internship-s13-q2"
                            className="font-weight-bold text-justify pt-3"
                          >
                            <span className="redColor">* </span>Position
                          </label>
                          <input
                            type="text"
                            id="internship-s13-q2"
                            className="form-control"
                            defaultValue={this.state.getS13q2}
                            onChange={(e) => this.setState({ s13q2: e.target.value })}
                          />
                          {/* ----------- 13 email ----------- */}
                          <label
                            htmlFor="internship-s13-email"
                            className="font-weight-bold text-justify pt-3"
                          >
                            <span className="redColor">* </span>Email
                          </label>
                          <input
                            type="email"
                            id="internship-s13-email"
                            className="form-control"
                            defaultValue={this.state.getS13email}
                            onChange={(e) => this.setState({ s13email: e.target.value })}
                          />

                          {/* ----------- 13 phone ----------- */}
                          <label
                            htmlFor="internship-s13-phone"
                            className="font-weight-bold text-justify pt-3"
                          >
                            <span className="redColor">* </span>Phone Number
                          </label>
                          <input
                            type="tel"
                            id="internship-s13-phone"
                            className="form-control"
                            defaultValue={this.state.getS13phone}
                            placeholder="123-456-7890 or 1234567890 or (123)456-7890"
                            onChange={(e) => this.setState({ s13phone: e.target.value })}
                          />

                          {/* ----------- 13.3 ----------- */}
                          <label
                            htmlFor="internship-s13-q3"
                            className="font-weight-bold text-justify pt-3"
                          ><span className="redColor">* </span>Date
                            <input
                              type="text"
                              id="internship-s13-q3"
                              placeholder="2019-12-01"
                              className="form-control"
                              defaultValue={this.state.getS13q3}
                              onChange={(e) => this.setState({ s13q3: e.target.value })}
                            />
                          </label>
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
                            md="5"
                            className="text-center"
                          >
                            <MDBBtn
                              color="cyan"
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
                            md="5"
                            className="text-center"
                          >
                            <MDBBtn
                              gradient="aqua"
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.clickSubmitBtn}
                            >
                              <MDBIcon
                                icon="check"
                                className="pr-3"
                              />
                              Submit
                            </MDBBtn>
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

export default Section13;
