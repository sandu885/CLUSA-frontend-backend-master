import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard,
} from 'mdbreact';
import axios from 'axios';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';

import CLUSAlogo from '../../images/clusaLogo.png';

class RecreateLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {},
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
    };
  }



  validate = (data) => {
    if (!data) {
      alert('Please fill the form first');
      return true
    }

    if (!data.note) {
      alert('Please enter some note or description.');
      return true
    }

    return false
  };

  handleChange = (e) => {
    const { formData } = this.state;

    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.value,
      }
    });
  };

  postRecreateLogin = () => {
    const { history } = this.props;
    const { formData } = this.state;

    if (this.validate(formData)) {
      return true
    }

    let createRecreateLoginURL = '/api/createRecreateLogin';

    try {
      axios.post(
        createRecreateLoginURL,
        { ...formData },
      ).then(() => {
        this.setState({
          formData: {},
        });
        this.props.history.push('/')
      }).catch((error) => {
        if (error.response !== null && error.response !== undefined) {
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
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { formData } = this.state;

    let heading = 'Recreate log in due to contact person change';

    return (
      <div className="bg-withImage">
        <HeaderComponent />
        <MDBContainer>
        <img
            src={CLUSAlogo}
            className="mx-auto d-block clusalogo mt-3"
            alt="aligment"
          />
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol md="12 pl-5 pr-5">
                      <h3>{heading}</h3>                      
                    </MDBCol>
                    <MDBCol md="12 pl-5 pr-5">
                      <MDBRow>
                        <MDBCol md="12">
                          <p><strong>Please explain why you want to recreate account, and provide the related account information</strong></p>
                          <textarea rows={5} className="form-control ml-12 mt-3" name="note" value={formData.note} onChange={this.handleChange} />
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol md="12 pl-5 pr-5" style={{ display: 'flex' }}>
                      <MDBBtn
                        rounded
                        color="default"
                        className="second-action-button z-depth-1a"
                        onClick={(e) => this.postRecreateLogin(e)}
                      >
                        Submit
                      </MDBBtn>
                      <MDBBtn
                        rounded
                        color="danger"
                        className="second-action-button z-depth-1a red-color"
                        onClick={(e) => {
                          this.props.history.push('/');
                        }}
                      >
                        Cancel
                      </MDBBtn>
                    </MDBCol>                    
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }



}

export default RecreateLogin;
