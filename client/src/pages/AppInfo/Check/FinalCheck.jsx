/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard,
} from 'mdbreact';
import axios from 'axios';
import moment from 'moment';

import FooterComponent from '../../Footer';
import HeaderComponent from '../../Header';
import './checks.css'

class FinalCheck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      dataReceived: false,
      checkData: [],
      formData: {},
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
    };
  }

  handleFileClick = (name) => {
    const fileUpload = document.getElementsByName(name)[0];
    fileUpload.click();
  };

  handleFileChange = (e) => {
    const { formData } = this.state;

    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.files[0],
      }
    });
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

  render() {
    const { formData } = this.state;
    console.log(formData);

    let heading = 'Final Check';

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
                  <MDBRow className="header-section">
                    <MDBCol md="1" />
                    <MDBCol md="10">
                      <MDBRow style={{ display: 'block'}}>
                        <hr/>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol md="1" />
                    <MDBCol md="2" />
                    <MDBCol md="9">

                      <MDBRow className="form-group font-weight-bold">
                        <label className="col-form-label check-form-label">Check Amount:-</label>
                        <div className="col-sm-4">
                          <input type="number" className="form-control" name="checkAmount" value={formData.checkAmount} onChange={this.handleChange} />
                        </div>
                        <MDBCol sm="1" />
                        <label className="col-form-label">Check #:-</label>
                        <div className="col-sm-4">
                          <input type="text" className="form-control" name="checkId" value={formData.checkId} onChange={this.handleChange}/>
                        </div>
                      </MDBRow>

                      <MDBRow className="form-group font-weight-bold">
                        <label className="col-form-label check-form-label">Check Image:-</label>
                        <div className="col-sm-3">
                          <label className="col-form-label" style={{
                            fontWeight: '100',
                            color: '#b6b6b6',
                          }}> {formData.checkFile ? formData.checkFile.name : 'Image name is here'} </label>
                        </div>
                        <div className="col-sm-6">
                          <input type="file" className="form-control" style={{ display: 'none' }} name="checkFile" onChange={this.handleFileChange}/>
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload" onClick={() => this.handleFileClick('checkFile')}>
                            Click here to Upload/Replace Image
                          </MDBBtn>
                        </div>
                      </MDBRow>

                      <MDBRow className="form-group font-weight-bold">
                        <label className="col-form-label check-form-label">Check Date:-</label>
                        <div className="col-sm-4">
                          <input type="text" className="form-control" name="checkDate" value={formData.checkDate} onChange={this.handleChange} />
                        </div>
                      </MDBRow>

                      <MDBRow className="form-group font-weight-bold">
                        <MDBCol sm="3"/>
                        <MDBCol sm="3">
                          <MDBBtn rounded size={"sm"} className="send-button second-action-button btn-block z-depth-1a check-file-upload">
                            Send
                          </MDBBtn>
                        </MDBCol>
                        <MDBCol sm="3">
                          <MDBBtn rounded size={"sm"} className="cancel-button second-action-button btn-block z-depth-1a check-file-upload">
                            Cancel
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol md="1" />
                  </MDBRow>
                  <br />

                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>


        </MDBContainer>
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  // componentDidMount() {
  //   const fetchProgramDetailById = '/api/fetchProgramDetailById';
  //
  //   if (this.state.sessionToken) {
  //     axios.post(
  //       fetchProgramDetailById,
  //       {
  //         sessionToken: this.state.sessionToken,
  //         programId: this.props.match.params ? this.props.match.params.id : ''
  //       },
  //     ).then((response) => {
  //       const columns = [
  //         {
  //           label: 'Organization Name',
  //           field: 'orgName',
  //           sort: 'asc',
  //           width: 150
  //         },
  //         {
  //           label: 'Program',
  //           field: 'programType',
  //           sort: 'asc',
  //           width: 270
  //         },
  //         {
  //           label: 'Year',
  //           field: 'year',
  //           sort: 'asc',
  //           width: 200
  //         },
  //         {
  //           label: 'Awarded Amount',
  //           field: 'awardedAmount',
  //           sort: 'asc',
  //           width: 200
  //         },
  //         {
  //           label: 'Actual Amount',
  //           field: 'awardedAmount',
  //           sort: 'asc',
  //           width: 200
  //         },
  //         {
  //           label: 'Status',
  //           field: 'status',
  //           sort: 'asc',
  //           width: 200
  //         },
  //       ];
  //       console.log('response.data', response.data);
  //       this.setState({
  //         programData: { ...response.data.program },
  //         columns,
  //         dataReceived: true,
  //       });
  //
  //     }).catch((error) => {
  //       this.setState({
  //         dataReceived: true,
  //       });
  //       if(error.response !== null && error.response !== undefined) {
  //         if( error.response.data !== null && error.response.data !== undefined ) {
  //           if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
  //             localStorage.clear();
  //             alert('Your login status was expired. Please login again.');
  //             this.props.history.push('/')
  //           } else {
  //             alert(error.response.data.message);
  //           }
  //         }
  //       }
  //     });
  //   }
  // }
}

export default FinalCheck;
