/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard
} from 'mdbreact';
import axios from 'axios';
import { Link } from "react-router-dom";

import FooterComponent from '../../Footer';
import HeaderComponent from '../../Header';
import './programDetail.css'

class ProgramDetail extends Component {
  constructor(props) {
    super(props);

    const programType = [{
      value: '0',
      name: 'Internship Grant',
    }, {
      value: '1',
      name: 'Civic Leadership Forum Grant',
    }, {
      value: '2',
      name: 'Capacity Building Grant',
    }, {
      value: '3',
      name: 'Media Service Grant',
    }, {
      value: '4',
      name: 'Website Development Grant',
    }, {
      value: '5',
      name: 'Strategic Planning Grant',
    }];

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      dataReceived: false,
      formData: {},
      programType,
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
    };
  }

  handleChange = (e) => {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        [e.target.name]: e.target.value,
      }
    });
  };

  handleSearchPost = async () => {

  };

  render() {
    const { formData: { organizationName = '', programType = '', status = '', year = '' }, role  } = this.state;

    let heading = 'Program Detail Page';

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBRow className="text-center p-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    {heading}
                  </MDBCol>
                </MDBRow>
                <MDBCardBody>
                  <MDBRow className="header-section">
                    <MDBCol md="12" className="text-center pt-3 sub-header font-weight-bold">
                      Program Info
                    </MDBCol>
                    <MDBCol md="12">
                      <hr/>
                    </MDBCol>
                    <MDBCol md="1" />
                    <MDBCol md="10">
                      <MDBRow>
                        <MDBCol md="5" className="program-detail-sub-header font-weight-bold">
                          <MDBRow>
                            Program:- <span> Internship </span>
                          </MDBRow>
                          <MDBRow>
                            Applied Date:- <span> 12/10/2019 </span>
                          </MDBRow>
                          <MDBRow>
                            1st Check Date:- <span> 12/10/2019 </span>
                          </MDBRow>
                          <MDBRow>
                            Inter Placement #:- <span> 123485 </span>
                          </MDBRow>
                        </MDBCol>
                        <MDBCol md="4" className="program-detail-sub-header font-weight-bold">
                          <MDBRow>
                            Year:- <span> 2019 </span>
                          </MDBRow>
                          <MDBRow>
                            Award Date:- <span> 12/10/2019 </span>
                          </MDBRow>
                          <MDBRow>
                            2nd Check Date:- <span> 12/10/2019 </span>
                          </MDBRow>
                          <MDBRow>
                            Actual Award Amount:- <span> 4020 </span>
                          </MDBRow>
                        </MDBCol>
                        <MDBCol md="3" className="program-detail-sub-header font-weight-bold">
                          <MDBRow>
                            Status:- <span> Applied </span>
                          </MDBRow>
                          <MDBRow>
                            Actual Award:- <span> 4020 </span>
                          </MDBRow>
                        </MDBCol>
                      </MDBRow>
                    </MDBCol>
                    <MDBCol md="1" />
                  </MDBRow>
                  <br />

                  <MDBRow>
                    <MDBCol md="12" className="text-center pt-3 sub-header font-weight-bold">
                      Application Info
                    </MDBCol>
                    <MDBCol md="12">
                      <hr/>
                    </MDBCol>

                    <MDBCol md="2" />
                    <MDBCol md="8" className="program-detail-sub-header font-weight-bold app-info">

                      <MDBRow>
                        <MDBCol md="7">
                          Application Information
                        </MDBCol>
                        <MDBCol md="5">
                          <MDBBtn
                            rounded
                            size={"sm"}
                            className="application-info-button second-action-button btn-block z-depth-1a"
                          >
                            Review
                          </MDBBtn>
                        </MDBCol>

                      </MDBRow>

                      <MDBRow>
                        <MDBCol md="7">
                          Agreement & Placement
                        </MDBCol>
                        <MDBCol md="5">
                          <MDBBtn
                            rounded
                            size={"sm"}
                            className="application-info-button second-action-button btn-block z-depth-1a"
                          >
                            Review
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow>
                        <MDBCol md="7">
                          Send 1st Check
                        </MDBCol>
                        <MDBCol md="5">
                          <MDBBtn
                            rounded
                            size={"sm"}
                            className="application-info-button second-action-button btn-block z-depth-1a"
                          >
                            Review
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow>
                        <MDBCol md="7">
                          Program Report
                        </MDBCol>
                        <MDBCol md="5">
                          <MDBBtn
                            rounded
                            size={"sm"}
                            className="application-info-button second-action-button btn-block z-depth-1a"
                          >
                            Review
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow>
                        <MDBCol md="7">
                          Final Report
                        </MDBCol>
                        <MDBCol md="5">
                          <MDBBtn
                            rounded
                            size={"sm"}
                            className="application-info-button second-action-button btn-block z-depth-1a"
                          >
                            Review
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow>
                        <MDBCol md="7">
                          Send final check
                        </MDBCol>
                        <MDBCol md="5">
                          <MDBBtn
                            rounded
                            size={"sm"}
                            className="application-info-button second-action-button btn-block z-depth-1a"
                          >
                            Review
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>


                    </MDBCol>
                    <MDBCol md="2" />
                    <MDBCol md="12">
                      <hr/>
                    </MDBCol>

                    <MDBCol md="12" className="text-center pt-3 sub-header font-weight-bold">
                      Program Closing Report
                    </MDBCol>
                    <MDBCol md="1" />
                    <MDBCol md="10">

                      <textarea name="desc" className="form-control mt-2 mb-4" rows="8">
                      </textarea>
                      <div style={{
                        justifyContent: 'center',
                        display: 'flex',
                      }}>
                        <MDBBtn
                          rounded
                          size={"sm"}
                          className="application-close-button second-action-button  btn-block z-depth-1a"
                        >
                          Back
                        </MDBBtn>
                      </div>
                    </MDBCol>
                    <MDBCol md="1" />
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

  componentDidMount() {
    // const fetchProgramDetailById = '/api/fetchProgramDetailById';
    // debugger
    // const { programType } = this.state
    //
    // if (this.state.sessionToken) {
    //   axios.post(
    //     fetchProgramDetailById,
    //     {
    //       sessionToken: this.state.sessionToken,
    //     },
    //   ).then((response) => {
    //     console.warn('clusa response', response.data.programs);
    //
    //     const columns = [
    //       {
    //         label: 'Organization Name',
    //         field: 'orgName',
    //         sort: 'asc',
    //         width: 150
    //       },
    //       {
    //         label: 'Program',
    //         field: 'programType',
    //         sort: 'asc',
    //         width: 270
    //       },
    //       {
    //         label: 'Year',
    //         field: 'year',
    //         sort: 'asc',
    //         width: 200
    //       },
    //       {
    //         label: 'Awarded Amount',
    //         field: 'awardedAmount',
    //         sort: 'asc',
    //         width: 200
    //       },
    //       {
    //         label: 'Actual Amount',
    //         field: 'awardedAmount',
    //         sort: 'asc',
    //         width: 200
    //       },
    //       {
    //         label: 'Status',
    //         field: 'status',
    //         sort: 'asc',
    //         width: 200
    //       },
    //     ];
    //
    //     const rows = (response.data.programs || []).map(row => {
    //       return {
    //         ...row,
    //         orgName: row.orgName && <Link to={`/org/${row.org.objectId}`}> {row.orgName} </Link>,
    //         programType: <Link to={'/'}> { row.programType ? programType.find(pT => pT.value === row.programType).name : ''} </Link>
    //       }
    //     })
    //     this.setState({
    //       programData: {
    //         columns: [ ...columns ],
    //         rows: [ ...rows ]
    //       },
    //       columns,
    //     });
    //
    //   }).catch((error) => {
    //     if(error.response !== null && error.response !== undefined) {
    //       if( error.response.data !== null && error.response.data !== undefined ) {
    //         if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
    //           localStorage.clear();
    //           alert('Your login status was expired. Please login again.');
    //           this.props.history.push('/')
    //         } else {
    //           alert(error.response.data.message);
    //         }
    //       }
    //     }
    //   });
    // }
  }
}

export default ProgramDetail;
