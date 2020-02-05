/* eslint-disable dot-notation */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component, forwardRef } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn } from 'mdbreact';
import MaterialTable from 'material-table';
import axios from 'axios';
import { Redirect } from 'react-router';

import '../style.css';
import './register.css';
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

class RegisterCLUSA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // table section ===========
      showingFiscalAgent: false,
      columns: [
        { title: 'Name', field: 'name' },
        { title: 'Board Title', field: 'boardTitle' },
        { title: 'Professional Affiliation', field: 'professionalAffiliation' },
        { title: 'Phone', field: 'phone' },
        { title: 'Email', field: 'email' },
      ],
      // this is members:[],
      data: [
        { name: 'David (example)', boardTitle: 'president (example)', professionalAffiliation: 'international trade (example)', phone: '123-456-7890 (example)', email: 'david@gmail.com (example)' },
      ],
      // form info =============
      username: null,
      password: null,
      orgName: null,
      orgRegion: null,
      orgType: null,
      orgTypeNote: null,
      certificate: null,
      address1: null,
      address2: null,
      city: null,
      state: null,
      zipcode: null,
      firstName: null,
      lastName: null,
      title: null,
      phone: null,
      email: null,
      mission: null,
      year: null,
      programInfo: null,
      linkedin: null,
      web: null,
      otherInfo: null,
      agree: false,
      userType: '1',
      // responseMessage =================
      responseMessage: '',
      shouldRedirect: false,
      // input check error message
      errors: {},
      usernameInputError: true,
      passwordInputError: true,
      orgNameInputError: true,
      orgRegionInputError: true,
      orgTypeInputError: true,
      certificateInputError: true,
      address1InputError: true,
      cityInputError: true,
      stateInputError: true,
      zipcodeInputError: true,
      firstNameInputError: true,
      lastNameInputError: true,
      titleInputError: true,
      phoneInputError: true,
      emailInputError: true,
      missionInputError: true,
      membersInputError: true,
      yearInputError: true,
      programInfoInputError: true,
      agreeInputError: true,
    };
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.clickSubmitBtn = this.clickSubmitBtn.bind(this);
  }

  async componentDidMount() {
    console.warn('start');
  }

  getData(key, defaultValue = '') {
    const data = this.state.responseMessage;
    return data[key] || defaultValue;
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleValidation() {
    // const {fields} = this.state;
    const errors = {};
    let formIsValid = true;

    // username
    if (this.state.username === null) {
      formIsValid = false;
      errors['name'] = 'Username Cannot be empty';
      this.setState({
        usernameInputError: true,
      });
    } else {
      errors['name'] = 'no errors';
    }

    // password
    if (this.state.password === null) {
      formIsValid = false;
      errors['password'] = 'Password Cannot be empty';
      this.setState({
        passwordInputError: true,
      });
    }

    // if (typeof fields.name !== 'undefined') {
    //   if (!fields.name.match(/^[a-zA-Z]+$/)) {
    //     formIsValid = false;
    //     errors.name = 'Only letters';
    //   }
    // }

    // if (typeof fields.email !== 'undefined') {
    //   const lastAtPos = fields.email.lastIndexOf('@');
    //   const lastDotPos = fields.email.lastIndexOf('.');

    //   if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields.email.indexOf('@@') == -1 && lastDotPos > 2 && (fields.email.length - lastDotPos) > 2)) {
    //     formIsValid = false;
    //     errors.email = 'Email is not valid';
    //   }
    // }

    this.setState({ errors });
    return formIsValid;
  }

  clickSubmitBtn() {
    const submitRegistrationAPI = '/api/signup';
    const currentComponent = this;
    console.warn(this.state);
    const formData = new FormData();
    const members = this.state.data;

    formData.append('username', this.state.username);
    formData.append('password', this.state.password); //
    formData.append('userType', '0');

    if (this.handleValidation()) {
      axios.post(
        submitRegistrationAPI,
        formData,
      ).then((response) => {
        currentComponent.setState({
          responseMessage: response.data,
        });
        console.warn('reponse message', response.data);
        console.warn('console finish');
        // ======================== success ========================
        if (this.getData('message') === 'User signup success') {
          alert('Form submitted, signup success');
          this.setState({
            shouldRedirect: true,
          });
        }
      }).catch((error) => {
        console.warn('error.response', error.response);
        // alert(error);
      });
      // ======================== input validation ========================
    } else {
      alert('Please fill out all the required sections.');
    }
  }

  render() {
    if (this.state.shouldRedirect === true) return <Redirect to="/login" />;
    return (
      <div className="bg-lightcolor">
        <HeaderComponent />
        <MDBContainer className="pt-5 mb-5">
          <MDBRow>
            <MDBCol
              md="12"
              className="text-center"
            >
              <MDBCard>
                <MDBCardBody className="mx-4">
                  <div className="greyBG text-center pt-2 pb-2">
                    Account Registration Information
                  </div>
                  <div className="pt-4 text-left">
                    <form
                      id="register-account"
                      className="form-all"
                    >
                      {/* ----------- username ----------- */}
                      <label
                        htmlFor="register-username"
                        className="dark-grey-text font-weight-light"
                      ><span className="redColor">* </span>Username
                        <input
                          type="text"
                          name="username"
                          id="register-username"
                          className={this.state.usernameInputError ? 'form-control errorInput' : 'form-control'}
                          value={this.state.username}
                          // onChange={this.handleChange.bind(this); this.setState({ usernameInputError: false })}
                          onChange={(e) => { this.handleChange(e); this.setState({ usernameInputError: false }); }}
                          required
                        />
                      </label>
                      <br />
                      {/* ----------- password ----------- */}
                      <label
                        htmlFor="register-password"
                        className="dark-grey-text
                        font-weight-light pt-2"
                      ><span className="redColor">* </span>Password
                        <input
                          type="text"
                          id="register-password"
                          name="password"
                          className={this.state.passwordInputError ? 'form-control errorInput' : 'form-control'}
                          value={this.state.password}
                          onChange={(e) => { this.handleChange(e); this.setState({ passwordInputError: false }); }}
                          required
                        />
                      </label>
                    </form>
                  </div>
                  {/* ----------- submit button ----------- */}
                  <div className="text-center mb-3 mt-5">
                    <MDBBtn
                      type="button"
                      gradient="blue"
                      rounded
                      className="btn-block z-depth-1a"
                      onClick={this.clickSubmitBtn}
                    >
                      Submit
                    </MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            {/* <MDBCol md="1" /> */}
          </MDBRow>
        </MDBContainer>
        <FooterComponent />
      </div>
    );
  }
}

export default RegisterCLUSA;
