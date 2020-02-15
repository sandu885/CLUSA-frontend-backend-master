const CHECK = require("../db/check");

const createNewCheck = async (req, res) => {
  console.log("createNewCheck: start");
  try {
    let check = await CHECK.createNewCheck(req.body, "0");
    console.log("create new check success");
    res.status(200).json({
      message: "Check successfully creates",
      checkId: check.id,
    });
  } catch(error) {
    console.log("createNewCheck: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const fetchAllChecks = async (req, res) => {
  console.log("fetchAllChecks: start");
  try {
    let checks = await CHECK.fetchAllChecks(req.body.user);
    console.log("Successfully fetch all checks");
    res.status(200).json({
      message: 'Successfully fetch all checks',
      checks: checks,
    });
  } catch(error) {
    console.log("fetchAllChecks: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const fetchAllChecksByOrgIdProgId = async (req, res) => {
  console.log("fetchAllChecks: start");
  try {
    let checks = await CHECK.fetchAllChecksByOrgIdProgId(req.body);
    console.log("Successfully fetch all checks");
    res.status(200).json({
      message: 'Successfully fetch all checks',
      checks: checks,
    });
  } catch(error) {
    console.log("fetchAllChecks: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const updateCheckById = async (req, res) => {
  console.log("fetchAllChecks: start");
  try {
    let checks = await CHECK.fetchAllChecksByOrgIdProgId(req.body);
    console.log("Successfully fetch all checks");
    res.status(200).json({
      message: 'Successfully fetch all checks',
      checks: checks,
    });
  } catch(error) {
    console.log("fetchAllChecks: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  createNewCheck,
  fetchAllChecks,
  fetchAllChecksByOrgIdProgId,
  updateCheckById,
};
