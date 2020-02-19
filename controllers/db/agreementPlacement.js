const moment = require('moment');

const createNewAgreementPlacement = async (meta, files) => {
  if (meta.role == '0') {
    if (!files['signedAgreement'] || files['signedAgreement'].length == 0)
      throw new Error('Please provide signed agreement file.');
    if (!files['filledPlacement'] || files['filledPlacement'].length == 0)
      throw new Error('Please provide signed placement file.');
  }

  if (meta.role != '0') {
    if (!files['agreementTemplate'] || files['agreementTemplate'].length == 0)
      throw new Error('Please provide signed agreement file.');
    if (!files['placementTemplate'] || files['placementTemplate'].length == 0)
      throw new Error('Please provide signed placement file.');
    if (!meta.status)
      throw new Error('Please Provide status');
  }

  let AgreementPlacement = Parse.Object.extend("AgreementPlacement"), agreementPlacement = new AgreementPlacement();
  agreementPlacement.set("programId", meta.programId);
  agreementPlacement.set("orgId", meta.orgId);
  agreementPlacement.set("awardAmount", meta.awardAmount);
  if (files && files['signedAgreement'] && files['signedAgreement'].length > 0)
    agreementPlacement.set("signedAgreement", files['signedAgreement'][0]);
  if (files && files['filledPlacement'] && files['filledPlacement'].length > 0)
    agreementPlacement.set("filledPlacement", files['filledPlacement'][0]);
  if (files && files['agreementTemplate'] && files['agreementTemplate'].length > 0)
    agreementPlacement.set("agreementTemplate", files['agreementTemplate'][0]);
  if (files && files['placementTemplate'] && files['placementTemplate'].length > 0) {
    agreementPlacement.set("placementTemplate", files['placementTemplate'][0]);
    agreementPlacement.set("placementUploadDate", moment().format('L'));
  }


  // agreementPlacement.set("agreementTemplate", meta.agreementTemplate);
  // agreementPlacement.set("placementTemplate", meta.placementTemplate);
  // two row only 3 and 2
  if (meta.role === '3' || meta.role === '2') {
    // 0 pending and 1 approved
    agreementPlacement.set("status", meta.status || 0);
  }


  const agreementPlacementSaved = await agreementPlacement.save(null,{useMasterKey: true});
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
  let queryAgreementPlacement = new Parse.Query('AgreementPlacement');
  queryAgreementPlacement.equalTo("objectId", meta.agreementPlacementId);
  let agreementPlacement = await queryAgreementPlacement.first({ useMasterKey: true });

  agreementPlacement.set("amount", meta.amount);
  if (files && files['signedAgreement'] && files['signedAgreement'].length > 0)
    agreementPlacement.set("signedAgreement", files['signedAgreement'][0]);
  if (files && files['filledPlacement'] && files['filledPlacement'].length > 0)
    agreementPlacement.set("filledPlacement", files['filledPlacement'][0]);
  if (files && files['agreementTemplate'] && files['agreementTemplate'].length > 0)
    agreementPlacement.set("agreementTemplate", files['agreementTemplate'][0]);
  if (files && files['placementTemplate'] && files['placementTemplate'].length > 0) {
    agreementPlacement.set("placementTemplate", files['placementTemplate'][0]);
    agreementPlacement.set("placementUploadDate", moment().format('L'));
  }

  // two row only 3 and 2
  if (meta.role === '3' || meta.role === '2') {
    // 0 pending and 1 approved
    agreementPlacement.set("status", meta.status || 0);
  }

  const agreementPlacementSaved = await agreementPlacement.save(null,{useMasterKey: true});
  console.log('\n\nAgreement Placement saved in the database updated', agreementPlacementSaved, '\n\n');
  return agreementPlacementSaved;
};

module.exports = {
  createNewAgreementPlacement,
  fetchAllAgreementPlacements,
  fetchAllAgreementPlacementsByOrgIdProgId,
  updateAgreementPlacementById,
};
