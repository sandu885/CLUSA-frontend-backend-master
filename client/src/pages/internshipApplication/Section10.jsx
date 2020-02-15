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

import BudgetTemplate from '../../images/CLUSA Internship -budget-template.xlsx';

class Section10 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // ===========================
      budget: undefined,
      // db data for previous submit ===========
      getS10q1: undefined,
      responseMessage: '',
      getS10q2: undefined,
      getS10q3: undefined,
      // save status ===========
      saveSuccess: false,
      // local storage ==========
      sessionToken: localStorage.getItem('sessionToken'),
      userName: localStorage.getItem('userName'),
      shouldRedirectToNext: false,
      shouldRedirectToPrevious: false,
      s10q1: undefined,
      s10q2: undefined,
      s10q3: undefined,
      // get file name
      getFileName: undefined,
      savedBefore: false,
      redirectToLogin: false,
      previousUploadedFile: undefined,
      // disable save button after one click
      disableSaveButton: false,
    };
  }

  componentDidMount() {
    // get user input
    const getSectionContentAPI = '/api/getApplicationContentBySectionIndex';

    if (this.state.userName === undefined) {
      this.setState({
        logedin: false,
      });
      console.warn('section 10 logedin', this.state.logedin);
    } else {
      console.warn('start call api');
      axios.post(
        getSectionContentAPI,
        { sessionToken: this.state.sessionToken,
          programType: '0',
          sectionIndex: '10' },
      ).then((response) => {
        console.warn('response of get in section 10', response.data);
        this.setState({
          getS10q2: response.data.content[2],
          getS10q3: response.data.content[3],
        });
        if (response.data.message === 'You already uploaded the file') {
          // console.warn('section 4 get information successfully!', response.data);
          this.setState({
            savedBefore: true,
          });
          this.downloadFile();
          this.setState({
            getS10q1: response.data.message, // //////////要get
          });
        } else if (response.data.message === 'No budget file') {
          console.warn('No budget file'); // savedBefore === false
        } else {
          console.warn('section 10 Failed to save');
        }
        console.warn(response.data);
      }).catch((error) => {
        console.warn('section 10 error.response', error.response);
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

  downloadFile = async () => {
    const sectionContent = {};
    sectionContent.sessionToken = this.state.sessionToken;
    sectionContent.programType = '0';
    sectionContent.sectionIndex = '10';
    const response = await axios({
      method: 'post',
      url: '/api/getApplicationFileBySectionIndex',
      data: sectionContent,
      responseType: 'blob',
    });
    const link = document.createElement('a', { className: '', id: 'asd', style: { color: 'red', background: 'yellow' } }); let
      filename;
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches !== undefined && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    this.setState({
      getS10q1: link, // still have problem for getting files from get API if user only change 10.2 or 10.3
    });
    link.href = window.URL.createObjectURL(response.data);
    link.download = filename;
    link.innerText = filename;
    document.getElementById('previousTitle').appendChild(link);
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
    console.warn('============== section 10 save data', this.state);

    const finalBudget = this.state.budget === undefined ? this.state.getS10q1 : this.state.budget;
    const finalS10q2 = this.state.s10q2 === undefined ? this.state.getS10q2 : this.state.s10q2;
    const finalS10q3 = this.state.s10q3 === undefined ? this.state.getS10q3 : this.state.s10q3;

    const formData = new FormData();
    formData.append('sessionToken', this.state.sessionToken);
    formData.append('programType', '0');
    formData.append('sectionIndex', '10');
    formData.append('orgName', localStorage.getItem('orgName'));
    formData.append('sectionContent', JSON.stringify(
      {
        2: finalS10q2,
        3: finalS10q3,
      },
    ));
    formData.append('budget', finalBudget);

    axios.post(
      saveAPI,
      formData,
    ).then((response) => {
      if (response.data.message === 'Successfully save section content') {
        console.warn(' success ======', response.data);
        this.setState({
          saveSuccess: true,
          // getS10q1: response.data.content['1'],
          disableSaveButton: true,
        });
        document.getElementById('internship-s10').reset();
        // window.location.reload();
      } else if (response.data.message === '') {
        console.warn(' part ======', response.data);
        this.setState({
          saveSuccess: true,
          // getS10q1: response.data.content['1'],
          disableSaveButton: true,
        });
        document.getElementById('internship-s10').reset();
        // window.location.reload();
      } else {
        console.warn('section 10 Failed to save');
        alert('section 10 Failed to save, please try again');
      }
      // console.warn(this.state.responseMessage);
    }).catch((error) => {
      console.warn('section 10 error.response', error.response);
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

  uploadFileOnChangeHandler = (event) => {
    console.warn(event.target.files[0]);
    this.setState({
      budget: event.target.files[0],
    });
  }

  render() {
    const { saveSuccess, savedBefore, redirectToLogin } = this.state;
    if (this.state.shouldRedirectToNext === true) return <Redirect to="/internship-application-section11" />;
    if (this.state.shouldRedirectToPrevious === true) return <Redirect to="/internship-application-section09" />;
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
                title="SECTION 10. Program Budget"
                message="Save Successfully."
                style={{
                  position: 'fixed',
                  top: '50%',
                  right: '40%',
                  zIndex: 9999,
                }}
              />
            </MDBContainer>
          ) : undefined}
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
                              <strong>SECTION 10. Program Budget</strong>
                            </h5>
                          </MDBCol>
                          <MDBCol md="2">  <p className="redColor text-right">* Required</p></MDBCol>
                        </MDBRow>
                        <hr className="h4m0p10" />
                      </div>
                      {/* ----------- main questions ----------- */}
                      <div className="text-left">
                        <form
                          id="internship-s10"
                          className="form-all"
                        >
                          {/* ----------- 10.1: ----------- */}
                          <label
                            htmlFor="internship-s10-q1"
                            className="font-weight-bold text-justify"
                          >
                            10.1.
                            <span className="redColor">* </span>Please provide your program’s budget. CLUSA Internship grant ranges from $2,000 to 10,000 with at least 50% matching requirement. This is to encourage self-sustainability, whether in fundraising or any other means.
                          </label>
                          <div className="clickDownload mt-2 text-justify">
                            {/* <a
                              href={BudgetTemplate}
                              download
                              id="previousTitle"
                              className="clickDownload mt-5"
                            >  Please click here to download the budget Template. After finish filling out the program budget template, please use the browser below to upload. */}
                            { savedBefore === false ? (
                              <a
                                href={BudgetTemplate}
                                download
                                className="clickDownload mt-5"
                              >  Please click here to download the budget Template. After finish filling out the program budget template, please use the browser below to upload.
                              </a>
                            ) : (
                              <p
                                // download
                                id="previousTitle"
                                className="clickDownload mt-2"
                                // onClick={this.downloadFile}
                              >Previous Upload: </p>

                            )}
                          </div>
                          <div className="file-field mt-3">
                            <MDBRow className="">
                              <div className=" btn-lg float-left ml-4">
                                <input
                                  type="file"
                                  name="file"
                                  onChange={this.uploadFileOnChangeHandler}
                                  className="form-control"
                                />
                              </div>
                              <div className="vertical-center">
                                <p className="regularsize">
                                  <span className="redColor">* </span>Upload filled budget template
                                </p>
                              </div>
                            </MDBRow>
                            {/* <h5
                              className="darkblueColor pt-2"
                              id="previousTitle"
                            >Previous Upload:
                            </h5> */}
                          </div>
                          {/* ----------- 10.2 & 10.3: ----------- */}
                          <label
                            htmlFor="internship-s10-q2"
                            className="font-weight-bold text-justify mt-4"
                          >
                            10.2.
                            <span className="redColor">* </span>CLUSA Grant Request Amount
                          </label>
                          <MDBRow className="text-center mt-1 greyBG">
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
                              <input
                                type="number"
                                id="internship-s10-q2"
                                className="form-control mt-2"
                                defaultValue={this.state.getS10q2}
                                onChange={(e) => this.setState({ s10q2: e.target.value })}
                              />
                            </MDBCol>
                            <MDBCol md="4">
                              <input
                                type="number"
                                id="internship-s10-q3"
                                className="form-control mt-2"
                                defaultValue={this.state.getS10q3}
                                onChange={(e) => this.setState({ s10q3: e.target.value })}
                              />
                            </MDBCol>
                          </MDBRow>
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

export default Section10;
