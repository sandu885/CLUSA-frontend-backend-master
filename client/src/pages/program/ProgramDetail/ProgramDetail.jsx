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
      programType,
      programData: {},
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

  render() {
    const { programData: { program = {}, application = [] }, programType, dataReceived } = this.state;
    const programName = programType.find(pT => pT.value === program.programType);

    const fifthSection = application.find(app => app.sectionIndex === "5");
    const firstSection = application.find(app => app.sectionIndex === "1");
    const tenthSection = application.find(app => app.sectionIndex === "10");
    let heading = 'Program Detail Page';

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <MDBContainer className="pt-5 mb-5">
          {dataReceived &&
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
                              Program:- <span> {programName && programName.name} </span>
                            </MDBRow>
                            <MDBRow>
                              Applied Date:- <span> {moment(program.createdAt).format('DD/MM/YYYY')} </span>
                            </MDBRow>
                            <MDBRow>
                              1st Check Date:- <span> 12/10/2019 </span>
                            </MDBRow>
                            <MDBRow>
                              Inter Placement #:- <span> {fifthSection && fifthSection.content['2'] || ''} </span>
                            </MDBRow>
                          </MDBCol>
                          <MDBCol md="4" className="program-detail-sub-header font-weight-bold">
                            <MDBRow>
                              Year:- <span> {firstSection && firstSection.content['1'] && firstSection.content['1'].programs && firstSection.content['1'].programs[0].startYear} </span>
                            </MDBRow>
                            <MDBRow>
                              Award Date:- <span> 12/10/2019 </span>
                            </MDBRow>
                            <MDBRow>
                              2nd Check Date:- <span> 12/10/2019 </span>
                            </MDBRow>
                            <MDBRow>
                              Actual Award Amount:- <span> {tenthSection.content['1'] && tenthSection.content['1'][0].budget || ''} </span>
                            </MDBRow>
                          </MDBCol>
                          <MDBCol md="3" className="program-detail-sub-header font-weight-bold">
                            <MDBRow>
                              Status:- <span style={{ textTransform: 'capitalize' }}> {program.status} </span>
                            </MDBRow>
                            <MDBRow>
                              Actual Award:- <span> {tenthSection.content['2'] && tenthSection.content['2']} </span>
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
          }

        </MDBContainer>
        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  componentDidMount() {
    const fetchProgramDetailById = '/api/fetchProgramDetailById';

    if (this.state.sessionToken) {
      axios.post(
        fetchProgramDetailById,
        {
          sessionToken: this.state.sessionToken,
          programId: this.props.match.params ? this.props.match.params.id : ''
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
        console.log('response.data', response.data);
        this.setState({
          programData: { ...response.data.program },
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
