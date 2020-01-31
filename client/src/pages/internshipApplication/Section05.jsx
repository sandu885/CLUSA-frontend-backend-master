/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */

/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component, forwardRef } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBIcon, MDBTooltip, MDBNotification } from 'mdbreact';
import MaterialTable from 'material-table';
import axios from 'axios';
import { Redirect } from 'react-router';

import '../style.css';
import './internshipApplication.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';
import SidebarComponent from './Sidebar';

const tableIcons = {
  Add: forwardRef((props, ref) => (
    <AddBox
      {...props}
      ref={ref}
    />
  )),
  Check: forwardRef((props, ref) => (
    <Check
      {...props}
      ref={ref}
    />
  )),
  Clear: forwardRef((props, ref) => (
    <Clear
      {...props}
      ref={ref}
    />
  )),
  Delete: forwardRef((props, ref) => (
    <DeleteOutline
      {...props}
      ref={ref}
    />
  )),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight
      {...props}
      ref={ref}
    />
  )),
  Edit: forwardRef((props, ref) => (
    <Edit
      {...props}
      ref={ref}
    />
  )),
  Export: forwardRef((props, ref) => (
    <SaveAlt
      {...props}
      ref={ref}
    />
  )),
  Filter: forwardRef((props, ref) => (
    <FilterList
      {...props}
      ref={ref}
    />
  )),
  FirstPage: forwardRef((props, ref) => (
    <FirstPage
      {...props}
      ref={ref}
    />
  )),
  LastPage: forwardRef((props, ref) => (
    <LastPage
      {...props}
      ref={ref}
    />
  )),
  NextPage: forwardRef((props, ref) => (
    <ChevronRight
      {...props}
      ref={ref}
    />
  )),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft
      {...props}
      ref={ref}
    />
  )),
  ResetSearch: forwardRef((props, ref) => (
    <Clear
      {...props}
      ref={ref}
    />
  )),
  Search: forwardRef((props, ref) => (
    <Search
      {...props}
      ref={ref}
    />
  )),
  SortArrow: forwardRef((props, ref) => (
    <ArrowUpward
      {...props}
      ref={ref}
    />
  )),
  ThirdStateCheck: forwardRef((props, ref) => (
    <Remove
      {...props}
      ref={ref}
    />
  )),
  ViewColumn: forwardRef((props, ref) => (
    <ViewColumn
      {...props}
      ref={ref}
    />
  )),
};

