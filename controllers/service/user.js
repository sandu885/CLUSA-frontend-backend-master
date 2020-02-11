const USER = require('../db/user');

// User signup
const signup = async (req, res) => {
    try {
      let message = await USER.signup(req.body, req.files);
      console.log(message);
      res.status(200).json({
        message
      });
    } catch(error) {
      console.log(error.message);
      res.status(400).json({
        message: error.message
      });
    }
};

// User login
const login = async (req, res) => {
    try {
        let user = await USER.login(req.body.username, req.body.password);
        console.log("User login success");
        res.status(200).json({
          userId: user.id,
          username: user.get('username'),
          orgName: user.get("orgName"),
          firstName: user.get('firstName'),
          lastName: user.get('lastName'),
          email: user.get('emailAddress'),
          phone: user.get('phone'),
          orgId: user.get("orgId"),
          status: user.get("status"),
          userType: user.get("userType"),
          sessionToken: user.get('sessionToken')
        });
    } catch(error) {
        console.log(error.message);
        res.status(400).json({
          message: error.message
        });
    }
}

// User logout
const logout = async (req, res) => {
  try {
    await USER.logout(req.body.sessionToken);
    console.log("Logout success");
    res.status(200).json({
      message: "Logout success"
    });
  } catch(error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    });
  }
}

// User forgetPassword
const forgetPassword = async (req, res) => {
  try {
    await USER.forgetPassword(req.body);
    res.status(200).json({
      message: "Reset link send successfully"
    });
  } catch(error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    });
  }
}

// User forgetPassword
const resetPassword = async (req, res) => {
  try {
    await USER.resetPassword(req.body);
    res.status(200).json({
      message: "Password updated successfully."
    });
  } catch(error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    });
  }
}
  
// User login with a sessionToken
const logger = async(req, res, next) => {
  try {
    req.body.user = await USER.logger(req.body.sessionToken);
    console.log("Logger...");
    next();
  } catch(error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
    });
  }
}

const checkSessionToken = async(req, res) => {
  try {
    let user = await USER.logger(req.body.sessionToken);
    console.log("Check session token");
    res.status(200).json({
      message: "Your session token is valid",
      user: user
    });
  } catch(error) {
    console.log(error.message);
    res.status(400).json({
      message: error.message
    });
  }
}

const fetchAllUsers = async(req, res) => {
  console.log("Fetching users start");
  try {
    let user = await USER.fetchAllUsers(req.body.user);
    console.log("Successfully fetch all Users");
    res.status(200).json({
      message: 'Successfully fetch all Users',
      users: user,
    });
  } catch(error) {
    console.log("fetchAllUsers: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
}

const findUserById = async(req, res) => {
  try {
    let user = await USER.findUserById(req.body);
    console.log("Successfully fetch User");
    res.status(200).json({
      message: 'Successfully fetch User',
      user,
    });
  } catch(error) {
    console.log("fetchUser: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
}

const updateUserById = async(req, res) => {
  try {
    let user = await USER.updateUserById(req.body);
    console.log("Successfully updated User");
    res.status(200).json({
      message: 'Successfully updated User',
      user,
    });
  } catch(error) {
    console.log("fetchUser: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const deleteUserById = async(req, res) => {
  try {
    let user = await USER.deleteUserById(req.body);
    console.log("Successfully updated User");
    res.status(200).json({
      message: 'Successfully updated User',
      user,
    });
  } catch(error) {
    console.log("fetchUser: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const createUserByAdmin = async(req, res) => {
  try {
    let user = await USER.createUserByAdmin(req.body);
    console.log("Successfully updated User");
    res.status(200).json({
      message: 'Successfully updated User',
      user,
    });
  } catch(error) {
    console.log("fetchUser: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
    signup,
    login,
    logout,
    logger,
    forgetPassword,
    resetPassword,
    fetchAllUsers,
    checkSessionToken,
    findUserById,
    updateUserById,
    createUserByAdmin,
    deleteUserById,
}
