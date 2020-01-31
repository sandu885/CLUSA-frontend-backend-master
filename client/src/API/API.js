/** Class representing all the API. */
const API = {
  loginAPI: '/api/login',
  logoutAPI: '/api/logout',
  orgInfoByIdAPI: '/api/getOrgInfo',
  updateOrgInfoAPI: '/api/updateOrgInfo',
  createNewProgramAPI: '/api/createNewProgram',
  fetchAllProgramsByUserIdAPI: '/api/fetchAllProgramsByUserId',
  fetchAllProgramsByOrgIdAPI: '/api/fetchAllProgramsByOrgId',
  fetchAllOrgsAPI: '/api/fetchAllOrgs',
  saveApplicationContentAPI: '/api/saveApplicationContent',
  submitApplicationAPI: '/api/submitApplication',
  applicationContentBySectionIndexAPI: '/api/getApplicationContentBySectionIndex',
  wholeApplicationAPI: '/api/getWholeApplication',
  certificateFileAPI: '/api/getCertificateFile',
  applicationFileBySectionIndexAPI: '/api/getApplicationFileBySectionIndex',
  checkSessionToken: '/api/checkSessionToken',

  /**
   * Get the login API
   * @returns {String} login API
   */
  getLoginAPI() {
    return this.loginAPI;
  },

  /**
   * Get the logout API
   * @returns {String} logout API
   */
  getLogoutAPI() {
    return this.logoutAPI;
  },

  /**
   * Get the info by organization id API
   * @returns {String} API
   */
  getOrgInfoByIdAPI() {
    return this.getOrgInfoByIdAPI;
  },

  /**
   * Get the update organization info API
   * @returns {String} API
   */
  getUpdateOrgInfoAPI() {
    return this.updateOrgInfoAPI;
  },

  /**
   * Get the create new application program API
   * @returns {String} API
   */
  getCreateNewProgramAPI() {
    return this.createNewProgramAPI;
  },

  /**
   * Get the all programs by user ID API
   * @returns {String} API
   */
  getFetchAllProgramsByUserIdAPI() {
    return this.fetchAllProgramsByUserIdAPI;
  },

  /**
   * Get the organization id all programs API
   * @returns {String} API
   */
  getFetchAllProgramsByOrgIdAPI() {
    return this.fetchAllProgramsByOrgIdAPI;
  },

  /**
   * Get the all organizations info API
   * @returns {String} API
   */
  getFetchAllOrgsAPI() {
    return this.fetchAllOrgsAPI;
  },

  /**
   * Get the iupdate application content API
   * @returns {String} API
   */
  getSaveApplicationContentAPI() {
    return this.saveApplicationContentAPI;
  },

  /**
   * Get the info by organization id API
   * @returns {String} API
   */
  getSubmitApplicationAPI() {
    return this.submitApplicationAPI;
  },

  /**
   * Get the application infomation by section index API
   * @returns {String} API
   */
  getApplicationContentBySectionIndexAPI() {
    return this.getApplicationContentBySectionIndexAPI;
  },

  getWholeApplicationAPI() {
    return this.getWholeApplicationAPI;
  },

  getCertificateFileAPI() {
    return this.getCertificateFileAPI;
  },

  getApplicationFileBySectionIndexAPI() {
    return this.getApplicationFileBySectionIndexAPI;
  },

  getCheckSessionToken() {
    return this.checkSessionToken;
  },
  /**
   * Redirect current page to Login page
   */
  redirectToLogin() {
    return (
      this.props.history.push('/login')
    );
  },

};


export default API;