class Section05 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingFiscalAgent: false,
      columns: [
        { title: 'Name of Elected Office/Gov. Agency', field: 'placementName' },
        { title: 'Number of Placements Confirmed', field: 'placementNumber' },
        { title: 'Number of Placements Likely', field: 'placementNumberLikely' },
      ],
      // this is members
      // data: [
      //   {
      //     placementName: 'David (example)',
      //     placementNumber: '2 (example)',
      //     placementNumberLikely: '5 (example)',
      //   },
      // ],
      data: [],
      // value for question 1.4, total has 8 sub question, q means question ===========================
      s5q1: null,
      s5q2: null,
      s5q3: null,

      // db data for previous submit ===========
      getS5q1: null,
      getS5q2: null,
      getS5q3: null,

      responseMessage: '',
      // save status ===========
      saveSuccess: false,
      // local storage ==========
      sessionToken: localStorage.getItem('sessionToken'),
      userName: localStorage.getItem('userName'),
      shouldRedirectToNext: false,
      shouldRedirectToPrevious: false,
      redirectToLogin: false,
      // disable save button after one click
      disableSaveButton: false,
    };
  }

  componentDidMount() {
    // get user input
    const getSectionInputAPI = '/api/getApplicationContentBySectionIndex';

    if (this.state.userName === null) {
      this.setState({
        logedin: false,
      });
      console.warn('section 5 logedin', this.state.logedin);
    } else {
      axios.post(
        getSectionInputAPI,
        { sessionToken: this.state.sessionToken,
          programType: '0',
          sectionIndex: '5' },
      ).then((response) => {
        if (response.data.message === 'Successfully get application content') {
          console.warn('section 5 get information successfully!', response.data);
          this.setState({
            getS5q1: response.data.content['1'],
            getS5q2: response.data.content['2'],
            getS5q3: response.data.content['3'],
          });
          const tableData = this.state.getS5q3.map((member) => {
            const ele = {};
            ele.placementName = member.placementName;
            ele.placementNumber = member.placementNumber;
            ele.placementNumberLikely = member.placementNumberLikely;
            return ele;
          });
          this.setState({
            data: tableData,
          });
        } else if (response.data.message === 'No saved application for this section') {
          console.warn('no saved history');
        } else {
          console.warn('section 5 Failed to save');
        }
        console.warn(response.data);
      }).catch((error) => {
        console.warn('section 5 error.response', error.response);
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.setState({
                redirectToLogin: true,
              });
            }
          }
        }
      });
    }
  }

  getData = (key, defaultValue = '') => {
    const data = this.state.responseMessage;
    return data[key] || defaultValue;
  }

  toNextPage = () => {
    this.setState({
      shouldRedirectToNext: true,
    });
  }

  toPreviousPage = () => {
    this.setState({
      shouldRedirectToPrevious: true,
    });
  }

  clickSaveBtn = () => {
    const saveAPI = '/api/saveApplicationContent';
    const currentComponent = this;
    console.warn('============== section 5 save data', this.state);
    console.warn('this.state.s5q1', this.state.s5q1);
    const finalS5q1 = this.state.s5q1 === null ? this.state.getS5q1 : this.state.s5q1;
    const finalS5q2 = this.state.s5q2 === null ? this.state.getS5q2 : this.state.s5q2;
    // const finalS5q3 = (this.state.data == undefined || this.state.data.length == 0 || this.state.data[0]['placementName'] == undefined) ? this.state.getS5q3 : this.state.data;
    const finalS5q3 = this.state.data;
    const formData = new FormData();

    console.warn('members in save', this.state.data);
    formData.append('sessionToken', this.state.sessionToken);
    formData.append('programType', '0');
    formData.append('sectionIndex', '5');
    formData.append('sectionContent', JSON.stringify(
      { 1: finalS5q1,
        2: finalS5q2,
        3: finalS5q3 },
    ));

    axios.post(
      saveAPI,
      formData,
    ).then((response) => {
      currentComponent.setState({
        responseMessage: response.data,
      });
      console.warn('response =======', response.data);
      if (response.data.message === 'Successfully save section content') {
        this.setState({
          saveSuccess: true,
          getS5q1: response.data.content['1'],
          getS5q2: response.data.content['2'],
          getS5q3: response.data.content['3'],
          disableSaveButton: true,
        });
        document.getElementById('internship-s5').reset();
        window.location.reload();
      } else {
        console.warn('section 5 Failed to save');
        alert('section 5 Failed to save, please try again');
      }
      // console.warn(this.state.responseMessage);
    }).catch((error) => {
      console.warn('section 5 error.response', error.response);
      if(error.response !== null && error.response !== undefined) {
        if( error.response.data !== null && error.response.data !== undefined ) {
          if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
            localStorage.clear();
            alert('Your login status was expired. Please login again.');
            this.setState({
              redirectToLogin: true,
            });
          }
        }
      }
    });
  }

  render() {
    const { columns, data, saveSuccess, redirectToLogin } = this.state;
    if (this.state.shouldRedirectToNext === true) return <Redirect to="/internship-application-section06" />;
    if (this.state.shouldRedirectToPrevious === true) return <Redirect to="/internship-application-section04" />;
    if (redirectToLogin === true) return <Redirect to="/login" />;

    return (

      <div className="bg-lightcolor">
        <div>
          { saveSuccess ? (
            <MDBContainer className="grey darken-3 p-3">
              <MDBNotification
                show
                fade
                autohide={5000} // by default = ∞ ms
                bodyClassName="p-5 font-weight-bold"
                iconClassName="text-primary"
                title="SECTION 5. Internship Placement"
                message="Save Successfully."
                style={{
                  position: 'fixed',
                  top: '50%',
                  right: '40%',
                  zIndex: 9999,
                }}
              />
            </MDBContainer>
          ) : null}
        </div>
        <HeaderComponent />
        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            {/* ----------- left navigation ----------- */}
            <MDBCol md="3">
              <div className="text-center mb-4 sticky-div">
                <SidebarComponent />
              </div>
            </MDBCol>
            {/* ----------- right main info section ----------- */}
            <MDBCol md="9">
              <MDBRow>
                <MDBCol
                  md="12"
                  className="text-center"
                >
                  <MDBCard>
                    <MDBCardBody className="mx-4">
                      <div className="text-left">
                        <h3 className="dark-grey-text mb-2">
                          <strong>PART A: Program Information</strong>
                        </h3>
                        <MDBRow className="mbottom0Imp">
                          <MDBCol md="10">
                            <h5>
                              <strong>SECTION 5. Internship Placement</strong>
                            </h5>
                          </MDBCol>
                          <MDBCol md="2">  <p className="redColor text-right">* Required</p></MDBCol>
                        </MDBRow>
                        <hr className="h4m0p10" />
                      </div>
                      {/* ----------- main questions ----------- */}
                      <div className="text-left">
                        <form
                          id="internship-s5"
                          className="form-all"
                        >
                          <label
                            className="font-weight-bold text-justify pb-3"
                          >
                            As part of the program, applicant organization is required to have performed outreach to elected offices or government agencies for internship placements, whether at the local, city, county, state, or federal levels. At the time of application, you are expected to have already outreached to elected offices or government agencies/departments for internship placements. <span className="redColor">You will need to provide proof of confirmation of internship placement prior to grant disbursement.</span>
                          </label>
                          {/* ----------- 5.1 ----------- */}
                          <label
                            htmlFor="internship-s5-q1"
                            className="font-weight-bold pt-1"
                          >
                            5.1.<span className="redColor">* </span>How many internship placements are you targeting to have in year 2020?
                            <input
                              type="number"
                              id="internship-s5-q1"
                              className="form-control mt-2"
                              defaultValue={this.state.getS5q1}
                              onChange={(e) => this.setState({ s5q1: e.target.value })}
                            />
                          </label>
                          {/* ----------- 5.2 ----------- */}
                          <label
                            htmlFor="internship-s5-q2"
                            className="font-weight-bold pt-3"
                          >
                            5.2.<span className="redColor">* </span>How many of the placements are confirmed to your best knowledge?
                            <input
                              type="number"
                              id="internship-s5-q2"
                              className="form-control mt-2"
                              defaultValue={this.state.getS5q2}
                              onChange={(e) => this.setState({ s5q2: e.target.value })}
                            />
                          </label>
                          {/* ----------- 5.3 ----------- */}
                          <label
                            htmlFor="internship-s5-q3"
                            className="font-weight-bold pt-3"
                          >
                            5.3.<span className="redColor">* </span>Please provide detailed placement information in the table below
                          </label>
                          {/* <h5 className="darkblueColor">Your previous input is:</h5>
                          <div>
                            <table id="placements">
                              <tbody>
                                <tr>
                                  <th>Name of Elected Office/Gov. Agency</th>
                                  <th>Number of Placements Confirmed</th>
                                  <th>Number of Placements Likely</th>

                                </tr>
                                {
                                  getS5q3 ? getS5q3.map((d) => (

                                    <tr
                                      key={d.placementName}
                                      className="darkblueColor"
                                    >
                                      <td>{d.placementName}</td>
                                      <td>{d.placementNumber}</td>
                                      <td>{d.placementNumberLikely}</td>
                                    </tr>
                                  )) : null
                                }
                              </tbody>
                            </table>
                            <hr />
                          </div> */}
                          <p className="color-gray">
                          Click <AddBox /> button beside search bar to add record to the table below. After you add a new record, please click the <Check /> mark on the left side of the data to save. To modify the record, click the <Edit /> mark, click the <DeleteOutline /> mark to delete record.  Click SAVE button before leave the page.
                          </p>
                          <MaterialTable
                            icons={tableIcons}
                            title="click '+' button to add new record"
                            // columns={this.state.columns}
                            // data={this.state.data}
                            columns={columns}
                            data={data}
                            options={{
                              // toolbar: false,
                              paging: false,
                              headerStyle: { background: '#f6f6f6', boxShadow: 'none' }, // change header padding
                            }}
                            editable={{
                              onRowAdd: (newData) => new Promise((resolve) => {
                                setTimeout(() => {
                                  resolve();
                                  this.setState((prevState) => {
                                    const data = [...prevState.data];
                                    data.push(newData);
                                    return { ...prevState, data };
                                  });
                                }, 600);
                              }),
                              onRowUpdate: (newData, oldData) => new Promise((resolve) => {
                                setTimeout(() => {
                                  resolve();
                                  if (oldData) {
                                    this.setState((prevState) => {
                                      const data = [...prevState.data];
                                      data[data.indexOf(oldData)] = newData;
                                      return { ...prevState, data };
                                    });
                                  }
                                }, 600);
                              }),
                              onRowDelete: (oldData) => new Promise((resolve) => {
                                setTimeout(() => {
                                  resolve();
                                  this.setState((prevState) => {
                                    const data = [...prevState.data];
                                    data.splice(data.indexOf(oldData), 1);
                                    return { ...prevState, data };
                                  });
                                }, 600);
                              }),
                            }}
                          />
                        </form>
                      </div>
                      {/* ----------- button group ----------- */}
                      <div className="text-center mb-3 mt-5">
                        <MDBRow>
                          {/*  ----------- previous button  ----------- */}
                          <MDBCol
                            md="2"
                            className="text-center"
                          >
                            <div style={{ display: 'flex' }}>
                              <MDBTooltip
                                placement="top"
                              >
                                <MDBBtn
                                  onClick={this.toPreviousPage}
                                  color="light-blue"
                                  rounded
                                  className="btn-block z-depth-1a"
                                >
                                  <MDBIcon
                                    icon="angle-double-left"
                                  />
                                </MDBBtn>
                                <div>
                                Previous
                                </div>
                              </MDBTooltip>
                            </div>
                          </MDBCol>

                          {/*  ----------- save button  ----------- */}
                          <MDBCol
                            md="8"
                            className="text-center"
                          >
                            <MDBBtn
                              gradient="aqua"
                              rounded
                              className="btn-block z-depth-1a"
                              onClick={this.clickSaveBtn}
                              disabled={this.state.disableSaveButton}
                            >
                              <MDBIcon
                                icon="save"
                                className="pr-3"
                              />
                              Save
                            </MDBBtn>
                          </MDBCol>
                          {/*  ----------- next button  ----------- */}
                          <MDBCol
                            md="2"
                            className="text-center"
                          >
                            <div style={{ display: 'flex' }}>
                              <MDBTooltip
                                placement="top"
                              >
                                <MDBBtn
                                  onClick={this.toNextPage}
                                  color="cyan"
                                  rounded
                                  className="btn-block z-depth-1a"
                                >
                                  <MDBIcon
                                    icon="angle-double-right"
                                  />
                                </MDBBtn>
                                <div>
                                Note: Please click SAVE first! Otherwise you will lose all the data history that you have filled on this page.
                                </div>
                              </MDBTooltip>
                            </div>
                          </MDBCol>
                        </MDBRow>
                      </div>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <FooterComponent />
      </div>
    );
  }
}

export default Section05;
