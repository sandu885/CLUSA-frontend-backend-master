/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from 'mdbreact';
import axios from 'axios';
import { Redirect } from 'react-router';

import './account.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import CLUSAlogo from '../../images/clusaLogo.png';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';

class CLUSAAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      responseMessage: null,
      orgAll: [],
      // orgNameList: '',
      // errorMessage: '',
      // hasError: false,
      loggedin: true,
      // userName: localStorage.getItem('userName'),
      sessionToken: localStorage.getItem('sessionToken'),
      redirectToLogin: false,
      // userId: localStorage.getItem('userId'),
      // orgDetailId: null,
      // orgId: null,
    };
  }

  componentDidMount() {
    console.warn('this is CLUSA account start');
    if (this.state.userName === null) {
      this.setState({
        loggedin: false,
      });
      console.warn('did not log in');
    }
    // setTimeout(() => {
    const fetchAllOrgsAPI = '/api/fetchAllOrgs';
    const currentComponent = this;

    axios.post(
      fetchAllOrgsAPI,
      { sessionToken: this.state.sessionToken },
    ).then((response) => {
      currentComponent.setState({
        responseMessage: response.data,
      });
      console.warn('clusa response', response.data.organizations);
      // ======================== success ========================
      if (this.getData('message') === 'Successfully fetch all organizations') {
        // console.warn('organizations in CLUSA', this.getData('organizations'));
        this.setState({
          orgAll: this.getData('organizations'),
        });
        // console.warn('orgAll', this.state.orgAll);
        console.warn('clusa account finish');
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
    // }, 0);
  }

  getData = (key, defaultValue = '') => {
    const data = this.state.responseMessage;
    return data[key] || defaultValue;
  }

  getOrg = (key, defaultValue = '') => {
    const data = this.state.orgAll;
    return data[key] || defaultValue;
  }

  // sendChosenOrgId() {
  //   this.setState ({
  //     orgDetailId: '1234566',
  //   })
  //   // localStorage.setItem('orgId', this.state.orgId);
  //   // localStorage.setItem('sessionToken', this.state.sessionToken);
  // }

  render() {
    const { orgAll, loggedin, redirectToLogin } = this.state;
    if (loggedin === false) return <div>Please Login To view your data history <Redirect to="/login" /></div>;
    if (redirectToLogin === true) return <Redirect to="/login" />;
    // const listItems = orgAll.map((d) => <li key={d.name}>{d.name}</li>);

    const listItems02 = orgAll.map((d, index) => (
      <div>
        <MDBRow>
          <MDBCol md="3">
            <p>{d.name}</p>
          </MDBCol>
          <MDBCol md="3">
            <p>{d.status}</p>
          </MDBCol>
          <MDBCol
            md="3"
            className="text-center"
          >
            <MDBBtn
              gradient="blue"
              rounded
              className="btn-block z-depth-1a"
              key={index}
              id={d.objectId}
              href="/organization-information/"
              onClick={(e) => {
                // this.setState({ orgDetailId: [e.target.id] });
                localStorage.setItem('orgId', [e.target.id]);
              }}
            >
              View Organization Information
            </MDBBtn>
          </MDBCol>
          <MDBCol
            md="3"
            className="text-center"
          >
            <MDBBtn
              gradient="purple"
              rounded
              className="btn-block z-depth-1a"
              key={index}
              id={d.objectId}
              href="/organization-application-information/"
              onClick={(e) => {
                // this.setState({ orgDetailId: [e.target.id] });
                localStorage.setItem('orgId', [e.target.id]);
              }}
            >
              view Organization application
            </MDBBtn>
          </MDBCol>
        </MDBRow>
        <hr />
      </div>
    ));


    return (

      <div className="bg-lightcolor">
        <HeaderComponent />
        <MDBContainer className="pt-3 mb-5 orgList">
          <img
            src={CLUSAlogo}
            className="mx-auto d-block clusalogo"
            alt="aligment"
          />
          <MDBRow>
            <MDBCol md="1" />
            <MDBCol
              md="10"
              className="text-center"
            >
              <MDBCard>
                <MDBCardBody className="mx-4">
                  <div className="text-center">
                    <h3 className="dark-grey-text mb-4">
                      <strong>View All Organization Infomation</strong>
                    </h3>
                  </div>
                  <div className="text-center mb-3">
                    <h4>Here shows the list</h4>
                    <hr />
                    <div className="text-left mt-5">
                      {listItems02 }
                      <hr />
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="1" />
          </MDBRow>
        </MDBContainer>
        <FooterComponent />
      </div>
    );
  }
}

export default CLUSAAccount;
