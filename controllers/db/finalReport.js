const PROGRAM = require('./program');
const TOOL = require('../tool/tool');

const createNewFinalReport = async (meta, file) => {
  // Validation Section STARTS
  console.log('\n\n\nJSON.stringify\n\n\n', JSON.stringify(meta));

  await PROGRAM.closeFinalCheckProgramValidationById(meta.programId);
  // Validation Section ENDS
  const programRecord = await PROGRAM.fetchProgramById(meta.programId);
  if (!programRecord)
    throw new Error('Provided data are not proper.');

  if (meta.role === '1') {
    let statusToCheck = ["preparingAgreement", "approved", "FirstCheckSent&ProgramOnGoing", "finalCheckSent"];
    if (!programRecord.get('status') || statusToCheck.includes(programRecord.get('status')) == false)
      throw new Error('Your application and placement is not verified. So, Please wait for the confirmation');
  }

  let FinalReport = Parse.Object.extend("FinalReport"), finalReport = new FinalReport();
  finalReport.set("q1", [meta.q1]);
  if (file) {
    finalReport.set("q2", [{ ...meta.q2, file }]);
  } else {
    finalReport.set("q2", [meta.q2]);
  }
  finalReport.set("q3", [meta.q3]);

  finalReport.set("programId", meta.programId);
  finalReport.set("orgId", meta.orgId);
  if (meta.isSubmitted === 'true') {
    finalReport.set("isSubmitted", 1);

    await updateProgramStatus(finalReport);
  } else if (meta.isSubmitted === 'false') {
    finalReport.set("isSubmitted", 0);
  } else {
    finalReport.set("isSubmitted", 0);
  }

  const finalReportSaved = await finalReport.save(null,{useMasterKey: true});
  console.log('\n\nFinal Report saved in the database finalReport', finalReportSaved, '\n\n');
  return finalReportSaved;
};

const fetchAllFinalReports = async (meta) => {
  let finalReport = new Parse.Query("FinalReport");
  finalReport.limit(10000);

  return await finalReport.find({useMasterKey: true});
};

const fetchAllFinalReportByOrgIdProgId = async (meta) => {
  if (!meta.orgId)
    throw new Error("No organization id");
  if (!meta.programId)
    throw new Error("No program id");

  let queryFinalReport = new Parse.Query("FinalReport");
  queryFinalReport.equalTo("orgId", meta.orgId);
  queryFinalReport.equalTo("programId", meta.programId);
  console.log(queryFinalReport);

  return await queryFinalReport.first({useMasterKey: true});
};

const updateProgramStatus = async (finalReport) => {
  let queryProgram = new Parse.Query('Program');
  queryProgram.equalTo("objectId", finalReport.get('programId'));
  let programRecord = await queryProgram.first({ useMasterKey: true });

  let queryUser = new Parse.Query('User');
  queryUser.equalTo("orgId", finalReport.get('orgId'));
  let userRecord = await queryUser.first({ useMasterKey: true });

  const queryOrg = new Parse.Query('Organization');
  queryOrg.equalTo("objectId", finalReport.get('orgId'));
  const orgRecord = await queryOrg.first({ useMasterKey: true });
  if (userRecord) {
    const message = `Dear ${userRecord.get('username')}, \n  \n
              \n All your program reports and final report have been submitted to us. We will
                  review them and send our final check if everything looks fine. \n
              \n Thank you, \n
              \n Best Regards, \n CLUSA`;
    // await TOOL.programStatusUpdate(userRecord.get('emailAddress'), userRecord.get('username'), programRecord.get('status'), 'reportSubmitted');
    await TOOL.sendEmailCustomMessage(userRecord.get('emailAddress'), message);

    await TOOL.programStatusUpdate('', '', programRecord.get('status'), 'reportSubmitted', orgRecord.get('name'));
  }

  programRecord.set("status", 'reportSubmitted');
  await programRecord.save(null, { useMasterKey: true });
};

const updateFinalReportById = async (meta, file) => {
  const programRecord = await PROGRAM.fetchProgramById(meta.programId);
  if (!programRecord)
    throw new Error('Provided data are not proper.');

  if (meta.role === '1') {
    let statusToCheck = ["preparingAgreement", "approved", "FirstCheckSent&ProgramOnGoing", "finalCheckSent"];
    if (!programRecord.get('status') || statusToCheck.includes(programRecord.get('status')) == false)
      throw new Error('Your application and placement is not verified. So, Please wait for the confirmation');
  }
  let queryFinalReport = new Parse.Query('FinalReport');
  queryFinalReport.equalTo("objectId", meta.objectId);
  let finalReport = await queryFinalReport.first({ useMasterKey: true });
  finalReport.set("q1", [meta.q1]);
  if (file) {
    finalReport.set("q2", [{ ...meta.q2, file }]);
  } else {
    finalReport.set("q2", [{ ...meta.q2, file: finalReport.get('q2')[0].file }]);
  }
  finalReport.set("q3", [meta.q3]);

  if (meta.isSubmitted == 'true') {
    finalReport.set("isSubmitted", 1);
    await updateProgramStatus(finalReport)
  } else if (meta.isSubmitted == 'false') {
    if (finalReport.get("isSubmitted") != '1') {
      finalReport.set("isSubmitted", 0);
    }
  } else {
    finalReport.set("isSubmitted", 0);
  }

  const finalReportSaved = await finalReport.save(null,{useMasterKey: true});
  console.log('\n\n FinalReport saved in the database finalReportSaved', finalReportSaved, '\n\n');
  return finalReportSaved;
};

module.exports = {
  createNewFinalReport,
  fetchAllFinalReports,
  fetchAllFinalReportByOrgIdProgId,
  updateFinalReportById,
};
