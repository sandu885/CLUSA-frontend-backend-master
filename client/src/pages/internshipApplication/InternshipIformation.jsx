/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBIcon } from 'mdbreact';
import { Redirect } from 'react-router';
import axios from 'axios';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import '../style.css';

import CLUSAlogo from '../../images/clusaLogo.png';
import FooterComponent from '../Footer';
import HeaderComponent from '../Header';

import CLUSAWorkFlow from '../../images/clusaWorkflow.jpg';

class InternshipInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: localStorage.getItem('status'),
      sessionToken: localStorage.getItem('sessionToken'),
      redirectToNewApply: false,
      redirectToLogin: false,
    };
  }

  clickStartBtn = () => {
    const newApplyAPI = '/api/createNewProgram';
    const currentComponent = this;
    // new apply
    if (this.state.status === 'not applied') {
      console.warn('new start');
      axios.post(
        newApplyAPI,
        { sessionToken: this.state.sessionToken },
      ).then((response) => {
        currentComponent.setState({
          responseMessage: response.data,
        });
        // ======================== success ========================
        if (this.getData('message') === 'User successfully creates a new program') {
          console.warn('account responseMessage', this.state.responseMessage);
          this.setState({
            programId: this.getData('programId'),
          });
          localStorage.setItem('programId', this.state.programId);
          this.setState({
            redirectToNewApply: true,
          });
        }
      }).catch((error) => {
        console.warn(error.response);
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
    } else if (this.state.status === 'applying' || this.state.status === 'applied') {
      console.warn('applying/applied');
      this.setState({
        redirectToNewApply: true,
      });
    } else {
      console.warn('review');
    }
  }

  render() {
    const { redirectToNewApply, status, redirectToLogin } = this.state;
    let buttonText = '';

    if (status === 'not applied') { buttonText = 'I have read and want to Start Application'; } else if (status === 'applying') buttonText = 'I have read and want to Continue Application';
    else buttonText = 'I have read and want to Review Application';

    if (redirectToNewApply === true) return <Redirect to="/internship-application-section01" />;
    if (redirectToLogin === true) return <Redirect to="/login" />;

    return (
      <div className="bg-withImage">
        <HeaderComponent />
        <MDBContainer className="mb-5">
          <img
            src={CLUSAlogo}
            className="mx-auto d-block clusalogo"
            alt="aligment"
          />
          <MDBCard>
            <MDBCardBody className="mt-4 mr-5 ml-5 mb-4 pl-5 pr-5">
              <div className="text-justify pl-6 pr-6">
                <MDBContainer className="">
                  <h3 className="dark-grey-text mb-4 text-center mt-3">
                    <strong>CLUSA 2020 Public Service Internship Grant Application</strong>
                  </h3>
                  <hr />
                  <p className="pt-2">CLUSA is proud to announce that we are accepting applications for the 2020 Public Service Internship Grants. Nonprofit organizations 501(c)(3) or with a 501(C)(3) organization as fiscal agent are encouraged to complete online grant application to support a local student internship program which provides students with internship placement opportunities in <b>elected representative offices or government agencies, whether at the local, city, county, state, or federal levels.</b> Through supporting internship program, CLUSA aims to (1) build strong relationship between government and local civic leaders and communities; (2) train civic leaders to run for public office and inspire interns for active civic engagement.</p>
                  <h5 className="pt-3">
                    <strong>Prospective applicants should satisfy the following before applying online:</strong>
                  </h5>
                  <p>1. a. planning to have 5 or more local students.<br />
                  &nbsp;&nbsp;&nbsp;b. ability to secure 5 or more placements from local/state/federal public offices / government departments.<br />
                        2. Two or more committed program leaders as organizer and/or trainer (collaboration with other local organizations are strongly encouraged).<br />
                        3. Intention and ability to obtain 50% match funding of the project as your effort in self sustainability in the future.
                  </p>
                  <p>
                  N.B. — If your organization is not ready for having your internship program in 2020, we still strongly encourage you to register and join our Internship Program Leaders Training Webinars (for details, please see below in key dates) to learn more and get ready for the following year.
                  </p>

                  <img
                    src={CLUSAWorkFlow}
                    className="mx-auto d-block mb-3 pt-4"
                    alt="aligment"
                  />
                  <h5 className="pt-3">
                    <strong>2020 INTERNSHIP GRANT KEY DATES</strong>
                  </h5>
                  <h6 className="pt-2">
                    <strong>December 5, 2019: Grant application open</strong>
                  </h6>
                  <h6 className="pt-2">
                    <strong>December 14, 2019: First Informational Zoom-Conference 10AM-11AM Pacific Time <span className="redColor">*</span></strong>
                  </h6>
                  <h6 className="pt-2">
                    <strong>January 11, 2019: Second Informational Zoom-Conference 10AM-11AM Pacific Time <span className="redColor">*</span></strong>
                  </h6>
                  <h6 className="pt-2">
                    <strong>January 31, 2019: online application deadline 5PM Pacific time</strong>
                  </h6>
                  <h6 className="pt-2">
                    <strong>February 15, 2020, 10AM-12PM Pacific Time: Internship Program Leaders Training Webinar: &quot;An Ideal Public Service Internship Program&quot;. <br /> <span className="redColor">Mandatory to participate by program organizer and trainer.</span></strong>
                  </h6>
                  <h6 className="pt-2">
                    <strong>March 21, 2020, 10AM-12PM Pacific Time: Mandatory Internship Program Training Webinar: &quot;Community Engagement&quot;. <br /><span className="redColor">Mandatory to participate by program organizer and trainer。</span></strong>
                  </h6>
                  <h6 className="pt-2">
                    <strong>March 31, 2020: Grant awards announced.</strong>
                  </h6>
                  <h6 className="pt-2">
                    <strong>April 11, 2020: Orientation Webinar, <span className="redColor">for awarded organizations only.</span></strong>
                  </h6>
                  <h6 className="pt-2">
                    <strong>April 18, 2020, 10AM-12PM Pacific Time: Mandatory Internship Program Training Webinar: “Intern Training”.<br /><span className="redColor">Mandatory to participate by program organizer and trainer.</span></strong>
                  </h6>
                  <h6 className="pt-2">
                    <strong>May 16, 2020 10AM-12PM Pacific Time: Internship Program Leaders Training Webinar: “Resource Development”. <br /><span className="redColor">Mandatory to participate by program organizer and trainer.</span></strong>
                  </h6>
                  <h6 className="pt-2">
                    <strong>Final report due in 30 days after the internship program ends</strong>
                  </h6>
                  <p><span className="redColor">*</span> notes：Grant Application Informational Zoom-Conference(12/14/2019&1/11/2020) are to review the application process and answer any questions you may have. For all informational conferences and mandatory leader training webinars, please join Zoom Meeting <u><a href="https://zoom.us/j/261946259">https://zoom.us/j/261946259</a></u>, meeting reminders will be sent to attendees by email too.</p>
                </MDBContainer>
              </div>
              {/* ----------- button group ----------- */}
              <div className="text-center mb-3 mt-5">
                <MDBRow>
                  {/*  ----------- back button  ----------- */}
                  <MDBCol
                    md="6"
                    className="text-center"
                  >
                    <MDBBtn
                      color="cyan"
                      rounded
                      className="btn-block z-depth-1a"
                      href="/account"
                    >
                      <MDBIcon
                        icon="angle-double-left"
                        className="pr-3"
                      />
                        Back to My Account
                    </MDBBtn>
                  </MDBCol>
                  {/*  ----------- start application button  ----------- */}
                  <MDBCol
                    md="6"
                    className="text-center"
                  >
                    <MDBBtn
                      gradient="aqua"
                      rounded
                      className="btn-block z-depth-1a"
                      onClick={this.clickStartBtn}
                    >
                      <MDBIcon
                        icon="check"
                        className="pr-3"
                      />
                      {buttonText}
                    </MDBBtn>
                  </MDBCol>
                </MDBRow>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBContainer>
        <FooterComponent className="" />
      </div>
    )
  }
}

export default InternshipInformation;
