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

import FooterComponent from '../../Footer';
import HeaderComponent from '../../Header';

import './organizationView.css'

class OrganizationView extends Component {
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
    const { dataReceived, programData, organization = {}, user = {} } = this.state;

    let heading = 'Organization Home Page';

    return (
      <div className="bg-withImage">
        <HeaderComponent />
        <MDBContainer className="title-section">
          <MDBRow>
            <MDBCol
              md="12"
            >
              <h1>{heading}</h1>
            </MDBCol>
          </MDBRow>
        </MDBContainer>

        <MDBContainer className="">
          {dataReceived &&
            <MDBRow>
              <MDBCol md="12">
                <MDBCard>
                  <MDBCardBody>
                    <div className="grey-bg" style={{ padding: '15px 30px 15px 30px' }}>
                    <MDBRow>
                      <MDBCol md="2" className="pt-2">
                        <strong>Organization Name: </strong><span> {organization.name} </span>
                      </MDBCol>
                      <MDBCol md="2" className="pt-2">
                      <strong>Conant Name: </strong><span> {user.username} </span>
                      </MDBCol>
                      <MDBCol md="2" className="pt-2">
                      <strong>Email: </strong><span> {user.emailAddress || user.email} </span>
                      </MDBCol>
                      <MDBCol md="2">
                        <MDBBtn
                          rounded
                          style={{ margin: '0' }}
                          className="green-button org-view-sub-header-button z-depth-1a"
                          onClick={() =>{
                            if (this.props.match.params.id) {
                              localStorage.setItem('orgId', this.props.match.params.id);
                            }
                            this.props.history.push('/organization-information');
                          }}
                        >
                          More Details
                        </MDBBtn>
                      </MDBCol>
                    </MDBRow>
                    </div>
                    <br />
                    <MDBRow>
                      <MDBCol md="12">
                        <div className="table-responsive">
                          <MDBDataTable
                            className="custom-table program-table"
                            striped
                            borderless
                            data={programData}
                            searching={false}
                            noBottomColumns
                            info={false}
                          />
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <div className="offer-box-row">
                      <MDBRow>
                        <MDBCol md="12">
                          <h3>Apply Other Program</h3>
                        </MDBCol>
                        <MDBCol md="3">
                          <div className="offer-box">
                              <p>Internship Program Grant</p>
                              <MDBBtn
                                rounded
                                style={{ margin: '0' }}
                                className="green-button org-view-sub-header-button z-depth-1a"
                                onClick={() =>{
                                  if (this.props.match.params.id) {
                                    localStorage.setItem('orgId', this.props.match.params.id);
                                  }
                                  this.props.history.push('/organization-information');
                                }}
                              >
                                Open Now
                              </MDBBtn>
                          </div>
                        </MDBCol>
                        <MDBCol md="3">
                          <div className="offer-box">
                              <p>civic leadership fourm grant</p>
                              <MDBBtn
                                rounded
                                style={{ margin: '0' }}
                                disabled
                                className="green-button org-view-sub-header-button z-depth-1a"
                                onClick={() =>{
                                  if (this.props.match.params.id) {
                                    localStorage.setItem('orgId', this.props.match.params.id);
                                  }
                                  this.props.history.push('/organization-information');
                                }}
                              >
                                Open Now
                              </MDBBtn>
                          </div>
                        </MDBCol>
                        <MDBCol md="3">
                          <div className="offer-box">
                              <p>Capacity Building grant <br></br><span>(By Invitation Only)</span></p>
                              <MDBBtn
                                rounded
                                style={{ margin: '0' }}
                                disabled
                                className="green-button org-view-sub-header-button z-depth-1a"
                                onClick={() =>{
                                  if (this.props.match.params.id) {
                                    localStorage.setItem('orgId', this.props.match.params.id);
                                  }
                                  this.props.history.push('/organization-information');
                                }}
                              >
                                Open Now
                              </MDBBtn>
                          </div>
                        </MDBCol>
                        <MDBCol md="3">
                          <div className="offer-box">
                              <p>CLUSA Technical Assistance grant</p>
                              <MDBBtn
                                rounded
                                style={{ margin: '0' }}
                                disabled
                                className="green-button org-view-sub-header-button z-depth-1a"
                                onClick={() =>{
                                  if (this.props.match.params.id) {
                                    localStorage.setItem('orgId', this.props.match.params.id);
                                  }
                                  this.props.history.push('/organization-information');
                                }}
                              >
                                Open Now
                              </MDBBtn>
                          </div>
                        </MDBCol>
                      </MDBRow>
                    </div>

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
            field: 'actualAmount',
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
        const rows = (response.data.data.programs || []).map(row => {
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
          organization: response.data.data.organizationData,
          user: response.data.data.userData,
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

    // if (this.state.sessionToken) {
    //   axios.post(
    //     fetchAllProgramsByOrgId,
    //     {
    //       sessionToken: this.state.sessionToken,
    //       orgId: this.props.match.params ? this.props.match.params.id : ''
    //     },
    //   ).then((response) => {
    //     const columns = [
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
    //         field: 'actualAmount',
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
    //     const rows = (response.data.programs || []).map(row => {
    //       return {
    //         ...row,
    //         programType: <Link to={`/program/${row.objectId}`}> { row.programType ? programType.find(pT => pT.value === row.programType).name : ''} </Link>
    //       }
    //     })
    //     this.setState({
    //       programData: {
    //         columns: [ ...columns ],
    //         rows: [ ...rows ]
    //       },
    //       columns,
    //       dataReceived: true,
    //     });
    //
    //   }).catch((error) => {
    //     this.setState({
    //       dataReceived: true,
    //     });
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

export default OrganizationView;
