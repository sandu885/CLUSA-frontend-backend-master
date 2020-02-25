const PROGRAMREPORT = require("../db/programReport");

const createNewProgramReport = async (req, res) => {
  console.log("createNewProgramReport(: start", JSON.stringify(req.body), '\n');
  try {
    let programReport = await PROGRAMREPORT.createNewProgramReport(req.body, req.file);
    console.log("create new New Program Report success");
    res.status(200).json({
      message: "Program Report successfully creates",
      programReportId: programReport.id,
    });
  } catch(error) {
    console.log("createNewProgramReport: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const fetchAllProgramReports = async (req, res) => {
  console.log("fetchAllProgramReports: start");
  try {
    let programReports = await PROGRAMREPORT.fetchAllProgramReports(req.body.user);
    console.log("Successfully fetch all programReports");
    res.status(200).json({
      message: 'Successfully fetch all programReports',
      programReports: programReports,
    });
  } catch(error) {
    console.log("fetchAllProgramReports: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const fetchAllProgramReportByOrgIdProgId = async (req, res) => {
  console.log("(: start");
  try {
    let programReport = await PROGRAMREPORT.fetchAllProgramReportByOrgIdProgId(req.body);
    console.log("Successfully fetch a programReport by programId");
    res.status(200).json({
      message: 'Successfully fetch a programReport by programId',
      programReport: programReport,
    });
  } catch(error) {
    console.log("fetchAllFinalReportByOrgIdProgId: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const updateProgramReportById = async (req, res) => {
  console.log("updateProgramReportById: start");
  try {
    let programReport = await PROGRAMREPORT.updateProgramReportById(req.body, req.file);
    console.log("Successfully update programReport");
    res.status(200).json({
      message: 'Successfully update all programReport',
      programReport: programReport,
    });
  } catch(error) {
    console.log("updateFinalReportById: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const deleteProgramReportById = async (req, res) => {
  console.log("deleteProgramReportById: start");
  try {
    let programReport = await PROGRAMREPORT.deleteProgramReportById(req.body);
    console.log("Successfully delete Program Report");
    res.status(200).json({
      message: 'Delete final report',
      programReport: programReport,
    });
  } catch(error) {
    console.log("updateProgramReportById: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  createNewProgramReport,
  fetchAllProgramReports,
  fetchAllProgramReportByOrgIdProgId,
  updateProgramReportById,
  deleteProgramReportById,
};
