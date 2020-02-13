/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBRow, MDBCol, MDBCard, MDBDataTable,
} from 'mdbreact';
import axios from 'axios';
import { Link } from "react-router-dom";
import moment from 'moment';

import './organizationView.css'
import FooterComponent from '../../Footer';
import HeaderComponent from '../../Header';

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
      dataReceived: true,
      programData: {},
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
      programType,
    };
  }

  render() {
    const { programData: { program = {}, application = [] }, programType, dataReceived, programData } = this.state;

    let heading = 'Organization Home Page';

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          {dataReceived &&
            <MDBRow>
              <MDBCol md="12">
                <MDBCard>
                  <MDBRow className="text-center pt-3 user-org-management-header font-weight-bold">
                    <MDBCol>
                      {heading}
                    </MDBCol>
                  </MDBRow>
                  <MDBCardBody>
                    <MDBRow className="header-section pt-3">
                      <MDBCol md="1" />
                      <MDBCol md="10">
                        <MDBRow>
                          <MDBCol md="12" className="program-detail-sub-header font-weight-bold text-center organization-sub-header">
                            <MDBRow>
                              <div className="organization-sub-header-item">
                                Organization Name:-
                              </div>
                              <div>
                                <span> TesetVielw </span>
                              </div>
                            </MDBRow>
                            <MDBRow>
                              <div className="organization-sub-header-item">
                                Conant Name:-
                              </div>
                              <div>
                                <span> Tommay </span>
                              </div>
                            </MDBRow>
                            <MDBRow>
                              <div className="organization-sub-header-item">
                                Email:-
                              </div>
                              <div>
                                <span> Test@test.com </span>
                              </div>
                            </MDBRow>
                            <MDBRow className="mb-3">
                              <MDBCol md="3" />
                              <MDBCol md="6">
                                <MDBBtn
                                  rounded
                                  size={"sm"}
                                  className="green-button org-view-sub-header-button btn-block z-depth-1a"
                                >
                                  More Details
                                </MDBBtn>
                              </MDBCol>
                              <MDBCol md="3" />
                            </MDBRow>
                          </MDBCol>
                        </MDBRow>
                      </MDBCol>
                      <MDBCol md="1" />
                    </MDBRow>
                    <br />

                    <MDBRow>
                      <MDBCol md="1" />
                      <MDBCol md="10">
                        <MDBDataTable
                          className="custom-table program-table"
                          striped
                          borderless
                          data={programData}
                          searching={false}
                          noBottomColumns
                          info={false}
                        />
                      </MDBCol>
                      <MDBCol md="1" />
                    </MDBRow>

                    <MDBRow>
                      <MDBCol md="12">
                        <hr/>
                      </MDBCol>

                      <MDBCol md="12" className="text-center sub-header font-weight-bold">
                        Apply Other Program
                      </MDBCol>

                      <MDBCol md="12">
                        <hr/>
                      </MDBCol>

                      <MDBCol md="12">
                        <MDBRow>
                          <MDBCol md="1" />
                          <MDBCol md="10">
                            <MDBRow>
                              <MDBCol lg="6" className="pb-4">
                                <div className="org-custom-card p-4 text-center">
                                  <div className="sub-header font-weight-bold">
                                    Internship Program Grant
                                  </div>
                                  <div className="org-custom-card-button">
                                    <MDBBtn
                                      rounded
                                      size={"sm"}
                                      className="gray-button btn-block z-depth-1a"
                                    >
                                      Not Open Now
                                    </MDBBtn>
                                  </div>

                                </div>
                              </MDBCol>
                              <MDBCol lg="6">
                                <div className="org-custom-card p-4 text-center">
                                  <div className="sub-header font-weight-bold">
                                    Civic Leadership Forum Grant
                                  </div>
                                  <div className="org-custom-card-button">
                                    <MDBBtn
                                      rounded
                                      size={"sm"}
                                      className="gray-button btn-block z-depth-1a"
                                    >
                                      Not Open Now
                                    </MDBBtn>
                                  </div>

                                </div>
                              </MDBCol>
                              <MDBCol lg="6" className="pb-4">
                                <div className="org-custom-card p-4 text-center">
                                  <div className="sub-header font-weight-bold">
                                    Capacity Building Grant
                                    (By Invitation Only)
                                  </div>
                                  <div className="pt-1">
                                    <MDBBtn
                                      rounded
                                      size={"sm"}
                                      className="gray-button btn-block z-depth-1a"
                                    >
                                      Not Open Now
                                    </MDBBtn>
                                  </div>

                                </div>
                              </MDBCol>
                              <MDBCol lg="6">
                                <div className="org-custom-card p-4 text-center">
                                  <div className="sub-header font-weight-bold">
                                    CLUSA Technical Assistance Grants
                                  </div>
                                  <div className="org-custom-card-button">
                                    <MDBBtn
                                      rounded
                                      size={"sm"}
                                      className="gray-button btn-block z-depth-1a"
                                    >
                                      Not Open Now
                                    </MDBBtn>
                                  </div>
                                </div>
                              </MDBCol>
                            </MDBRow>
                          </MDBCol>
                          <MDBCol md="1" />
                        </MDBRow>
                      </MDBCol>
                    </MDBRow>


                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          }
        </MDBContainer>
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  componentDidMount() {
    const fetchAllProgramsByOrgId = '/api/fetchAllProgramsByOrgId';
    const { programType } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllProgramsByOrgId,
        {
          sessionToken: this.state.sessionToken,
          orgId: this.props.match.params ? this.props.match.params.id : ''
        },
      ).then((response) => {
        const columns = [
          {
            label: 'Program',
            field: 'programType',
            sort: 'asc',
            width: 270
          },
          {
            label: 'Year',
            field: 'year',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Awarded Amount',
            field: 'awardedAmount',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Actual Amount',
            field: 'awardedAmount',
            sort: 'asc',
            width: 200
          },
          {
            label: 'Status',
            field: 'status',
            sort: 'asc',
            width: 200
          },
        ];
        const rows = (response.data.programs || []).map(row => {
          return {
            ...row,
            programType: <Link to={`/program/${row.objectId}`}> { row.programType ? programType.find(pT => pT.value === row.programType).name : ''} </Link>
          }
        })
        this.setState({
          programData: {
            columns: [ ...columns ],
            rows: [ ...rows ]
          },
          columns,
          dataReceived: true,
        });

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
  }
}

export default ProgramDetail;
