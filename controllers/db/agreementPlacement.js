const moment = require('moment');
const PROGRAM = require('./program');
const TOOL = require('../tool/tool');

const createNewAgreementPlacement = async (meta, files) => {
  // Validation Section STARTS
  const programRecord = await PROGRAM.fetchProgramById(meta.programId);
  if (!programRecord)
    throw new Error('Provided data are not proper.');

  if (meta.role == '1') {
    if (!programRecord.get('status') || programRecord.get('status') !== 'preparingAgreement')
      throw new Error('Your application and placement is not verified. So, Please wait for the confirmation');
  }

  await PROGRAM.closeFinalCheckProgramValidationById(meta.programId);
  // Validation Section ENDS

  if (meta.role == '1') {
    if (!files['signedAgreement'] || files['signedAgreement'].length == 0)
      throw new Error('Please provide signed agreement file.');
    // if (!files['filledPlacement'] || files['filledPlacement'].length == 0)
    //   throw new Error('Please provide signed placement file.');
  }

  if (meta.role != '1') {
    if (!files['agreementTemplate'] || files['agreementTemplate'].length == 0)
      throw new Error('Please provide agreement file.');
    // if (!files['placementTemplate'] || files['placementTemplate'].length == 0)
    //   throw new Error('Please provide signed placement file.');
    // if (!files['finalFilledPlacement'] || files['finalFilledPlacement'].length == 0)
    //   throw new Error('Please provide final placement file.');
    if (!meta.status)
      throw new Error('Please Provide status');
  }

  let queryUser = new Parse.Query('User');
  queryUser.equalTo("orgId", meta.orgId);
  let userRecord = await queryUser.first({ useMasterKey: true });

  let AgreementPlacement = Parse.Object.extend("AgreementPlacement"), agreementPlacement = new AgreementPlacement();
  agreementPlacement.set("programId", meta.programId);
  agreementPlacement.set("orgId", meta.orgId);
  agreementPlacement.set("awardAmount", meta.awardAmount);
  if (files && files['signedAgreement'] && files['signedAgreement'].length > 0)
    agreementPlacement.set("signedAgreement", files['signedAgreement'][0]);
  if (files && files['filledPlacement'] && files['filledPlacement'].length > 0) {
    agreementPlacement.set("filledPlacement", files['filledPlacement'][0]);
    agreementPlacement.set("placementUploadDate", moment().format('L'));
  }

  if (files && files['agreementTemplate'] && files['agreementTemplate'].length > 0)
    agreementPlacement.set("agreementTemplate", files['agreementTemplate'][0]);
  if (files && files['placementTemplate'] && files['placementTemplate'].length > 0) {
    agreementPlacement.set("placementTemplate", files['placementTemplate'][0]);
  }
  if (files && files['finalFilledPlacement'] && files['finalFilledPlacement'].length > 0)
    agreementPlacement.set("finalFilledPlacement", files['finalFilledPlacement'][0]);

  // agreementPlacement.set("agreementTemplate", meta.agreementTemplate);
  // agreementPlacement.set("placementTemplate", meta.placementTemplate);
  // two row only 3 and 2
  if (meta.role === '3' || meta.role === '2') {
    // 0 pending and 1 approved
    agreementPlacement.set("status", meta.status || 0);

    let queryProgram = new Parse.Query('Program');
    queryProgram.equalTo("objectId", meta.programId);

    let programRecord = await queryProgram.first({ useMasterKey: true });

    await TOOL.programStatusUpdate(userRecord.get('emailAddress'), userRecord.get('username'), programRecord.get('status'), meta.status === '1' ? 'approved' : 'preparingAgreement');

    const queryOrg = new Parse.Query('Organization');
    queryOrg.equalTo("objectId", meta.orgId);
    const orgRecord = await queryOrg.first({ useMasterKey: true });
    await TOOL.programStatusUpdate('', '', programRecord.get('status'), meta.status === '1' ? 'approved' : 'preparingAgreement', orgRecord.get('name'));
    programRecord.set("status", meta.status === '1' ? 'approved' : 'preparingAgreement');

    await programRecord.save(null, { useMasterKey: true });
  }

  const agreementPlacementSaved = await agreementPlacement.save(null,{useMasterKey: true});

  if (meta.role === '2' || meta.role === '3' || meta.role === '0') {
    await TOOL.CLUSAUploadAgreement(userRecord.get('emailAddress'), userRecord.get('username'));
  }
  if (meta.role === '1') {
    let queryOrg = new Parse.Query('Organization');

    queryOrg.equalTo("objectId", meta.orgId);
    let orgRecord = await queryOrg.first({ useMasterKey: true });

    await TOOL.CLUSAUploadAgreementToCLUSA(orgRecord.get('name'));
  }

  console.log('\n\nAgreement Placement saved in the database agreementPlacementSaved', agreementPlacementSaved, '\n\n');
  return agreementPlacementSaved;
};

