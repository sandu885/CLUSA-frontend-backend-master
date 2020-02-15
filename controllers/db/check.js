const createNewCheck = async (meta, res) => {
  console.log("createNewCheck: start");
  let Check = Parse.Object.extend("Check"), check = new Check();

  check.set("programId", meta.programId);
  check.set("orgId", meta.orgId);
  check.set("amount", meta.checkAmount);
  check.set("checkId", meta.checkId);
  check.set("date", meta.checkDate);
  check.set("type", meta.checkType);
  // 1 first Check, 2 second Check and more 3 final check send
  // TODO FILE section

  // TODO FILE section
  await check.save(null,{useMasterKey: true});
  return await check.save(null,{useMasterKey: true});
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

const updateCheckById = () => {

};

module.exports = {
  createNewCheck,
  fetchAllChecks,
  fetchAllChecksByOrgIdProgId,
  updateCheckById,
};
