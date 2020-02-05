import axios from 'axios';

const Auth = {
  isAuthenticated: false,
  userType: '',
  // authenticate process result===========================
  async authenticate() {
    console.warn('===========get Auth token', localStorage.getItem('sessionToken'));
    if (localStorage.getItem('sessionToken') !== null) {
      const checkSessionExpireAPI = '/api/checkSessionToken';
      await axios.post(
        checkSessionExpireAPI,
        { sessionToken: localStorage.getItem('sessionToken') },
      ).then((response) => {
        // ======================== valid ========================
        if (response.data.message === 'Your session token is valid') {
          this.isAuthenticated = true;
          if (response.data.user.userType === '0') this.userType = '0';
          if (response.data.user.userType === '1') this.userType = '1';
          console.warn('session token valid', this.isAuthenticated);
        } else if (response.data.message === 'sessionToken expired') { // ======================== expire ========================
          console.warn('sessionToken expired');
          localStorage.clear();
          this.isAuthenticated = false;
          alert('Your login status was expired, please login again.');
        }
      }).catch((error) => {
        console.warn(error.message);
      });
    } else {
      this.isAuthenticated = false;
      console.warn('authentication false');
    }
  },
  // get auth =========================
  async getAuth() {
    await this.authenticate();
    // Promise.resolve(this.isAuthenticated);
    return this.isAuthenticated;
  },
  // sign out ============================
  async signout() {
    const logoutAPI = '/api/logout';
    await axios.post(
      logoutAPI,
      { sessionToken: localStorage.getItem('sessionToken') },
    ).then((response) => {
      console.warn('responseMessage', response.data);
      // successfully logout ==========
      if (response.data.message === 'Logout success') {
        localStorage.clear();
        this.isAuthenticated = false;
        alert('Logout successfully');
        window.location.reload();
        this.redirectToLogin();
      }
    }).catch((error) => {
      console.warn(error.response);
      // alert('Something wrong happened, please try again.');
      localStorage.clear();
      this.isAuthenticated = false;
      window.location.reload();
      this.redirectToLogin();
    });
  },
  // get user Type ==================
  getUserType() {
    this.authenticate();
    // Promise.resolve(this.userType);
    return this.userType;
  },
  // redirect to login page ================
  redirectToLogin() {
    return (
      this.props.history.push('/login')
    );
  },
};

export default Auth;
