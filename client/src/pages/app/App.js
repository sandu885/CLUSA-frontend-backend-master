/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from '../login/Login';
import ResetPassword from '../login/ResetPassword';
import Register from '../login/Register';
import ForgetPassword from '../login/ForgetPassword';
import UserAccount from '../userAccount/Account';
import CLUSAAccount from '../userAccount/CLUSAAccount';

import InternshipInformation from '../internshipApplication/InternshipIformation';
import InternApp01 from '../internshipApplication/Section01';
import InternApp02 from '../internshipApplication/Section02';
import InternApp03 from '../internshipApplication/Section03';
import InternApp04 from '../internshipApplication/Section04';
import InternApp05 from '../internshipApplication/Section05';
import InternApp06 from '../internshipApplication/Section06';
import InternApp07 from '../internshipApplication/Section07';
import InternApp08 from '../internshipApplication/Section08';
import InternApp09 from '../internshipApplication/Section09';
import InternApp10 from '../internshipApplication/Section10';
import InternApp11 from '../internshipApplication/Section11';
import InternApp12 from '../internshipApplication/Section12';
import InternApp13 from '../internshipApplication/Section13';

// User Management
import UserOrganizationManagement from '../UserOrganizationManagement/UserOrganizationManagement';
import UserAccountManagement from '../userAccount/UserAccountManagement/UserAccountManagement';
import MyAccount from '../userAccount/MyAccount/MyAccount';

// Organization
import OrganizationView from '../orgInfo/OrganizationView/OrganizationView';

// Program
import Program from '../program/Program.jsx';
import ProgramDetail from '../program/ProgramDetail/ProgramDetail';

import Checks from '../AppInfo/Check/Checks';
import FinalCheck from '../AppInfo/Check/FinalCheck';
import AgreementPlacement from '../AppInfo/AgreementPlacement/AgreementPlacement';
import SignedAgreementPlacement from '../AppInfo/AgreementPlacement/SignedAgreementPlacement';
import FinalReport from '../FinalReport/FinalReport';
import FinalReportView from '../FinalReport/FinalReportView';
import FinalReportComment from '../Comment/FinalReportComment';
import OrganizationComment from '../Comment/OrganizationComment';
import ProgramReport from '../ProgramReport/ProgramReport';
import CloseProgram from '../CloseProgram/CloseProgram';
import RecreateLogin from '../RecreateLogin/RecreateLogin';
import orgRegisterInfo from '../orgInfo/RegisterInfo';
import wholeApplicationInfo from '../wholeApplicationInfo/WholeApplication';

// Router
import { PrivateRoute, PublicRoute } from "./router";

import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import 'mdbreact/dist/css/mdb.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{ height: '100vh' }}>
          <PublicRoute
            path="/"
            exact
            component={Login}
          />

          <PublicRoute
            path="/login/"
            component={Login}
          />

          <PublicRoute
            path="/register/"
            component={Register}
          />

          <PublicRoute
            path="/forget-password/"
            component={ForgetPassword}
          />

          <Route
            path="/clusa-account/"
            component={CLUSAAccount}
          />

          <Route
            path="/account/"
            component={UserAccount}
          />
          {/* ------------------ organization register info section ------------------ */}
          <Route
            path="/organization-information/"
            component={orgRegisterInfo}
          />

          {/* ------------------ whole application info section ------------------ */}
          <Route
            path="/organization-application-information/"
            component={wholeApplicationInfo}
          />

          {/* ------------------ application section ------------------ */}
          <Route
            path="/internship-information/"
            component={InternshipInformation}
          />

          <Route
            path="/internship-application-section01/"
            component={InternApp01}
          />

          <Route
            path="/internship-application-section02/"
            component={InternApp02}
          />

          <Route
            path="/internship-application-section03/"
            component={InternApp03}
          />
          
          <Route
            path="/internship-application-section04/"
            component={InternApp04}
          />

          <Route
            path="/internship-application-section05/"
            component={InternApp05}
          />

          <Route
            path="/internship-application-section06/"
            component={InternApp06}
          />

          <Route
            path="/internship-application-section07/"
            component={InternApp07}
          />

          <Route
            path="/internship-application-section08/"
            component={InternApp08}
          />

          <Route
            path="/internship-application-section09/"
            component={InternApp09}
          />

          <Route
            path="/internship-application-section10/"
            component={InternApp10}
          />

          <Route
            path="/internship-application-section11/"
            component={InternApp11}
          />

          <Route
            path="/internship-application-section12/"
            component={InternApp12}
          />

          <Route
            path="/internship-application-section13/"
            component={InternApp13}
          />
          {/* ------------------ application section end------------------ */}
          <Switch>
            <PrivateRoute component={UserOrganizationManagement} path="/user-organization-management" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={UserAccountManagement} path="/user-account/:userId" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={UserAccountManagement} path="/user-account" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={MyAccount} path="/my-account" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={Program} path="/view-program" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={ProgramDetail} path="/program/:id" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={OrganizationView} path="/org" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={OrganizationView} path="/org/:id" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={Checks} path="/checks" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={FinalCheck} path="/final-check" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={AgreementPlacement} path="/agreement-placement" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={SignedAgreementPlacement} path="/signed-agreement-placement" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={FinalReport} path="/final-report" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={FinalReportView} path="/final-report-view" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={ProgramReport} path="/program-report" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={CloseProgram} path="/close-program" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={FinalReportComment} path="/final-report-comment" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={OrganizationComment} path="/app-review" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={ResetPassword} path="/reset-password" exact roles={['it-admin', 'reviewer']} />
            <PrivateRoute component={ResetPassword} path="/reset-password/:id" exact roles={['it-admin', 'reviewer']} />

            <Route component={RecreateLogin} path="/recreate-login" exact />
            {/*<PublicRoute component={RecreateLogin} path="/recreate-login" exact roles={['it-admin', 'reviewer']} />*/}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
