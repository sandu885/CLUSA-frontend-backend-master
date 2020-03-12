const PROGRAM = require('./program');
const TOOL = require('../tool/tool');

const createNewCheck = async (meta, file) => {
  // Validation Section STARTS
  await PROGRAM.closeFinalCheckProgramValidationById(meta.programId);
  // Validation Section ENDS
  if (!meta.checkAmount)
    throw new Error('Please pass check amount.');
  if (!meta.checkId)
    throw new Error('Please pass check#.');
  if (!meta.checkDate)
    throw new Error('Please pass check date.');

  let Check = Parse.Object.extend("Check"), check = new Check();
  check.set("programId", meta.programId);
  check.set("orgId", meta.orgId);
  check.set("amount", meta.checkAmount);
  check.set("checkId", meta.checkId);
  check.set("date", meta.checkDate);
  // 1 first Check, 2 second Check and more 3 final check send
  check.set("type", meta.checkType);


  let queryProgram = new Parse.Query('Program');
  queryProgram.equalTo("objectId", meta.programId);

  let programRecord = await queryProgram.first({ useMasterKey: true });
  let queryUser = new Parse.Query('User');
  queryUser.equalTo("orgId", meta.orgId);
  let userRecord = await queryUser.first({ useMasterKey: true });

  const queryOrg = new Parse.Query('Organization');
  queryOrg.equalTo("objectId", meta.orgId);
  const orgRecord = await queryOrg.first({ useMasterKey: true });

  if (meta.checkType == '1') {
    await TOOL.programStatusUpdate(userRecord.get('emailAddress'), userRecord.get('username'), programRecord.get('status'), 'firstCheckSent');
    await TOOL.programStatusUpdate('', '', programRecord.get('status'), 'firstCheckSent', orgRecord.get('name'));
    programRecord.set("status", 'firstCheckSent');
  } else if (meta.checkType == '2') {
    await TOOL.programStatusUpdate(userRecord.get('emailAddress'), userRecord.get('username'), programRecord.get('status'), 'finalCheckSent');
    await TOOL.programStatusUpdate('', '', programRecord.get('status'), 'finalCheckSent', orgRecord.get('name'));
    programRecord.set("status", 'finalCheckSent');
  }
  await programRecord.save(null, { useMasterKey: true });

  // TODO FILE section
  if (file) {
    check.set("checkFile", file);
  }
  // TODO FILE section
  const checkSaved = await check.save(null,{useMasterKey: true});
  console.log('\n\nCheck saved in the database checkSaved', checkSaved, '\n\n');
  return checkSaved;
};

const fetchAllChecks = async (meta) => {
  let queryCheck = new Parse.Query("Check");
  queryCheck.limit(10000);

  return await queryCheck.find({useMasterKey: true});
};

const fetchAllChecksByOrgIdProgId = async (meta) => {
  if (!meta.orgId)
    throw new Error("No organization id");
  if (!meta.programId)
    throw new Error("No organization id");

  let queryCheck = new Parse.Query("Check");
  queryCheck.equalTo("orgId", meta.orgId);
  queryCheck.equalTo("programId", meta.programId);

  return await queryCheck.find({useMasterKey: true});
};

const updateCheckById = async (meta, file) => {
  // Validation Section STARTS
  await PROGRAM.closeFinalCheckProgramValidationById(meta.programId);
  // Validation Section ENDS
  if (!meta.checkAmount)
    throw new Error('Please pass check amount.');
  if (!meta.checkId)
    throw new Error('Please pass check#.');
  if (!meta.checkDate)
    throw new Error('Please pass check date.');

  console.log(meta);

  let queryCheck = new Parse.Query('Check');
  queryCheck.equalTo("objectId", meta.objectId);
  let check = await queryCheck.first({ useMasterKey: true });

  check.set("programId", meta.programId);
  check.set("orgId", meta.orgId);
  check.set("amount", meta.checkAmount);
  check.set("checkId", meta.checkId);
  check.set("date", meta.checkDate);
  // 1 first Check, 2 second Check and more 3 final check send
  // check.set("type", meta.checkType);
  // let queryProgram = new Parse.Query('Program');
  // queryProgram.equalTo("objectId", meta.programId);
  // let programRecord = await queryProgram.first({ useMasterKey: true });
  //
  // if (meta.checkType == '1') {
  //   if (programRecord.get('status') == '1') {
  //     programRecord.set("status", 'firstCheckSent');
  //   }
  // } else if (meta.checkType == '2') {
  //   programRecord.set("status", 'finalCheckSent');
  // }
  // await programRecord.save(null, { useMasterKey: true });

  // TODO FILE section
  if (file) {
    check.set("checkFile", file);
  }
  // TODO FILE section
  const checkSaved = await check.save(null,{useMasterKey: true});
  console.log('\n\nCheck saved in the database checkSaved');
  return checkSaved;
};

module.exports = {
  createNewCheck,
  fetchAllChecks,
  fetchAllChecksByOrgIdProgId,
  updateCheckById,
};
