import React, { Component } from 'react';
import {
  MDBBtn,
  MDBRow, MDBCol,
  MDBCardFooter
} from 'mdbreact';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import moment from 'moment';

import { queryStringToJSON } from '../../utils/util'
import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import WholeApplicationCommentView from '../wholeApplicationInfo/WholeApplicationCommentView';

import './comment.css';

class OrganizationComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      dataReceived: false,
      formData: {},
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
      open: false,
      deleteConfirm: false,
    };
  }

  componentWillMount() {
    const { location, history } = this.props;

    const queryData = queryStringToJSON(location.search);

    if (!queryData.orgId && !queryData.programId) {
      alert('Not having proper data to access this route')
      history.goBack();
    }
    if (queryData.orgId) {
      localStorage.setItem('orgId', queryData.orgId)
    }
    this.setState({
      ...queryData,
    });
  }

  validate = (data) => {
    if (!data.note) {
      alert('Please enter the comment');
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

  handleProgramChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  postProgramUpdateStatus = () => {
    const { history } = this.props;
    const { programStatus, programId, sessionToken, orgId } = this.state;

    if (!programStatus) {
      return alert('Please select the status for the program.')
    }
    const postCommentProgramStatusURL = '/api/updateCommentProgramStatus';

    const postData = {
      objectId: programId,
      orgId: orgId,
      status: programStatus,
      sessionToken,
    };

    axios.post(
      postCommentProgramStatusURL,
      postData,
    ).then((res) => {
      console.log('created program report successfully', res);
    }).catch((error) => {
      if (error.response !== null && error.response !== undefined) {
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
    });
  };

  postComment = () => {
    const { history } = this.props;
    const { formData, sessionToken, role, orgId, programId, userId } = this.state;

    if (!formData.objectId && this.validate(formData)) {
      return true
    }

    let postCommentURL = '/api/createNewComment';

    let postData = {};

    if (formData.objectId) {
      postCommentURL = '/api/updateCommentById';
      postData.objectId = formData.objectId
    } else {
      postCommentURL = '/api/createNewComment';
    }
    postData = {
      ...formData,
      sessionToken: sessionToken,
      orgId,
      programId,
      userId,
      role,
      type: 'appView',
    };

    try {
      axios.post(
        postCommentURL,
        postData,
      ).then((res) => {
        console.log('created program report successfully', res);
        this.fetchComments();
        this.setState({
          formData: {},
        });
      }).catch((error) => {
        if (error.response !== null && error.response !== undefined) {
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
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { formData, commentData = [], programStatus, role, programId } = this.state;

    const fixFooter = role == '1' ? null : <div className="comment-container">
      <MDBRow>
        <MDBCol md="12" style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            {role === '1' ?
              <MDBRow>
                <MDBCol md="12">
                  <h3>All Comment</h3>
                </MDBCol>
              </MDBRow>
              :
                <MDBRow>
                  <MDBCol md={(role === '3' || role === '2') ? "6" : "9"}>
                  <h3>All Comment</h3>
                  </MDBCol>
                  <MDBCol md="3">
                    <h3>My Comment</h3>
                  </MDBCol>
                  {(role === '3' || role === '2') &&
                  <MDBCol md="3">
                    <h3>Result</h3>
                  </MDBCol>
                  }
                </MDBRow>
            }

            {role === '1' ?
              <MDBRow>
                <MDBCol md="12" className="text-left">
                  {commentData.map((cData, index) =>
                    <div key={cData.objectId + index}>
                      <p><strong><span className="">{cData.commentDate && moment(cData.commentDate).format('MM/DD/YYYY')} + {cData.username}:</span> </strong><br></br>
                      {' '+ cData.note}</p>
                    </div>
                  )}
                </MDBCol>
              </MDBRow>
              :
              <MDBRow>
                <MDBCol md={(role === '3' || role === '2') ? "6" : "9"} className="text-left">
                  {commentData.map((cData, index) =>
                    <div key={cData.objectId + index}>
                      <p><strong> <span className="">{cData.username} &nbsp;&nbsp; {cData.commentDate && moment(cData.commentDate).format('MM/DD/YYYY')}</span></strong> <br></br>
                      {' '+ cData.note}</p>
                    </div>
                  )}
                </MDBCol>
                <MDBCol md="3">
                <textarea
                  style={{ width: '100%'}}
                  name="note"
                  onChange={this.handleChange}
                  value={formData.note}
                />
                  <MDBBtn rounded className="second-action-button z-depth-1a check-file-upload"
                          onClick={this.postComment}
                  >
                    Save
                  </MDBBtn>
                  <MDBBtn rounded color="danger" className="application-info-button second-action-button z-depth-1a check-file-upload "
                          onClick={() => {
                            const { history } = this.props;
                            history.push(`/program/${programId}`);
                          }}
                  >
                    Cancel
                  </MDBBtn>
                </MDBCol>
                {(role === '3' || role === '2') &&
                <MDBCol md="3">
                  <select name="programStatus" className="browser-default custom-select form-control" value={programStatus} onChange={this.handleProgramChange}>
                    <option>Select Status</option>
                    <option value="inView">In Review</option>
                    <option value="preparingAgreement">Preparing Agreement</option>
                    <option value="turnDown">Turn Down</option>
                  </select>
                  <MDBBtn rounded className="second-action-button z-depth-1a check-file-upload mt-2"
                          onClick={this.postProgramUpdateStatus}
                  >
                    Save
                  </MDBBtn>
                </MDBCol>
                }
              </MDBRow>
            }
            <MDBRow>
              <MDBCol md="9" />
              <MDBCol md="3" className="text-right">
                <MDBBtn rounded className="second-action-button z-depth-1a check-file-upload mt-2"
                        onClick={() => {
                          const { history } = this.props;
                          history.push(`/program/${programId}`);
                        }}
                >
                  Back to Account Dashboard
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </div>
        </MDBCol>
      </MDBRow>
    </div>;

    console.log('fixFooter', fixFooter);

    return (
      <div className="bg-withImage">
        <HeaderComponent />

        <WholeApplicationCommentView {...this.props} fixFooter={fixFooter} />

        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }

  fetchComments = () => {
    const fetchAllCommentByOrgIdProgId = '/api/fetchAllCommentByOrgIdProgId';
    const { orgId, programId, userId, sessionToken } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllCommentByOrgIdProgId,
        {
          sessionToken: sessionToken,
          orgId,
          programId,
        },
      ).then((response) => {
        const commentData = response.data.comments.filter(e => e.type === 'appView');
        const comment = commentData.find(e => e.userId === userId);
        this.state.commentData = cloneDeep(commentData);
        this.setState({
          commentData: cloneDeep(commentData),
          formData: cloneDeep(comment || {}),
          programStatus: cloneDeep(commentData),
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
  };

  fetchCommentsInterval = () => {
    const fetchAllCommentByOrgIdProgId = '/api/fetchAllCommentByOrgIdProgId';
    const { orgId, programId, sessionToken } = this.state;

    if (this.state.sessionToken) {
      axios.post(
        fetchAllCommentByOrgIdProgId,
        {
          sessionToken: sessionToken,
          orgId,
          programId,
        },
      ).then((response) => {
        const commentData = response.data.comments.filter(e => e.type === 'appView');
        this.state.commentData = cloneDeep(commentData);
        this.setState({
          commentData: cloneDeep(commentData),
          programStatus: cloneDeep(commentData),
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
            }
          }
        }
      });
    }
  };

  componentDidMount() {
    this.fetchComments();
    this.interval = setInterval(() => {
      this.fetchCommentsInterval();
    }, 15000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
}

export default OrganizationComment;
