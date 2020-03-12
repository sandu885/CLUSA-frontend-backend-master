import React, { Component } from 'react';
import {
  MDBBtn,
  MDBRow, MDBCol,
  MDBCardFooter
} from 'mdbreact';
import axios from 'axios';
import { cloneDeep } from 'lodash';

import { queryStringToJSON } from '../../utils/util'
import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import FinalReportView from '../FinalReport/FinalReportView';

import './comment.css';
import moment from "moment";
import HomeIcon from "@material-ui/icons/Home";
import {Link} from "react-router-dom";

class FinalReportComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionToken: localStorage.getItem('sessionToken'),
      dataReceived: false,
      programReportData: [],
      formData: {},
      userId: localStorage.getItem('clusa-user-id'),
      role: localStorage.getItem('clusa-role'),
      open: false,
    };
  }

  componentWillMount() {
    const { location, history } = this.props;

    const queryData = queryStringToJSON(location.search);
    if (!queryData.orgId && !queryData.programId) {
      alert('Not having proper data to access this route');
      history.goBack();
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
      type: 'finalReportView',
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

  toggleDeleteModal = () => {
    this.setState({
      deleteConfirm: !this.state.deleteConfirm,
    })
  }

  render() {
    const { formData, commentData = [], role, programId } = this.state;

    const fixFooter = <div className="comment-container">
      <MDBRow>
        <MDBCol md="12" style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            { role === '1' ?
              <MDBRow>
                <MDBCol md="12">
                <h3>All Comment</h3>
                </MDBCol>
              </MDBRow>
              :
              <MDBRow>
                <MDBCol md="8">
                  <h3>All Comment</h3>
                </MDBCol>
                <MDBCol md="4">
                  <h3>My Comment</h3>
                </MDBCol>
              </MDBRow>
            }

            {role === '1' ?
              <MDBRow>
                <MDBCol md="12" className="comment-view">
                  {commentData.map((cData, index) =>
                    <div key={cData.objectId + index}>
                      <p><strong><span className="">{cData.commentDate && moment(cData.commentDate).format('MM/DD/YYYY')} + {cData.username}:</span></strong><br></br>
                      {' '+ cData.note}</p>
                    </div>
                  )}

                </MDBCol>
              </MDBRow>
              :
              <MDBRow>
                <MDBCol md="8" className="comment-view">
                  {commentData.map((cData, index) =>
                    <div key={cData.objectId + index}>
                       <p><strong><span className="">{cData.commentDate && moment(cData.commentDate).format('MM/DD/YYYY')} + {cData.username}:</span></strong><br></br>
                      {' '+ cData.note}</p>
                    </div>
                  )}

                </MDBCol>
                <MDBCol md="4">
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
                  <MDBBtn rounded color="danger" className="application-info-button second-action-button z-depth-1a check-file-upload red-color"
                        onClick={() => {
                          const { history } = this.props;
                          history.push(`/program/${programId}`);
                        }}
                  >
                    Cancel
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
            }
            <MDBRow className="text-right">
              <MDBCol md="12" className="">
                <MDBBtn rounded className="second-action-button z-depth-1a check-file-upload mt-2"
                        onClick={() => {
                          const { history } = this.props;
                          history.push(`/program/${programId}`);
                        }}
                >
                  Back to Program Detail
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </div>
        </MDBCol>
      </MDBRow>
    </div>;

    const breadCrums = [{
      name: 'dashboard',
      child: <li key={`dashboard1`} className="breadcrumb-item"><HomeIcon/> <Link to={'/view-program'}>Program Management</Link></li>,
    }, {
      name: 'programView',
      child: <li key={`programView1`} className="breadcrumb-item"><Link to={`/program/${programId}`}> Program Detail</Link></li>,
    }, {
      name: 'finalReport',
      child: <li key={`finalReport`} className="breadcrumb-item active"> Final Report</li>,
    }];

    return (
      <div className="bg-withImage">
        <HeaderComponent breadCrums={breadCrums} />

        <FinalReportView {...this.props} fixFooter={fixFooter} />

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
        const commentData = response.data.comments.filter(e => e.type === 'finalReportView');
        const comment = commentData.find(e => e.userId === userId);
        this.state.commentData = cloneDeep(commentData);
        this.setState({
          commentData: cloneDeep(commentData),
          formData: cloneDeep(comment || {}),
          programStatus: cloneDeep(comment.program || {}),
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
        const commentData = response.data.comments.filter(e => e.type === 'finalReportView');
        const comment = commentData.find(e => e.userId === userId);
        this.state.commentData = cloneDeep(commentData);
        this.setState({
          commentData: cloneDeep(commentData),
          programStatus: cloneDeep(comment.program || {}),
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

export default FinalReportComment;
