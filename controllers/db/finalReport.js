const createNewFinalReport = async (meta, file) => {
  console.log('\n\n\nJSON.stringify\n\n\n', JSON.stringify(meta));
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

  programRecord.set("status", 'reportSubmitted');
  await programRecord.save(null, { useMasterKey: true });
};

const updateFinalReportById = async (meta, file) => {
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
    finalReport.set("isSubmitted", 0);
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
