const FINALREPORT = require("../db/finalReport");

const createNewFinalReport = async (req, res) => {
  console.log("(createNewFinalReport: start", JSON.stringify(req.body), '\n\n');
  try {
    let finalReport = await FINALREPORT.createNewFinalReport(req.body, req.file);
    console.log("create new New Final Report success");
    res.status(200).json({
      message: "Final Report successfully creates",
      finalReportId: finalReport.id,
    });
  } catch(error) {
    console.log("createNewFinalReport: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const fetchAllFinalReports = async (req, res) => {
  console.log("fetchAllFinalReports: start");
  try {
    let finalReports = await FINALREPORT.fetchAllFinalReports(req.body.user);
    console.log("Successfully fetch all finalReports");
    res.status(200).json({
      message: 'Successfully fetch all finalReports',
      finalReports: finalReports,
    });
  } catch(error) {
    console.log("fetchAllFinalReports: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const fetchAllFinalReportByOrgIdProgId = async (req, res) => {
  console.log("fetchAllFinalReportByOrgIdProgId: start");
  try {
    let finalReport = await FINALREPORT.fetchAllFinalReportByOrgIdProgId(req.body);
    console.log("Successfully fetch a finalReport");
    res.status(200).json({
      message: 'Successfully fetch a finalReport',
      finalReport: finalReport,
    });
  } catch(error) {
    console.log("fetchAllFinalReportByOrgIdProgId: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const updateFinalReportById = async (req, res) => {
  console.log("updateFinalReportById: start");
  try {
    let finalReport = await FINALREPORT.updateFinalReportById(req.body, req.file);
    console.log("Successfully fetch all FinalReport");
    res.status(200).json({
      message: 'Successfully fetch all FinalReport',
      finalReport: finalReport,
    });
  } catch(error) {
    console.log("updateFinalReportById: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  createNewFinalReport,
  fetchAllFinalReports,
  fetchAllFinalReportByOrgIdProgId,
  updateFinalReportById,
};