const fetchAllAgreementPlacements = async (meta) => {
  let queryAgreementPlacement = new Parse.Query("AgreementPlacement");
  queryAgreementPlacement.limit(10000);

  return await queryAgreementPlacement.find({useMasterKey: true});
};

const fetchAllAgreementPlacementsByOrgIdProgId = async (meta) => {
  if (!meta.orgId)
    throw new Error("No organization id");
  if (!meta.programId)
    throw new Error("No organization id");

  let queryAgreementPlacement = new Parse.Query("AgreementPlacement");
  queryAgreementPlacement.equalTo("orgId", meta.orgId);
  queryAgreementPlacement.equalTo("programId", meta.programId);

  return await queryAgreementPlacement.find({useMasterKey: true});
};

const updateAgreementPlacementById = async (meta, files) => {
  // Validation Section STARTS
  const programRecord = await PROGRAM.fetchProgramById(meta.programId);
  if (!programRecord)
    throw new Error('Provided data are not proper.');

  if (meta.role == '1') {
    if (!programRecord.get('status') || programRecord.get('status') !== 'preparingAgreement')
      throw new Error('Your application and placement is not verified. So, Please wait for the confirmation');
  }
  await PROGRAM.closeFinalCheckProgramValidationById(meta.programId);
  // Validation Section ENDS

  let queryUser = new Parse.Query('User');
  queryUser.equalTo("orgId", meta.orgId);
  let userRecord = await queryUser.first({ useMasterKey: true });

  let queryAgreementPlacement = new Parse.Query('AgreementPlacement');
  queryAgreementPlacement.equalTo("objectId", meta.objectId);
  let agreementPlacement = await queryAgreementPlacement.first({ useMasterKey: true });

  agreementPlacement.set("amount", meta.amount);
  if (files && files['signedAgreement'] && files['signedAgreement'].length > 0)
    agreementPlacement.set("signedAgreement", files['signedAgreement'][0]);
  if (files && files['filledPlacement'] && files['filledPlacement'].length > 0) {
    agreementPlacement.set("filledPlacement", files['filledPlacement'][0]);
    agreementPlacement.set("placementUploadDate", moment().format('L'));
  }
  if (files && files['agreementTemplate'] && files['agreementTemplate'].length > 0)
    agreementPlacement.set("agreementTemplate", files['agreementTemplate'][0]);
  if (files && files['placementTemplate'] && files['placementTemplate'].length > 0) {
    agreementPlacement.set("placementTemplate", files['placementTemplate'][0]);
  }
  if (files && files['finalFilledPlacement'] && files['finalFilledPlacement'].length > 0)
    agreementPlacement.set("finalFilledPlacement", files['finalFilledPlacement'][0]);

  if (meta.role === '1' && agreementPlacement.get('status') === '1') {
    throw new Error('Cannot update the agreement now as it is approved.');
  }

  // two row only 3 and 2
  if (meta.role === '3' || meta.role === '2') {
    // 0 pending and 1 approved
    agreementPlacement.set("status", meta.status || 0);

    let queryProgram = new Parse.Query('Program');
    queryProgram.equalTo("objectId", meta.programId);

    let programRecord = await queryProgram.first({ useMasterKey: true });
    await TOOL.programStatusUpdate(userRecord.get('emailAddress'), userRecord.get('username'), programRecord.get('status'), meta.status === '1' ? 'approved' : 'preparingAgreement');
    const queryOrg = new Parse.Query('Organization');
    queryOrg.equalTo("objectId", meta.orgId);
    const orgRecord = await queryOrg.first({ useMasterKey: true });
    await TOOL.programStatusUpdate('', '', programRecord.get('status'), meta.status === '1' ? 'approved' : 'preparingAgreement', orgRecord.get('name'));

    programRecord.set("status", meta.status == '1' ? 'approved' : 'preparingAgreement');

    await programRecord.save(null, { useMasterKey: true });
  }

  const agreementPlacementSaved = await agreementPlacement.save(null,{useMasterKey: true});
  if (meta.role === '2' || meta.role === '3' || meta.role === '0') {
    await TOOL.CLUSAUploadAgreement(userRecord.get('emailAddress'), userRecord.get('username'));
  }
  if (meta.role === '1') {
    let queryOrg = new Parse.Query('Organization');
    queryOrg.equalTo("objectId", meta.orgId);
    let orgRecord = await queryOrg.first({ useMasterKey: true });

    await TOOL.CLUSAUploadAgreementToCLUSA(orgRecord.get('name'));
  }

  console.log('\n\nAgreement Placement saved in the database updated', agreementPlacementSaved, '\n\n');
  return agreementPlacementSaved;
};

module.exports = {
  createNewAgreementPlacement,
  fetchAllAgreementPlacements,
  fetchAllAgreementPlacementsByOrgIdProgId,
  updateAgreementPlacementById,
};
