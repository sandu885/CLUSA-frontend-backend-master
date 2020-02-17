
const createNewCheck = async (meta, file) => {
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

  // return await queryOrg.first({useMasterKey: true});

  check.set("programId", meta.programId);
  check.set("orgId", meta.orgId);
  check.set("amount", meta.checkAmount);
  check.set("checkId", meta.checkId);
  check.set("date", meta.checkDate);
  // 1 first Check, 2 second Check and more 3 final check send
  // check.set("type", meta.checkType);

  // TODO FILE section
  if (file) {
    check.set("checkFile", file);
  }
  // TODO FILE section
  const checkSaved = await check.save(null,{useMasterKey: true});
  console.log('\n\nCheck saved in the database checkSaved', checkSaved, '\n\n');
  return checkSaved;
};

module.exports = {
  createNewCheck,
  fetchAllChecks,
  fetchAllChecksByOrgIdProgId,
  updateCheckById,
};
