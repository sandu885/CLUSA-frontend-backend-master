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

import { queryStringToJSON } from "../../../utils/util";

import './agreementPlacement.css'

class AgreementPlacement extends Component {
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

  componentWillMount() {
    // const { location, history } = this.props;
    // const queryData = queryStringToJSON(location.search);
    // if (!queryData.orgId && !queryData.programId) {
    //   alert('Not having proper data to access this route')
    //   history.goBack();
    // }
    // this.setState({
    //   ...queryData,
    // });
  }

  handleFileChange = (e) => {
    const { formData } = this.state;

    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.files[0],
      }
    });
  };

  validate = (data) => {
    if (!data) {
      alert('Please fill the form first');
      return true
    }
    if (!data.checkAmount) {
      alert('Please enter check Amount');
      return true
    }
    if (!data.checkId) {
      alert('Please enter check#');
      return true
    }
    if (!data.checkDate) {
      alert('Please enter check date.');
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

  render() {
    const { formData } = this.state;

    let heading = 'Agreement and Placement';

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

                <MDBRow className="text-center pt-3 user-org-management-header sub-management-header">
                  <MDBCol>
                    A description about the agreement and placement
                  </MDBCol>
                </MDBRow>


                <MDBCardBody>


                  <MDBRow>

                    <MDBCol md="2" />
                    <MDBCol md="10" className="block-header">
                      <MDBRow>
                        <MDBCol>
                          Agreement
                        </MDBCol>

                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow>
                        <MDBCol sm="5">
                          <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload" onClick={() => this.handleFileClick('checkFile')}>
                            Click here to Upload/Replace Image
                          </MDBBtn>
                        </MDBCol>
                        <MDBCol sm="7" className="align-item-center">
                          Image file details over here
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>
                  {/*<MDBCol md="2" />*/}
                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow className="pt-3">
                        <MDBCol sm="12" className="block-header">
                          Signed Agreement
                        </MDBCol>
                        <MDBCol sm="12" className="pt-2">
                          Click here to Download the signed agreement
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  <MDBRow className="pt-3">


                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow>
                        <MDBCol sm="2" className="block-header align-item-center">
                          Award amount :-
                        </MDBCol>
                        <MDBCol sm="5" className="block-header">
                          <input type="text" className="form-control" name="checkDate" value={formData.awardAmount} onChange={this.handleChange} />
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>

                    </MDBRow>
                  <MDBRow>
                    <MDBCol md="11">
                      <MDBRow style={{ display: 'block'}}>
                        <hr/>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow className="pt-3">
                        <MDBCol sm="12" className="block-header">
                          Placement
                        </MDBCol>
                        <MDBCol sm="12" className="pt-2">
                          Placement template file name shows here, Click here to download
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow className="pt-3">
                        <MDBCol sm="12" className="block-header">
                          Filled placement
                        </MDBCol>
                        <MDBCol sm="12" className="pt-2">
                          Click here to download the filled placement confirmation
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  <MDBRow>
                    <MDBCol md="2" />
                    <MDBCol md="10">
                      <MDBRow className="pt-3">
                        <MDBCol sm="12" className="block-header">
                          Uploaded Date:-
                        </MDBCol>
                        <MDBCol sm="12" className="pt-2">
                          02/02/2020
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>


                  <MDBRow>
                    <MDBCol md="11">
                      <MDBRow style={{ display: 'block'}}>
                        <hr/>
                      </MDBRow>
                    </MDBCol>
                  </MDBRow>

                  <div>
                    <MDBRow>
                      <MDBCol md="2" />
                      <MDBCol md="10">
                        <MDBRow className="pt-3">
                          <MDBCol sm="12" className="block-header">
                            Result
                          </MDBCol>
                          <MDBCol sm="5" className="pt-2">
                            <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload" onClick={() => this.handleFileClick('checkFile')}>
                              Click here to Upload/Replace Image
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol sm="7" className="pt-2">
                              Placement file is here
                          </MDBCol>

                          <MDBCol sm="5" className="pt-3">

                            <select name="role" className="browser-default custom-select" onChange={this.handleChange}>
                              <option>Choose Role</option>
                              <option value="3">IT Admin</option>
                              <option value="0">Grant Reviewer</option>
                              <option value="1">Organization</option>
                              <option value="2">Grant Manager</option>
                            </select>

                          </MDBCol>

                        </MDBRow>
                      </MDBCol>
                    </MDBRow>
                  </div>
                  <MDBRow className="text-center pt-4">
                    <MDBCol md="3" />
                    <MDBCol md="3" >
                      <MDBBtn rounded size={"sm"} className="application-info-button second-action-button btn-block z-depth-1a check-file-upload light-green-color" onClick={() => this.handleFileClick('checkFile')}>
                        Save
                      </MDBBtn>
                    </MDBCol>
                    <MDBCol md="3" />
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

  fetchAgreementPlacementData = () => {
    const fetchAllChecksByOrgIdProgId = '/api/fetchAllChecksByOrgIdProgId';
    const { orgId, programId } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllChecksByOrgIdProgId,
        {
          sessionToken: this.state.sessionToken,
          orgId,
          programId,
        },
      ).then((response) => {
        const formData = response.data.checks.find(e => e.type === '3') || {};

        this.setState({
          formData: {
            ...formData, checkAmount: formData.amount, checkFile: '', checkDate: formData.date
          },
        })
      }).catch((error) => {
        this.setState({
          dataReceived: true,
        });
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.props.history.push('/')
            } else {
              alert(error.response.data.message);
            }
          }
        }
      });
    }
  };

  componentDidMount() {
    // this.fetchAgreementPlacementData()
  }
}

export default AgreementPlacement;
