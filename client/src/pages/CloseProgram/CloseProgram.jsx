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
      isEdit: false,
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
      alert('Save Successfully');
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
    const { formData, programId, isEdit, closeNote = '' } = this.state;
    console.log(this.state, closeNote);

    let heading = 'Program Closing Report a';

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
        <MDBContainer>
          <MDBRow>
            <MDBCol md="12">
              <MDBCard>
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol md="12 pl-5 pr-5">
                      <MDBRow className="form-group font-weight-bold">
                        <MDBCol sm="12">
                          {isEdit ?
                            <textarea name="closeNote" className="form-control mt-2 mb-4" rows="8" value={closeNote} onChange={this.handleChange}/>
                            :
                            closeNote && closeNote
                          }
                        </MDBCol>
                      </MDBRow>

                      <MDBRow className="form-group font-weight-bold justify-content-center">
                        <MDBCol sm="12">
                          <MDBBtn rounded
                                  className="send-button second-action-button z-depth-1a check-file-upload"
                                  onClick={() => {
                                    this.setState({
                                      isEdit: !this.state.isEdit,
                                    })
                                  }}
                          >
                            Edit
                          </MDBBtn>                        
                          <MDBBtn rounded
                                  className="send-button second-action-button z-depth-1a check-file-upload"
                                  onClick={this.closeReport}
                          >
                            Save
                          </MDBBtn>                        
                          <MDBBtn rounded
                                  className="cancel-button second-action-button z-depth-1a check-file-upload"
                                  onClick={event => {
                                    this.props.history.push(`/program/${programId}`);
                                  }}
                          >
                            Cancel
                          </MDBBtn>
                        </MDBCol>
                      </MDBRow>
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
        debugger
        this.setState({
          programData: { ...response.data.program },
          closeNote: response.data.program && response.data.program.program.closeNote,
          dataReceived: true,
        });
        debugger
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
