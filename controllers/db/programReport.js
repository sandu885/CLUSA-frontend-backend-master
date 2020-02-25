const moment = require('moment');

const createNewProgramReport = async (meta, file) => {
  console.log('\n\n\nJSON.stringify\n\n\n', JSON.stringify(meta));
  if (!file)
    throw new Error('File is not uploaded.');

  let ProgramReport = Parse.Object.extend("ProgramReport"), programReport = new ProgramReport();

  programReport.set('programId', meta.programId);
  programReport.set('orgId', meta.orgId);

  programReport.set('uploadDate', moment().format('L'));
  programReport.set('type', meta.type);

  if (file) {
    programReport.set("file", file);
  }

  const programReportSaved = await programReport.save(null,{useMasterKey: true});
  console.log('\n\nProgram Report saved in the database programReport', programReportSaved, '\n\n');
  return programReportSaved;
};

const fetchAllProgramReports = async (meta) => {
  let programReport = new Parse.Query("ProgramReport");
  programReport.limit(10000);

  return await programReport.find({useMasterKey: true});
};

const fetchAllProgramReportByOrgIdProgId = async (meta) => {
  if (!meta.orgId)
    throw new Error("No organization id");
  if (!meta.programId)
    throw new Error("No organization id");

  let queryProgramReport = new Parse.Query('ProgramReport');
  queryProgramReport.equalTo("orgId", meta.orgId);
  queryProgramReport.equalTo("programId", meta.programId);

  return await queryProgramReport.find({useMasterKey: true});
};

const updateProgramReportById = async (meta, file) => {
  let queryProgramReport = new Parse.Query('ProgramReport');
  queryProgramReport.equalTo("objectId", meta.objectId);
  let programReport = await queryProgramReport.first({ useMasterKey: true });

  if (file)
    programReport.set("file", file);

  programReport.set('uploadDate', moment().format('L'));

  const programReportSaved = await programReport.save(null,{useMasterKey: true});
  console.log('\n\n Program Report saved in the database program report', programReportSaved, '\n\n');
  return programReportSaved;
};

module.exports = {
  createNewProgramReport,
  fetchAllProgramReports,
  fetchAllProgramReportByOrgIdProgId,
  updateProgramReportById,
};
