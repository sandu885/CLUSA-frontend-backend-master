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

    let heading = 'Recreate login due to contact person change';

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBRow className="text-center pt-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    {heading}
                  </MDBCol>
                </MDBRow>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol md="1" />
                    <MDBCol md="10" className="text-center">
                      Please explain why you want to recreate account, and provide the related account information
                    </MDBCol>
                    <MDBCol md="1" />

                    <MDBCol md="1" />
                    <MDBCol md="10">
                      <MDBRow>
                        <MDBCol md="1" />
                        <MDBCol md="10" className="table-header font-weight-bold">
                          <textarea rows={5} className="form-control ml-12 mt-3" name="note" value={formData.note} onChange={this.handleChange} />
                        </MDBCol>
                        <MDBCol md="1" />
                      </MDBRow>
                      <MDBCol md="1" />

                      <MDBRow className="pt-4">

                      </MDBRow>

                    </MDBCol>
                    <MDBCol md="1" />
                  </MDBRow>

                  <MDBRow>

                    <MDBCol md="2" />
                    <MDBCol md="8" style={{ display: 'flex' }}>
                      <MDBBtn
                        rounded
                        size={"sm"}
                        className="second-action-button btn-block z-depth-1a"
                        style={{ width: '50%' }}
                        onClick={(e) => this.postRecreateLogin(e)}
                      >
                        Submit
                      </MDBBtn>
                      <MDBBtn
                        rounded
                        size={"sm"}
                        className="second-action-button btn-block z-depth-1a red-color"
                        style={{ width: '40%', marginLeft: '30px' }}
                        onClick={(e) => {
                          this.props.history.push('/');
                        }}
                      >
                        Cancel
                      </MDBBtn>
                    </MDBCol>
                    <MDBCol md="2" />
                  </MDBRow>

                  <br/>
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
