/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBDataTable,
  MDBRow, MDBCol, MDBCard
} from 'mdbreact';
import axios from 'axios';
import { Link } from "react-router-dom";

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import './program.css'
import Loader from "react-loader-spinner";

class Program extends Component {
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
      programData: {},
      dataReceived: true,
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
    const { history } = this.props;
    const { formData, sessionToken, columns, programType } = this.state;
    let postData = formData;
    postData = {
      ...postData,
    };
    const fetchAllPrograms = '/api/fetchAllPrograms';
    try {
      const responseData = await axios({
        method: 'post',
        url: fetchAllPrograms,
        data: { ...postData, sessionToken },
      });

      const rows = (responseData.data.programs || []).map(row => {
        return {
          ...row,
          orgName: row.orgName && <Link to={`/org/${row.org.objectId}`}> {row.orgName} </Link>,
          programType: <Link to={`/program/${row.objectId}`}> { row.programType ? programType.find(pT => pT.value === row.programType).name : ''} </Link>
        }
      });

      this.setState({
        programData: {
          columns: [ ...columns ],
          rows: [ ...rows ]
        },
      });
      console.warn('console User finish');
    } catch (error) {
      if(error.response !== null && error.response !== undefined) {
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
    }
  };

  render() {
    const { formData: { organizationName = '', programType = '', status = '', year = '' }, role, programData, dataReceived } = this.state;

    let heading = '';
    switch (role) {
      case '0':
        heading = 'Grant Reviewer';
        break;
      case '2':
        heading = 'Grant Manager';
        break;
      case '3':
        heading = 'Admin Program View';
        break;
      default:
        heading = '';
        break;
    }

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBRow className="text-center p-3 user-org-management-header font-weight-bold">
                  <MDBCol>
                    {heading} Home Page
                  </MDBCol>
                </MDBRow>
                <MDBCardBody>
                  <MDBRow className="header-section">
                    <MDBCol md="1" />
                    <MDBCol md="10">
                      <MDBRow className="pt-4">
                        <MDBCol
                          md="2"
                          className="pt-3 font-weight-bold"
                        >Organization:
                        </MDBCol>
                        <MDBCol md="10">
                          <input type="text" name="organizationName" onChange={this.handleChange} className="form-control mt-2" value={organizationName} />
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol
                          md="2"
                          className="pt-3 font-weight-bold"
                        >Program:
                        </MDBCol>
                        <MDBCol md="4">
                          <select name="programType" className="browser-default custom-select form-control mt-2" value={programType} onChange={this.handleChange}>
                            <option>Choose Program</option>
                            <option value="0">Internship Grant</option>
                            <option value="1">Civic Leadership Forum Grant</option>
                            <option value="2">Capacity Building Grant</option>
                            <option value="3">Media Service Grant</option>
                            <option value="4">Website Development Grant</option>
                            <option value="5">Strategic Planning Grant</option>
                          </select>
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="pt-3 font-weight-bold"
                        >Status:
                        </MDBCol>
                        <MDBCol md="4">
                          <select name="status" className="browser-default custom-select form-control mt-2" value={status} onChange={this.handleChange}>
                            <option>Select Status</option>
                            <option value="applying">Applying</option>
                            <option value="applied">Applied</option>
                            <option value="inView">In View</option>
                            <option value="preparingAgreement">Preparing Agreement</option>
                            <option value="approve">Approved</option>
                            <option value="firstCheckSent">First Check Sent</option>
                            <option value="reportSubmitted">Report Submitted</option>
                            <option value="finalCheckSent">Final Check Sent</option>
                          </select>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow>
                        <MDBCol
                          md="2"
                          className="pt-3 font-weight-bold"
                        >Year:
                        </MDBCol>
                        <MDBCol md="4">
                          <input type="number" name="year" onChange={this.handleChange} className="form-control mt-2" value={year} />
                        </MDBCol>
                      </MDBRow>
                      <div className="pt-4 pb-4 text-center">
                        <MDBRow>
                          <MDBCol md="2"/>
                          <MDBCol md="10">
                            <MDBBtn
                              rounded
                              className="btn-block z-depth-1a"
                              disabled={dataReceived}
                              onClick={this.handleSearchPost}
                            >
                              Search
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol md="2"/>
                        </MDBRow>
                      </div>
                    </MDBCol>
                    <MDBCol md="1" />
                  </MDBRow>
                  <br />
                  <br />
                  <MDBRow>
                    <MDBCol md="1" />
                    <MDBCol md="10">
                      {dataReceived ?
                        <div style={{textAlign: 'center'}}>
                          <Loader type="BallTriangle" color="#4f4f4f" height={80} width={80}/>
                        </div>
                        :
                        <MDBDataTable
                          className="custom-table program-table"
                          striped
                          borderless
                          data={programData}
                          searching={false}
                          noBottomColumns
                          info={false}
                        />
                      }
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
    const fetchAllPrograms = '/api/fetchAllPrograms';
    const { programType } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllPrograms,
        {
          sessionToken: this.state.sessionToken,
        },
      ).then((response) => {
        const columns = [
          {
            label: 'Organization Name',
            field: 'orgName',
            sort: 'asc',
            width: 150
          },
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

        const rows = (response.data.programs || []).map(row => {
          return {
            ...row,
            orgName: row.orgName && <Link to={`/org/${row.org.objectId}`}> {row.orgName} </Link>,
            programType: <Link to={`/program/${row.objectId}`}> { row.programType ? programType.find(pT => pT.value === row.programType).name : ''} </Link>
          }
        })
        this.setState({
          programData: {
            columns: [ ...columns ],
            rows: [ ...rows ]
          },
          dataReceived: false,
          columns,
        });

      }).catch((error) => {
        this.setState({
          dataReceived: false,
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

export default Program;
