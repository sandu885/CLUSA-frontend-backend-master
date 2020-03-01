/* eslint-disable eqeqeq */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable dot-notation */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component, forwardRef } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBNotification } from 'mdbreact';
import MaterialTable from 'material-table';
import axios from 'axios';
import { Redirect } from 'react-router';

import '../style.css';
import './registerInfo.css';
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

class RegisterInfo extends Component {
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
      data: [],
      // sessionToken in local storage
      sessionToken: localStorage.getItem('sessionToken'),
      role: localStorage.getItem('clusa-role'),
      showOrgTypeOther: false,
      // form info =============
      orgName: '',
      orgRegion: '',
      parentOrg: '',
      orgType: '',
      selectedFile1: null,
      selectedFile2: null,
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipcode: '',
      firstName: '',
      lastName: '',
      title: '',
      phone: '',
      email: '',
      mission: '',
      year: '',
      programInfo: '',
      linkedin: '',
      web: '',
      otherInfo: '',
      agree: true,
      members: '',
      getMembers: '',

      // input check error message ==================
      errors: {},
      usernameInputError: false,
      passwordInputError: false,
      orgNameInputError: false,
      orgRegionInputError: false,
      orgTypeInputError: false,
      certificateInputError: false,
      address1InputError: false,
      cityInputError: false,
      stateInputError: false,
      zipcodeInputError: false,
      firstNameInputError: false,
      lastNameInputError: false,
      titleInputError: false,
      phoneInputError: false,
      emailInputError: false,
      missionInputError: false,
      membersInputError: false,
      yearInputError: false,
      programInfoInputError: false,
      agreeInputError: false,
      // session expire redirect to login
      redirectToLogin: false,
      saveSuccess: undefined,
      redirectToAccount: false,
      redirectToCLUSAAccount: false,
    };
  }

  async componentDidMount() {
    // console.warn('org info start');
    const getOrginfoByIdAPI = '/api/getOrgInfoById';

    // organization call
    if (localStorage.getItem('orgId') === undefined || localStorage.getItem('orgId') === null) {
      // get all registration info
      try {
        const response = await axios({
          method: 'post',
          url: getOrginfoByIdAPI,
          data: { sessionToken: this.state.sessionToken },
        });
        // ======================== success ========================
        if (response.data.message === 'Successfully get organization information') {
          console.warn('response =========', response.data);
          console.warn('response =========', response.data);
          await this.setState({
            username: response.data.info.organization.username,
            password: response.data.info.organization.password,
            backUpPassword: response.data.info.organization.password,
            orgName: response.data.info.organization.name,
            orgRegion: response.data.info.organization.region,
            orgType: response.data.info.organization.type,
            orgTypeNote: response.data.info.organization.note,
            selectedFile1: response.data.info.organization.certificate,
            selectedFile2: response.data.info.organization.mou,
            // getCertificate: response.data.info.organization.files.description,
            address1: response.data.info.organization.address1,
            address2: response.data.info.organization.address2,
            city: response.data.info.organization.city,
            state: response.data.info.organization.state,
            zipcode: response.data.info.organization.zipcode,
            firstName: response.data.info.user.firstName,
            lastName: response.data.info.user.lastName,
            title: response.data.info.user.title,
            phone: response.data.info.user.phone,
            email: response.data.info.user.email,
            mission: response.data.info.user.mission,
            year: response.data.info.user.year,
            getMembers: response.data.info.user.members, // need parse
            programInfo: response.data.info.user.programInfo,
            linkedin: response.data.info.user.linkedin,
            web: response.data.info.user.web,
            otherInfo: response.data.info.user.otherInfo,
            agree: true,
            parentOrg: response.data.info.organization.parentOrg,
          });
          if (this.state.orgType === '1' || this.state.orgType === '2') {
            this.setState({
              orgTypeNote: '',
            });
          }
          if (this.state.orgType === '1') {
            this.setState({
              selectedFile2: null,
            });
          }
          const tableData = this.state.getMembers.map((member) => {
            const ele = {};
            ele['name'] = member['name'];
            ele['boardTitle'] = member['boardTitle'];
            ele['professionalAffiliation'] = member['professionalAffiliation'];
            ele['phone'] = member['phone'];
            ele['email'] = member['email'];
            return ele;
          });
          this.setState({
            data: tableData,
          });
          console.warn('console org finish');
        } else {
          localStorage.clear();
          alert('Your login status was expired. Please login again.');
          this.setState({
            redirectToLogin: true,
          });
        }
      } catch (error) {
        console.warn('error.response', error.response);
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
      }
      // get certificate & mou info =================
      console.warn('selectedFile1 == ', this.state.selectedFile1);

      if (this.state.orgType !== '3') {
        if (this.state.selectedFile1) {
          await this.getUploadedFile('certificateFiles');
        }
        if (this.state.selectedFile2) {
          await this.getUploadedFile('mou');
        }
      }
    } else {
      // reviewer call ================================================
      // get all registration info
      try {
        const response = await axios({
          method: 'post',
          url: '/api/getOrgInfoById',
          data: { sessionToken: this.state.sessionToken,
            orgId: localStorage.getItem('orgId') },
        });
        // ======================== success ========================
        if (response.data.message === 'Successfully get organization information') {
          console.warn('response =========', response.data);
          await this.setState({
            username: response.data.info.organization.username,
            password: response.data.info.organization.password,
            orgName: response.data.info.organization.name,
            orgRegion: response.data.info.organization.region,
            orgType: response.data.info.organization.type,
            orgTypeNote: response.data.info.organization.note,
            selectedFile1: response.data.info.organization.certificate,
            selectedFile2: response.data.info.organization.mou,
            // getCertificate: response.data.info.organization.files.description,
            address1: response.data.info.organization.address1,
            address2: response.data.info.organization.address2,
            city: response.data.info.organization.city,
            state: response.data.info.organization.state,
            zipcode: response.data.info.organization.zipcode,
            firstName: response.data.info.user.firstName,
            lastName: response.data.info.user.lastName,
            title: response.data.info.user.title,
            phone: response.data.info.user.phone,
            email: response.data.info.user.email,
            mission: response.data.info.user.mission,
            year: response.data.info.user.year,
            getMembers: response.data.info.user.members, // need parse
            programInfo: response.data.info.user.programInfo,
            linkedin: response.data.info.user.linkedin,
            web: response.data.info.user.web,
            otherInfo: response.data.info.user.otherInfo,
            agree: true,
            parentOrg: response.data.info.organization.parentOrg,
          });
          const tableData = this.state.getMembers.map((member) => {
            const ele = {};
            ele['name'] = member['name'];
            ele['boardTitle'] = member['boardTitle'];
            ele['professionalAffiliation'] = member['professionalAffiliation'];
            ele['phone'] = member['phone'];
            ele['email'] = member['email'];
            return ele;
          });
          this.setState({
            data: tableData,
          });
          console.warn('console org finish');
        } else {
          localStorage.clear();
          alert('Your login status was expired. Please login again.');
          this.setState({
            redirectToLogin: true,
          });
        }
      } catch (error) {
        console.warn('error.response', error.response);
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
      }
      // get certificate & mou info =================
      console.warn('selectedFile1 == ', this.state.selectedFile1);


      if (this.state.orgType !== '3') {
        if (this.state.selectedFile1) {
          await this.getUploadedFile('certificateFiles');
        }
        if (this.state.selectedFile2) {
          await this.getUploadedFile('mou');
        }
      }
    }
  }

  getUploadedFile = async (fileType) => {
    console.warn('getUploadedFile start =======');
    let certificatelink = '';
    if (fileType === 'certificateFiles' && this.state.orgType === '1') certificatelink = 'previousTitle'; // type 1
    if (fileType === 'certificateFiles' && this.state.orgType === '2') certificatelink = 'previousTitle1'; // type 2
    if (fileType === 'mou') certificatelink = 'previousTitle2'; // type 2

    try {
      const sectionContent = {};
      sectionContent.sessionToken = this.state.sessionToken;
      sectionContent.fileType = fileType;
      sectionContent.orgId = localStorage.getItem('orgId');
      const response = await axios({
        method: 'post',
        url: '/api/getCertificateFile',
        data: sectionContent,
        responseType: 'blob',
      });
      console.warn('get certificate response', response.data);
      const link = document.createElement('a', { className: '', id: 'asd', style: { color: 'red', background: 'yellow' } }); let
        filename;
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches !== undefined && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      link.href = window.URL.createObjectURL(response.data);
      link.download = filename;
      link.innerText = filename;
      if (link !== undefined && link !== null) document.getElementById(certificatelink).appendChild(link);
    } catch(error) {
      console.warn('error.response', error.response);
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
    }
  }

  getData = (key, defaultValue = '') => {
    const data = this.state.responseOrganizationMessage;
    return data[key] || defaultValue;
  }

  uploadFileOnChangeHandler = (event) => {
    console.warn(event.target.files[0]);
    this.setState({
      certificate: event.target.files[0],
    });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleCheckboxChange = () => {
    this.setState({
      agree: !this.state.agree, // flip boolean value
      agreeInputError: !this.state.agreeInputError,
    }, () => {
    });
  }

  onChangeHandler1 = async (event) => {
    console.warn(event.target.files);
    if(this.state.selectedFile2 === null) {
      await this.setState({
        selectedFile1: event.target.files[0],
        orgType: '1',
        orgTypeNote: '',
      });
    } else {
      await this.setState({
        selectedFile1: event.target.files[0],
        orgType: '2',
        orgTypeNote: '',
      });
    }
    console.warn(this.state.selectedFile1);
    console.warn('current org type = ', this.state.orgType);
  }

  onChangeHandler2 = async (event) => {
    console.warn(event.target.files);
    await this.setState({
      selectedFile2: event.target.files[0],
      orgType: '2',
      orgTypeNote: '',
    });
    console.warn('current org type = ', this.state.orgType);
    console.warn(this.state.selectedFile2);
  }

  handleValidation = () => {
    // const {fields} = this.state;
    const errors = {};
    let formIsValid = true;

    // orgName
    if (this.state.orgName == undefined || this.state.orgName === '') {
      formIsValid = false;
      errors['orgName'] = 'Organization Name Cannot be empty';
      this.setState({
        orgNameInputError: true,
      });
    }

    // orgRegion
    if (this.state.orgRegion == undefined || this.state.orgRegion === '') {
      formIsValid = false;
      errors['orgRegion'] = 'Organization Region Cannot be empty';
      this.setState({
        orgRegionInputError: true,
      });
    }

    // // ‘certificate’
    // if (this.state.ce == undefined || this.state.password === '') {
    //   formIsValid = false;
    //   errors['certificate'] = 'Certificate Cannot be empty';
    //   this.setState({
    //     certificateInputError: true,
    //   });
    // }

    // ‘address1’
    if (this.state.address1 == undefined || this.state.address1 === '') {
      formIsValid = false;
      errors['address1'] = 'Address1 Cannot be empty';
      this.setState({
        address1InputError: true,
      });
    }

    // city
    if (this.state.city == undefined || this.state.city === '') {
      formIsValid = false;
      errors['city'] = 'City Cannot be empty';
      this.setState({
        cityInputError: true,
      });
    }

    // state
    if (this.state.state == undefined || this.state.state === '') {
      formIsValid = false;
      errors['state'] = 'State Cannot be empty';
      this.setState({
        stateInputError: true,
      });
    }

    // zipcode
    if (this.state.zipcode == undefined || this.state.zipcode === '') {
      formIsValid = false;
      errors['zipcode'] = 'Zipcode Cannot be empty';
      this.setState({
        zipcodeInputError: true,
      });
    }

    // firstName
    if (this.state.firstName == undefined || this.state.firstName === '') {
      formIsValid = false;
      errors['firstName'] = 'FirstName Cannot be empty';
      this.setState({
        firstNameInputError: true,
      });
    }

    // lastName
    if (this.state.lastName == undefined || this.state.lastName === '') {
      formIsValid = false;
      errors['lastName'] = 'LastName Cannot be empty';
      this.setState({
        lastNameInputError: true,
      });
    }

    // title
    if (this.state.title == undefined || this.state.title === '') {
      formIsValid = false;
      errors['title'] = 'Title Cannot be empty';
      this.setState({
        titleInputError: true,
      });
    }

    // phone
    if (this.state.phone == undefined || this.state.phone === '') {
      formIsValid = false;
      errors['phone'] = 'Phone Cannot be empty';
      this.setState({
        phoneInputError: true,
      });
    }

    // email
    if (this.state.email == undefined || this.state.email === '') {
      formIsValid = false;
      errors['email'] = 'Email Cannot be empty';
      this.setState({
        emailInputError: true,
      });
    }

    // mission
    if (this.state.mission == undefined || this.state.mission === '') {
      formIsValid = false;
      errors['mission'] = 'Mission Cannot be empty';
      this.setState({
        missionInputError: true,
      });
    }

    // year
    if (this.state.year == undefined || this.state.year === '') {
      formIsValid = false;
      errors['year'] = 'Year Cannot be empty';
      this.setState({
        yearInputError: true,
      });
    }

    // members
    if (this.state.data == undefined || this.state.data.length === 0) {
      formIsValid = false;
      errors['members'] = 'Members Cannot be empty';
      this.setState({
        membersInputError: true,
      });
    }

    // programInfo
    if (this.state.programInfo == undefined || this.state.programInfo === '') {
      formIsValid = false;
      errors['programInfo'] = 'Program information Cannot be empty';
      this.setState({
        programInfoInputError: true,
      });
    }

    // agree
    if (this.state.agree === false) {
      formIsValid = false;
      errors['agree'] = 'Agree Cannot be empty';
      this.setState({
        agreeInputError: true,
      });
    } else {
      errors['agree'] = '';
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

  clickSubmitBtn = () => {
    const submitRegistrationAPI = '/api/updateOrgInfo';
    const currentComponent = this;
    // console.warn(this.state);
    const formData = new FormData();
    const members = this.state.data;
    // let orgType = '';
    // if (this.state.selectedFile1 === null) orgType = '3';
    // else if (this.state.selectedFile2 === null) orgType = '1';
    // else orgType = '2';

    const { orgType } = this.state;

    formData.append('username', this.state.username);
    formData.append('password', this.state.password); //
    formData.append('orgName', this.state.orgName);
    formData.append('orgRegion', this.state.orgRegion);
    formData.append('orgType', orgType);
    // formData.append('orgType', this.state.orgType);
    formData.append('address1', this.state.address1);
    formData.append('address2', this.state.address2);
    formData.append('city', this.state.city);
    formData.append('state', this.state.state);
    formData.append('zipcode', this.state.zipcode); //
    formData.append('firstName', this.state.firstName);
    formData.append('lastName', this.state.lastName);
    formData.append('title', this.state.title);
    formData.append('phone', this.state.phone);
    formData.append('email', this.state.email);
    formData.append('mission', this.state.mission);
    formData.append('year', this.state.year); //
    formData.append('members', JSON.stringify(members));
    formData.append('programInfo', this.state.programInfo);
    formData.append('linkedin', this.state.linkedin);
    formData.append('web', this.state.web);
    formData.append('otherInfo', this.state.otherInfo);
    formData.append('agree', this.state.agree);
    formData.append('userType', '1');
    formData.append('parentOrg', this.state.parentOrg);
    formData.append('sessionToken', this.state.sessionToken);
    if (localStorage.getItem('orgId') !== null && localStorage.getItem('orgId') !== undefined) formData.append('orgId', localStorage.getItem('orgId'));
    if (orgType === '1' || orgType === '2')formData.append('certificate', this.state.selectedFile1);
    if (orgType === '2') formData.append('mou', this.state.selectedFile2);
    if (orgType === '3') formData.append('orgTypeNote', this.state.orgTypeNote);
    if (this.state.password) {
      if (this.state.password !== this.state.newpassword) {
        return alert('Password does not match.')
      }
      alert("You would get logout");
    }
    if (this.handleValidation()) {
      axios.post(
        submitRegistrationAPI,
        formData,
      ).then((response) => {
        this.state.username && localStorage.setItem('userName', this.state.username);
        currentComponent.setState({
          responseMessage: response.data,
        });
        console.warn('reponse message', response.data);
        // console.warn('console finish');
        // ======================== success ========================
        if (response.data.message === 'Successfully update organization information') {
          alert('Successfully update organization information');
          if (localStorage.getItem('orgId') === null || localStorage.getItem('orgId') === undefined) { // org call
            console.warn('organization submit');
            this.setState({
              saveSuccess: true,
              redirectToAccount: true,
            });
            this.setState({
              saveSuccess: true,
            });
          } else {
            console.warn('clusa submit');
            this.setState({
              saveSuccess: true,
            });
            this.props.history.push('/account')
          }
        }
        // window.location.reload();
      }).catch((error) => {
        console.warn('error.response', error);
        if(error.response !== null && error.response !== undefined) {
          if( error.response.data !== null && error.response.data !== undefined ) {
            if (error.response.data.message === 'sessionToken expired' || error.response.data.message === 'No sessionToken') {
              localStorage.clear();
              alert('Your login status was expired. Please login again.');
              this.setState({
                redirectToLogin: true,
              });
            } else if (error.response.data.message === 'No certificate file') {
              alert('Please select certificate file.');
            }
            else if (error.response.data.message == 'Username not available') {
              alert('Username not available');
            }
          }
        }
      });
      // ======================== input validation ========================
    } else {
      alert('Please fill out all the required sections.');
    }
  }

  checkUpload = () => {
    if (this.state.selectedFile1 === null && this.state.selectedFile2 === null) return false;
    return true;
  }


  render() {
    const { columns, data } = this.state;
    // const { getMembers } = this.state;
    const { saveSuccess } = this.state;
    if (this.state.redirectToLogin === true) return <Redirect to="/login" />;
    if (this.state.redirectToAccount === true) return <Redirect to="/account" />;
    if (this.state.redirectToCLUSAAccount === true) return <Redirect to="/clusa-account" />;

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
                title="Organization Infomation"
                message="Save Successfully."
                style={{
                  position: 'fixed',
                  // top: '90%',
                  bottom: '10px',
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
            <MDBCol
              md="12"
              className="text-center"
            >
              <MDBCard>
                <MDBCardBody className="mx-4">
                  <div className="text-center mb-4">
                    <h3 className="dark-grey-text mb-4">
                      <strong>Organization Information</strong>
                    </h3>
                    <p className="redColor text-right">* Required</p>
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
                          type="password"
                          id="register-password"
                          name="password"
                          className={this.state.passwordInputError ? 'form-control errorInput' : 'form-control'}
                          value={this.state.password}
                          onChange={(e) => { this.handleChange(e); this.setState({ passwordInputError: false }); }}
                          required
                        />
                      </label>
                      <br/>
                      {/* ----------- new password ----------- */}
                      <label
                        htmlFor="register-password"
                        className="dark-grey-text
                        font-weight-light pt-2"
                      >New Password
                        <input
                          type="password"
                          id="register-password"
                          name="newpassword"
                          className="form-control"
                          value={this.state.newpassword}
                          onChange={(e) => { this.handleChange(e); }}
                          required
                        />
                      </label>
                    </form>
                  </div>

                  {/* ----------- General Organization Information ----------- */}
                  <div className="greyBG text-center pt-2 pb-2 mt-4">
                    General Organization Information
                  </div>
                  <div className="pt-4 text-left">
                    <form
                      id="register-form"
                      className="form-all"
                    >
                      {/* ----------- Organization Name ----------- */}
                      <label
                        htmlFor="register-orgname"
                        className="dark-grey-text font-weight-light"
                      ><span className="redColor">* </span>Organization Name
                        <input
                          type="text"
                          id="register-orgname"
                          name="orgName"
                          className={this.state.orgNameInputError ? 'form-control errorInput' : 'form-control'}
                          defaultValue={this.state.orgName}
                          onChange={(e) => this.setState({ orgName: e.target.value })}
                        />
                      </label>
                      <br />
                      {/* ----------- parent org Name ----------- */}
                      <label
                        htmlFor="register-parentOrg"
                        className="dark-grey-text font-weight-light pt-2"
                      >Parent Organization(If this is a chapter of an organization, please list the parent organization name)
                        <input
                          type="text"
                          id="register-parentOrg"
                          name="parentOrg"
                          className="form-control"
                          defaultValue={this.state.parentOrg}
                          onChange={(e) => this.setState({ parentOrg: e.target.value })}
                        />
                      </label>
                      <br />
                      {/* ----------- Geographic Region Served ----------- */}
                      <label
                        htmlFor="register-region"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>Geographic Region Served
                        <input
                          type="text"
                          id="register-region"
                          name="orgRegion"
                          className={this.state.orgRegionInputError ? 'form-control errorInput' : 'form-control'}
                          defaultValue={this.state.orgRegion}
                          onChange={(e) => this.setState({ orgRegion: e.target.value })}
                        />
                      </label>
                      <br />
                      {/* ----------- Organization Type ----------- */}
                      <label className="dark-grey-text font-weight-light pt-2">
                        <span className="redColor">* </span>Organization Type
                      </label>
                      <p className="text-justify color-gray"> CLUSA is only able to award grants to 501(c)(3) organizations. If your organization is a 501(c)(3) organization, please answer the question 1.1. If your organization does not qualify under this classification, you may register if you are partnered with a 501(c)(3) organization as your fiscal agent under a memorandum of understanding (MOU). Please answer the question 1.2 upload both the MOU and fiscal agent’s 501(c)(3) certificate. FFor other organizations still interested in registering in our website，please answer the question 1.3.</p>
                      {/* ----------- options ----------- */}
                      {/* --------1.1------- */}
                      <label
                        htmlFor="register-type1"
                        className="dark-grey-text font-weight-light pt-2"
                      >
                        <MDBRow className="pl-4">
                          1.1. If your organization is non-profit 501(c)(3), please provide:
                        </MDBRow>
                        <MDBRow className="margin0">
                          <div className="btn btn-light btn-sm float-left ml-4">
                            <input
                              type="file"
                              name="file"
                              onChange={(this.onChangeHandler1)}
                            />
                          </div>
                          <div className="vertical-center">
                            <p className="regularsize">
                              <span className="redColor">* </span>Upload 501(c)(3) Certificate
                            </p>
                          </div>
                        </MDBRow>
                        <MDBRow className="pl-4"><p id="previousTitle"> previous upload: </p></MDBRow>
                      </label>
                      {/* --------1.2------- */}
                      <label
                        htmlFor="register-type2"
                        className="dark-grey-text font-weight-light pt-2"
                      >
                        <MDBRow className="pl-4">
                          1.2. If your organization incorporated with a fiscal agent that has 501(c)(3) status:, please provide:
                        </MDBRow>
                        <MDBRow className="margin0">
                          <div className="btn btn-light btn-sm float-left ml-4">
                            <input
                              type="file"
                              name="file"
                              onChange={(this.onChangeHandler1)}
                            />
                          </div>
                          <div className="vertical-center">
                            <p className="regularsize">
                              <span className="redColor">* </span>Upload Fiscal Agent’s 501(c)(3) Certificate
                            </p>
                          </div>
                        </MDBRow>
                        <MDBRow className="pl-4"><p id="previousTitle1"> previous upload: </p></MDBRow>
                        <MDBRow className="margin0">
                          <div className="btn btn-light btn-sm float-left ml-4">
                            <input
                              type="file"
                              name="file"
                              onChange={(this.onChangeHandler2)}
                            />
                          </div>
                          <div className="vertical-center">
                            <p className="regularsize">
                              <span className="redColor">* </span>Upload MOU
                            </p>
                          </div>
                        </MDBRow>
                        <MDBRow className="pl-4"><p id="previousTitle2"> previous upload: </p></MDBRow>
                      </label>

                      {/* --------1.3------- */}
                      <label
                        htmlFor="register-type3"
                        className="dark-grey-text font-weight-light pt-2"
                      >
                        <MDBRow className="pl-4">
                          1.3. If your organization is other type, please explain your status:
                        </MDBRow>
                        <input
                          type="text"
                          id="register-type3"
                          className="form-control"
                          name="orgTypeNote"
                          // disabled={this.checkUpload()}
                          value={this.state.orgTypeNote}
                          onChange={(e) => this.setState({ orgType: '3', selectedFile1: null, selectedFile2: null, orgTypeNote: e.target.value })}
                        />
                      </label>

                      {/* ----------- Address ----------- */}
                      <label
                        htmlFor="register-address1"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>Mailing Address Line 1
                        <input
                          type="text"
                          id="register-address1"
                          className={this.state.address1InputError ? 'form-control errorInput' : 'form-control'}
                          name="address1"
                          defaultValue={this.state.address1}
                          onChange={(e) => { this.handleChange(e); this.setState({ address1InputError: false }); }}
                        />
                      </label>
                      <label
                        htmlFor="register-address2"
                        className="dark-grey-text font-weight-light pt-2"
                      >Mailing Address Line 2
                        <input
                          type="text"
                          id="register-address2"
                          className="form-control"
                          name="address2"
                          defaultValue={this.state.address2}
                          onChange={this.handleChange.bind(this)}
                        />
                      </label>
                      <label
                        htmlFor="register-city"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>City
                        <input
                          type="text"
                          id="register-city"
                          className={this.state.cityInputError ? 'form-control errorInput' : 'form-control'}
                          name="city"
                          defaultValue={this.state.city}
                          onChange={(e) => { this.handleChange(e); this.setState({ cityInputError: false }); }}
                          required
                        />
                      </label>
                      <label
                        htmlFor="register-state"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>State/Province
                        <input
                          type="text"
                          id="register-state"
                          className={this.state.stateInputError ? 'form-control errorInput' : 'form-control'}
                          name="state"
                          defaultValue={this.state.state}
                          onChange={(e) => { this.handleChange(e); this.setState({ stateInputError: false }); }}
                          required
                        />
                      </label>
                      <label
                        htmlFor="register-zip"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>Postal/Zipcode
                        <input
                          type="text"
                          id="register-zip"
                          className={this.state.zipcodeInputError ? 'form-control errorInput' : 'form-control'}
                          name="zipcode"
                          defaultValue={this.state.zipcode}
                          onChange={(e) => { this.handleChange(e); this.setState({ zipcodeInputError: false }); }}
                          required
                        />
                      </label>
                      {/* ----------- Contact Section ----------- */}
                      <div className="greyBG text-center pt-2 pb-2 mt-4">
                        Contact Information
                      </div>
                      {/* ----------- Contact Name ----------- */}
                      <label
                        htmlFor="register-firstname"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>Contact First Name
                        <input
                          type="text"
                          id="register-firstname"
                          className={this.state.firstNameInputError ? 'form-control errorInput' : 'form-control'}
                          name="firstName"
                          defaultValue={this.state.firstName}
                          onChange={(e) => { this.handleChange(e); this.setState({ firstNameInputError: false }); }}
                          required
                        />
                      </label>
                      <label
                        htmlFor="register-lastname"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>Contact Last Name
                        <input
                          type="text"
                          id="register-lastname"
                          className={this.state.lastNameInputError ? 'form-control errorInput' : 'form-control'}
                          name="lastName"
                          defaultValue={this.state.lastName}
                          onChange={(e) => { this.handleChange(e); this.setState({ lastNameInputError: false }); }}
                          required
                        />
                      </label>
                      {/* ----------- Contact Title ----------- */}
                      <label
                        htmlFor="register-title"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>Contact Title
                        <input
                          type="text"
                          id="register-title"
                          className={this.state.titleInputError ? 'form-control errorInput' : 'form-control'}
                          name="title"
                          defaultValue={this.state.title}
                          onChange={(e) => { this.handleChange(e); this.setState({ titleInputError: false }); }}
                          required
                        />
                      </label>
                      {/* ----------- Phone Number ----------- */}
                      <label
                        htmlFor="register-phone"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>Phone Number
                        <input
                          type="tel"
                          id="register-phone"
                          className={this.state.phoneInputError ? 'form-control errorInput' : 'form-control'}
                          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                          placeholder="123-456-7890"
                          name="phone"
                          defaultValue={this.state.phone}
                          onChange={(e) => { this.handleChange(e); this.setState({ phoneInputError: false }); }}
                          required
                        />
                      </label>
                      {/* ----------- Contact Email ----------- */}
                      <label
                        htmlFor="register-email"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>Contact Email
                        <input
                          type="email"
                          id="register-email"
                          className={this.state.emailInputError ? 'form-control errorInput' : 'form-control'}
                          name="email"
                          defaultValue={this.state.email}
                          onChange={(e) => { this.handleChange(e); this.setState({ emailInputError: false }); }}
                          required
                        />
                      </label>
                      {/* ----------- Organization’s Mission Statement ----------- */}
                      <label
                        htmlFor="register-mission"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>Organization’s Mission Statement
                        <textarea
                          id="register-mission"
                          className={this.state.missionInputError ? 'form-control errorInput' : 'form-control'}
                          rows="4"
                          maxLength="250"
                          placeholder="250 max characters"
                          name="mission"
                          defaultValue={this.state.mission}
                          onChange={(e) => { this.handleChange(e); this.setState({ missionInputError: false }); }}
                          required
                        />
                      </label>
                      {/* ----------- Year Founded ----------- */}
                      <label
                        htmlFor="register-year"
                        className="dark-grey-text font-weight-light pt-2"
                      ><span className="redColor">* </span>Year Founded
                        <input
                          type="number"
                          id="register-year"
                          className={this.state.yearInputError ? 'form-control errorInput' : 'form-control'}
                          placeholder="Exple: 2000"
                          maxLength="4"
                          name="year"
                          defaultValue={this.state.year}
                          onChange={(e) => { this.handleChange(e); this.setState({ yearInputError: false }); }}
                          required
                        />
                      </label>
                      {/* ----------- Current Board Members ----------- */}
                      <label
                        className="dark-grey-text font-weight-light pt-1 pb-2"
                      ><span className="redColor">* </span>Current Board Members
                      </label>

                      <h6 className="pt-4 pb-4">To change your members, please refill the table below:</h6>
                      <p className="color-gray">
                        Click <AddBox /> button beside search bar to add record to the table below. After you add a new record, please click the <Check /> mark on the left side of the data to save. To modify the record, click the <Edit /> mark, click the<DeleteOutline /> mark to delete record.
                      </p>
                      <MaterialTable
                        icons={tableIcons}
                        title="click '+' button to add new record"
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
                      {/* 0: {name: "David (example)", boardTitle: "president (example)", professionalAffiliation: "international trade (example)", phone: "123-456-7890 (example)", email: "david@gmail.com */}

                      {/* ----------- Organization’s Programs ----------- */}
                      <label
                        htmlFor="register-program"
                        className="dark-grey-text font-weight-light pt-4"
                      ><span className="redColor">* </span>Programs, please list all programs your organization has (eg. Internship Program, Civic Leadership Forum, etc.) :
                        <textarea
                          id="register-program"
                          className={this.state.programInfoInputError ? 'form-control errorInput pt-2' : 'form-control pt-2'}
                          rows="4"
                          maxLength="250"
                          placeholder="250 max characters"
                          name="programInfo"
                          defaultValue={this.state.programInfo}
                          onChange={(e) => { this.handleChange(e); this.setState({ programInfoInputError: false }); }}
                          required
                        />
                      </label>
                      {/* ----------- Linkedin ----------- */}
                      <label
                        htmlFor="register-linkedin"
                        className="dark-grey-text font-weight-light pt-2"
                      >Chapter LinkedIn Profile URL
                        <input
                          type="url"
                          id="register-linkedin"
                          className="form-control"
                          name="linkedin"
                          defaultValue={this.state.linkedin}
                          onChange={this.handleChange.bind(this)}
                        />
                      </label>
                      {/* ----------- Website ----------- */}
                      <label
                        htmlFor="register-website"
                        className="dark-grey-text font-weight-light pt-2"
                      >Chapter Website URL
                        <input
                          type="url"
                          id="register-website"
                          className="form-control"
                          name="web"
                          defaultValue={this.state.web}
                          onChange={this.handleChange.bind(this)}
                        />
                      </label>
                      {/* ----------- Other Information ----------- */}
                      <label
                        htmlFor="register-other"
                        className="dark-grey-text font-weight-light pt-4"
                      >Other Information You Want Us To Know About Your Organization
                        <textarea
                          id="register-other"
                          className="form-control pt-2"
                          rows="4"
                          maxLength="250"
                          placeholder="250 max characters"
                          name="otherInfo"
                          defaultValue={this.state.otherInfo}
                          onChange={this.handleChange.bind(this)}
                        />
                      </label>
                      {/* ----------- Privacy Policy ----------- */}
                      <label
                        className="dark-grey-text font-weight-light pt-4"
                      ><span className="redColor">* </span>Privacy Policy
                      </label>
                      <div className="FixedHeightContainer">
                        <div className="Content color-gray pl-2 pr-2">
                          <p className="text-justify pt-1">
                            Protecting your private information is our priority. This Statement of Privacy applies to clusa.org and CLUSA and governs data collection and usage. For the purposes of this Privacy Policy, unless otherwise noted, all references to CLUSA include clusa.org, CLUSA and its affiliated programs. The CLUSA website is a civic leadership site. By using the CLUSA website, you consent to the data practices described in this statement.<br />
                            <br /><b>Collection of your Personal Information</b><br />
                            <br />In order to better provide you with products and services offered on our Site, CLUSA may collect personally identifiable information, such as, but not limited to your:<br />
                            <br /> - First and Last Name
                            <br /> - Mailing Address
                            <br />- E-mail Address
                            <br />- Phone Number
                          </p>

                          <p className="text-justify">CLUSA may also collect anonymous demographic information, which is not unique to you, such as your:
                            <br />- Age
                            <br />- Gender
                            <br />- Race
                          </p>

                          <p className="text-justify">We do not collect any personal information about you unless you voluntarily provide it to us. However, you may be required to provide certain personal information to us when you elect to use certain products or services available on the site. These may include: (a) registering for an account on our site; (b) entering a sweepstake or contest sponsored by us or one of our partners; (c) signing up for special offers from selected third parties; and/or (d) sending us an email message. To wit, we will use your information for, but not limited to, communicating with you in relation to services and/or products you have requested from us. We also may gather additional personal or non-personal information in the future.</p>

                          <p><b>Use of your Personal Information</b>
                            <br />CLUSA collects and uses your personal information to operate its website(s) and deliver the services you have requested.
                          </p>

                          <p className="text-justify">CLUSA may also use your personally identifiable information to inform you of other products or services available from CLUSA and its affiliates.</p>

                          <p><b>Sharing Information with Third Parties</b></p>
                          <p className="text-justify">CLUSA does not sell, rent or lease its customer lists to third parties.</p>

                          <p className="text-justify">CLUSA may share data with trusted partners to help perform statistical analysis, send you email or postal mail, or provide follow-up outreach. All such third parties are prohibited from using your personal information except to provide these services to CLUSA, and they are required to maintain the confidentiality of your information.</p>

                          <p className="text-justify">CLUSA may disclose your personal information, without notice, if required to do so by law or in the good faith belief that such action is necessary to: (a) conform to the edicts of the law or comply with legal process served on CLUSA or the site; (b) protect and defend the rights or property of CLUSA; and/or (c) act under exigent circumstances to protect the personal safety of users of CLUSA, or the public.</p>

                          <p><b>Automatically Collected Information</b></p>
                          <p className="text-justify">Information about your computer hardware and software may be automatically collected by CLUSA. This information can include: your IP address, browser type, domain names, access times and referring website addresses. This information is used for the operation of the service, to maintain quality of the service, and to provide general statistics regarding use of the CLUSA website.</p>

                          <p><b>Links</b></p>
                          <p className="text-justify">This website contains links to other sites. Please be aware that we are not responsible for the content or privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of any other site that collects personally identifiable information.</p>

                          <p><b>Children Under Thirteen</b></p>
                          <p className="text-justify">CLUSA does not knowingly collect personally identifiable information from children under the age of thirteen. If you are under the age of thirteen, you must ask your parent or guardian for permission to use this website.</p>

                          <p><b>E-mail Communications</b></p>
                          <p className="text-justify">From time to time, CLUSA may contact you via email for the purpose of providing announcements, alerts, confirmations, surveys, and/or other general communication.</p>

                          <p className="text-justify">If you would like to stop receiving Civic engagement related programs and great opportunities via email from CLUSA, you may opt-out of such communications by clicking the unsubscribe button on the bottom of our emails.</p>

                          <p><b>Changes to this Statement</b></p>
                          <p className="text-justify">CLUSA reserves the right to change this Privacy Policy from time to time. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your account, by placing a prominent notice on our site, and/or by updating any privacy information on this page. Your continued use of the Site and/or Services available through this Site after such modifications will constitute your: (a) acknowledgment of the modified Privacy Policy; and (b) agreement to abide and be bound by that Policy.</p>

                          <p><b>Contact Information</b></p>
                          <p className="text-justify">CLUSA welcomes your questions or comments regarding this Statement of Privacy. If you believe that CLUSA has not adhered to this Statement, please contact CLUSA at:</p>

                          <p className="text-justify">CLUSA
                            <br />2655 Campus Drive Suite 120
                            <br />San Mateo, California 94403<br />
                            <br />Email Address:
                            <br />ang@clusa.org<br />
                            <br />Telephone number:
                            <br />6504847113<br />
                            <br />Effective as of September 04, 2019
                          </p>
                        </div>
                      </div>
                      <label
                        htmlFor="register-agree"
                        className="dark-grey-text font-weight-light mt-2"
                      >
                        <span className="redColor pl-2">* </span>I agree
                      </label>

                      <br />
                      <p className="text-justify color-gray mt-4">By submitting your information, you acknowledge the following:<br />
                        <br />Registering for prequalification does not guarantee acceptance by our grant-issuing committee.<br />
                        <br />After registration，you can use your username and password to log in and proceed to grant application(s). You can also update your account information. Please keep your login credentials safe, do not share with people outside your organization. Any questions please contact CLUSA at&nbsp;
                        <a
                          href="mailto:info@clusa.org"
                          className="color-gray"
                        >info@clusa.org
                        </a>
                      </p>
                    </form>
                  </div>
                  {/* ----------- submit button ----------- */}
                  <div className="text-center mb-3 mt-5">
                    <MDBRow>
                      <MDBCol md="6">
                        <MDBBtn
                          color="blue-grey"
                          rounded
                          className="btn-block z-depth-1a"
                          // href={localStorage.getItem('orgId') !== undefined && localStorage.getItem('orgId') !== null ? '/clusa-account' : '/account'}
                          href={this.state.role == '3' ? '/user-organization-management' : localStorage.getItem('orgId') !== undefined && localStorage.getItem('orgId') !== null ? '/account'
                            : 'account'
                          }
                        >
                          {this.state.role == '3' ? 'Go Back' : 'Back To My Account'}
                        </MDBBtn>
                      </MDBCol>
                      <MDBCol md="6">
                        <MDBBtn
                          gradient="blue"
                          rounded
                          className="btn-block z-depth-1a"
                          onClick={this.clickSubmitBtn}
                        >
                        Save My Updates
                        </MDBBtn>
                      </MDBCol>
                    </MDBRow>

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

export default RegisterInfo;
