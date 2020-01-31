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

class Section06 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      s6q1: null,
      s6q2: null,
      s6q3: null,
      s6q4: null,
      // db data for previous submit ===========
      getS6q1: null,
      getS6q2: null,
      getS6q3: null,
      getS6q4: null,
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
      console.warn('section 6 logedin', this.state.logedin);
    } else {
      axios.post(
        getSectionInputAPI,
        { sessionToken: this.state.sessionToken,
          programType: '0',
          sectionIndex: '6' },
      ).then((response) => {
        if (response.data.message === 'Successfully get application content') {
          console.warn('section 6 get information successfully!');
          this.setState({
            getS6q1: response.data.content['1'],
            getS6q2: response.data.content['2'],
            getS6q3: response.data.content['3'],
            getS6q4: response.data.content['4'],
          });
        } else if (response.data.message === 'No saved application for this section') {
          console.warn('no saved history');
        } else {
          console.warn('section 6 Failed to save');
        }
        console.warn(response.data);
      }).catch((error) => {
        console.warn('section 6 error.response', error.response);
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
    console.warn('============== section 6 save data', this.state);
    const finalS6q1 = this.state.s6q1 === null ? this.state.getS6q1 : this.state.s6q1;
    const finalS6q2 = this.state.s6q2 === null ? this.state.getS6q2 : this.state.s6q2;
    const finalS6q3 = this.state.s6q3 === null ? this.state.getS6q3 : this.state.s6q3;
    const finalS6q4 = this.state.s6q4 === null ? this.state.getS6q4 : this.state.s6q4;

    const formData = new FormData();
    formData.append('sessionToken', this.state.sessionToken);
    formData.append('programType', '0');
    formData.append('sectionIndex', '6');
    formData.append('sectionContent', JSON.stringify(
      { 1: finalS6q1,
        2: finalS6q2,
        3: finalS6q3,
        4: finalS6q4 },
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
          getS6q1: response.data.content['1'],
          getS6q2: response.data.content['2'],
          getS6q3: response.data.content['3'],
          getS6q4: response.data.content['4'],
          disableSaveButton: true,
        });
        document.getElementById('internship-s6').reset();
        window.location.reload();
      } else {
        console.warn('section 6 Failed to save');
        alert('section 6 Failed to save, please try again');
      }
      // console.warn(this.state.responseMessage);
    }).catch((error) => {
      console.warn('section 6 error.response', error.response);
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
    if (this.state.shouldRedirectToNext === true) return <Redirect to="/internship-application-section07" />;
    if (this.state.shouldRedirectToPrevious === true) return <Redirect to="/internship-application-section05" />;
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
                title="SECTION 6. Student Recruiting Plan"
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
                        <h3 className="dark-grey-text mb-2">
                          <strong>PART A: Program Information</strong>
                        </h3>
                        <MDBRow className="mbottom0Imp">
                          <MDBCol md="10">
                            <h5>
                              <strong>SECTION 6. Student Recruiting Plan</strong>
                            </h5>
                          </MDBCol>
                          <MDBCol md="2">  <p className="redColor text-right">* Required</p></MDBCol>
                        </MDBRow>
                        <hr className="h4m0p10" />
                      </div>
                      {/* ----------- main questions ----------- */}
                      <div className="text-left">
                        <form
                          id="internship-s6"
                          className="form-all"
                        >
                          {/* ----------- 6.1 ----------- */}
                          <label
                            htmlFor="internship-s6-q1"
                            className="font-weight-bold text-justify"
                          >
                            6.1.
                            <span className="redColor">* </span>What age range of students are you looking for as interns (ie. high school students, college, both)?
                          </label>
                          <p className="text-justify redColor">Note: Your local organization is responsible for adhering to laws and best practices in supervising student interns particularly for minors.</p>
                          <input
                            type="text"
                            id="internship-s6-q1"
                            className="form-control"
                            defaultValue={this.state.getS6q1}
                            onChange={(e) => this.setState({ s6q1: e.target.value })}
                          />

                          {/* ----------- 6.2 ----------- */}
                          <label
                            htmlFor="internship-s6-q2"
                            className="font-weight-bold text-justify pt-3"
                          >
                            6.2.
                            <span className="redColor">* </span>What criteria are you using to select students?
                          </label>
                          <textarea
                            id="internship-s6-q2"
                            className="form-control"
                            rows="4"
                            defaultValue={this.state.getS6q2}
                            onChange={(e) => this.setState({ s6q2: e.target.value })}
                          />

                          {/* ----------- 6.3 ----------- */}
                          <label
                            htmlFor="internship-s6-q3"
                            className="font-weight-bold text-justify pt-3"
                          >
                            6.3.
                            <span className="redColor">* </span>What is your student recruitment strategy?
                          </label>
                          <textarea
                            id="internship-s6-q3"
                            className="form-control"
                            rows="4"
                            defaultValue={this.state.getS6q3}
                            onChange={(e) => this.setState({ s6q3: e.target.value })}
                          />

                          {/* ----------- 6.4 ----------- */}
                          <label
                            htmlFor="internship-s6-q4"
                            className="font-weight-bold text-justify pt-3"
                          >
                            6.4.
                            <span className="redColor">* </span>If your program includes minors, please provide a rationale and describe how your organization has met laws protecting minors.
                          </label>
                          <textarea
                            id="internship-s6-q4"
                            className="form-control"
                            rows="4"
                            defaultValue={this.state.getS6q4}
                            onChange={(e) => this.setState({ s6q4: e.target.value })}
                          />
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

export default Section06;
