/* eslint-disable react/destructuring-assignment */
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

import { queryStringToJSON } from "../../utils/util";

class CloseProgram extends Component {
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
    const { location, history } = this.props;
    const queryData = queryStringToJSON(location.search);
    if (!queryData.orgId && !queryData.programId) {
      alert('Not having proper data to access this route')
      history.goBack();
    }
    this.setState({
      ...queryData,
    });
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

  closeReport = () => {
    const { sessionToken, role, closeNote = '', programId } = this.state;
    const { history } = this.props;

    if (!closeNote.trim()) {
      return alert('Please enter close report to close this program.')
    }

    const postData = {
      programId, role, closeNote, sessionToken
    };

    let closeProgramURL = '/api/updateProgramCloseStatusById';

    axios.post(
      closeProgramURL,
      {
        ...postData
      },
    ).then(() => {
      alert('Save successfully');
      history.push(`/program/${programId}`);
      // history.goBack();
    }).catch((error) => {
      if(error.response !== null && error.response !== undefined) {
        if( error.response.data !== null && error.response.data !== undefined ) {
          if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
            localStorage.clear();
            alert('Your login status was expired. Please login again.');
            this.props.history('/')
          } else {
            alert('Something went wrong please contact our support system');
          }
        }
      }
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { formData, programId, role, closeNote } = this.state;
    console.log(this.state);

    let heading = 'Program Closing Report';

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
                    <MDBCol md="2" />
                    <MDBCol md="9">

                      <MDBRow className="form-group font-weight-bold">
                        <textarea name="closeNote" className="form-control mt-2 mb-4" rows="8" value={closeNote} onChange={this.handleChange}/>
                      </MDBRow>

                      <MDBRow className="form-group font-weight-bold">
                        <MDBCol sm="3"/>
                        <MDBCol sm="3">
                          <MDBBtn rounded size={"sm"}
                                  className="send-button second-action-button btn-block z-depth-1a check-file-upload"
                                  onClick={this.closeReport}
                          >
                            Save
                          </MDBBtn>
                        </MDBCol>
                        <MDBCol sm="3">
                          <MDBBtn rounded size={"sm"}
                                  className="cancel-button second-action-button btn-block z-depth-1a check-file-upload"
                                  onClick={event => {
                                    this.props.history.push(`/program/${programId}`);
                                  }}
                          >
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

  componentDidMount() {
    const fetchProgramDetailById = '/api/fetchProgramDetailById';

    if (this.state.sessionToken) {
      axios.post(
        fetchProgramDetailById,
        {
          sessionToken: this.state.sessionToken,
          programId: this.state.programId ? this.state.programId : ''
        },
      ).then((response) => {
        this.setState({
          programData: { ...response.data.program },
          closeNote: response.data.program && response.data.program.program.closeNote,
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

export default CloseProgram;
