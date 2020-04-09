import React, { Component } from 'react';
import {
  MDBContainer,
  MDBCardBody,
  MDBBtn,
  MDBDataTable,
  MDBRow, MDBCol, MDBCard
} from 'mdbreact';
import Loader from "react-loader-spinner";
import axios from 'axios';
import { Link } from "react-router-dom";
// import AddBox from '@material-ui/icons/AddBox';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import './program.css'
// import Person from "@material-ui/icons/Person";
import HomeIcon from "@material-ui/icons/Home";
import {roleBaseBreadCrumbHeading} from "../../utils/util";

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
    await this.setState({
      dataReceived: true
    });
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
        dataReceived: false,
      });
      console.warn('console User finish');
    } catch (error) {
      this.setState({
        dataReceived: true
      });
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
        heading = 'It Admin';
        break;
      default:
        heading = '';
        break;
    }

    // const headingBreadCrumbs = roleBaseBreadCrumbHeading(role);
    const currentPage = [{
      name: 'viewProgram',
      child: <li key={`viewProgram1`} className="breadcrumb-item"><HomeIcon /> <Link to={'/view-program'}>Program Management</Link></li>,
    }];
    const breadCrums = [{
      name: 'dashboard',
      child: <li key={`dashboard1`} className="breadcrumb-item active"><HomeIcon /> <Link to={'/view-program'}>{heading} Dashboard</Link></li>,
    }];

    return (
      <div className="bg-withImage">
        <HeaderComponent currentPage={[]} breadCrums={breadCrums} />
        <MDBContainer className="title-section">
          <MDBRow>
            <MDBCol
              md="8"
            >
              <h1>{heading}</h1>
            </MDBCol>
            <MDBCol
              md="4"
              className="text-right"
            >
              {/*<MDBBtn*/}
              {/*  rounded*/}
              {/*  className="second-action-button z-depth-1a add-new-user"                */}
              {/*>*/}
              {/*  <AddBox /> Add New User*/}
              {/*</MDBBtn>*/}
            </MDBCol>
          </MDBRow>            
        </MDBContainer>
        <MDBContainer className="pt-1 mb-2">
          <MDBRow className="header-section">
            <MDBCol md="12">
            <strong>Filter</strong>
            </MDBCol>
            <MDBCol md="2">
              <input type="text" name="organizationName" placeholder="Organization Name" onChange={this.handleChange} className="form-control mt-2" value={organizationName} />
            </MDBCol>
            <MDBCol md="3">
              <select name="programType" className="browser-default custom-select form-control mt-2" value={programType} onChange={this.handleChange}>
                <option value="">Choose Program</option>
                <option value="0">Internship Grant</option>
                <option value="1">Civic Leadership Forum Grant</option>
                <option value="2">Capacity Building Grant</option>
                <option value="3">Media Service Grant</option>
                <option value="4">Website Development Grant</option>
                <option value="5">Strategic Planning Grant</option>
              </select>
            </MDBCol>                
            <MDBCol md="3">
              <select name="status" className="browser-default custom-select form-control mt-2" value={status} onChange={this.handleChange}>
                <option value="">Select Status</option>
                <option value="applying">Applying</option>
                <option value="applied">Applied</option>
                <option value="inReview">In Review</option>
                <option value="preparingAgreement">Preparing Agreement</option>
                <option value="approve">Approved</option>
                <option value="FirstCheckSent&ProgramOnGoing">First Check Sent & Program On Going</option>
                <option value="reportSubmitted">Report Submitted</option>
                <option value="finalCheckSent">Final Check Sent</option>
                <option value="closed">Closed</option>
              </select>
            </MDBCol>
            <MDBCol md="2">
              <input type="number" placeholder="Year" name="year" onChange={this.handleChange} className="form-control mt-2" value={year} />
            </MDBCol>
            <MDBCol md="2" className="text-center">
              <MDBBtn
                rounded
                className="z-depth-1a"
                disabled={dataReceived}
                onClick={this.handleSearchPost}
              >
                Search
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <MDBContainer>
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>                
                <MDBCardBody>                 
                  <MDBRow>                    
                    <MDBCol md="12">
                      {dataReceived ?
                        <div style={{textAlign: 'center'}}>
                          <Loader type="BallTriangle" color="#4f4f4f" height={80} width={80}/>
                        </div>
                        :
                        <div className="table-responsive">
                          <MDBDataTable
                            className="custom-table program-table custom-table-org"
                            striped
                            borderless
                            data={programData}
                            searching={false}
                            noBottomColumns
                            info={false}
                          />
                        </div>
                      }
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

  linkToOrgPrograms(e, orgId) {
    if(e.pageX < 400 && e.relatedTarget == null) {
      this.props.history.push(`/org/${orgId}`);
    }
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
            orgName: row.orgName,
            clickEvent: (e) => this.linkToOrgPrograms(e, row.org.objectId),
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
