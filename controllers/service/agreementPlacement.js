const AGREEMENTPLACEMENT = require("../db/agreementPlacement");

const createNewAgreementPlacement = async (req, res) => {
  console.log("createNewAgreementPlacement: start", req.body, '\n\n');
  try {
    let agreementPlacement = await AGREEMENTPLACEMENT.createNewAgreementPlacement(req.body, req.files);
    console.log("create new agreement placement");
    res.status(200).json({
      message: "Agreement Placement successfully creates",
      agreementPlacementId: agreementPlacement.id,
    });
  } catch(error) {
    console.log("createNewAgreementPlacement: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const fetchAllAgreementPlacements = async (req, res) => {
  console.log("fetchAllAgreementPlacements: start");
  try {
    let agreementPlacements = await AGREEMENTPLACEMENT.fetchAllAgreementPlacements(req.body.user);
    console.log("Successfully fetch all Agreement Placements");
    res.status(200).json({
      message: 'Successfully fetch all Agreement Placements',
      agreementPlacements,
    });
  } catch(error) {
    console.log("fetchAllAgreementPlacements: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const fetchAllAgreementPlacementsByOrgIdProgId = async (req, res) => {
  console.log("fetchAllAgreementPlacementsByOrgIdProgId: start");
  try {
    let agreementPlacement = await AGREEMENTPLACEMENT.fetchAllAgreementPlacementsByOrgIdProgId(req.body);
    console.log("Successfully fetch agreement placement");
    res.status(200).json({
      message: 'Successfully fetch all agreement placement',
      agreementPlacement: agreementPlacement,
    });
  } catch(error) {
    console.log("fetchAllagreementPlacement: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const updateAgreementPlacementById = async (req, res) => {
  console.log("updateAgreementPlacementById: start");
  try {
    let agreementPlacementById = await AGREEMENTPLACEMENT.updateAgreementPlacementById(req.body, req.files);
    console.log("agreementPlacementById fetch done update");
    res.status(200).json({
      message: 'Successfully update agreementPlacement by id',
      agreementPlacementById: agreementPlacementById,
    });
  } catch(error) {
    console.log("agreementPlacementById: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  createNewAgreementPlacement,
  fetchAllAgreementPlacements,
  fetchAllAgreementPlacementsByOrgIdProgId,
  updateAgreementPlacementById,
};
