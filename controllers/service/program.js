const PROGRAM = require("../db/program");

const createNewProgram = async (req, res) => {
    console.log("createNewProgram: start");
    try {
        let program = await PROGRAM.createNewProgram(req.body.user, "0");
        console.log("create new program success");
        res.status(200).json({
            message: "User successfully creates a new program",
            programId: program.id,
        });
    } catch(error) {
        console.log("createNewProgram: " + error.message);
        res.status(400).json({
            message: error.message
        });
    }
}

const fetchAllProgramsByUserId = async(req, res) => {
    try {
        let programs = await PROGRAM.fetchAllProgramsByUserId(req.body.userId);
        console.log("Successfully fetch all programs by user id");
        res.status(200).json({
            message: "Successfully fetch all programs by user id",
            programs: programs,
        });
    } catch(error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message
        });
    }
}

const fetchProgramDetailById = async(req, res) => {
    try {
        let program = await PROGRAM.fetchProgramDetailById(req.body.programId);
        console.log("Successfully fetch all programs by user id \n", program);
        res.status(200).json({
            message: "Successfully fetch all programs by user id",
            program: program,
        });
    } catch(error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message
        });
    }
}

const fetchAllProgramsByOrgId = async(req, res) => {
    try {
        let programs = await PROGRAM.fetchAllProgramsByOrgId(req.body.orgId);
        console.log("Successfully fetch all programs by organization id");
        res.status(200).json({
            message: "Successfully fetch all programs by organization id",
            programs: programs,
        });
    } catch(error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message
        });
    }
}

const fetchAllPrograms = async (req, res) => {
    try {
        let programs = await PROGRAM.fetchAllPrograms(req.body);
        console.log("Successfully fetch all programs");
        res.status(200).json({
            message: "Successfully fetch all programs",
            programs: programs,
        });
    } catch(error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message
        });
    }
}

const updateProgramCloseStatusById = async (req, res) => {
    try {
        let programs = await PROGRAM.updateProgramByIdToCloseStatus(req.body);
        console.log("Successfully fetch all programs");
        res.status(200).json({
            message: "Successfully fetch all programs",
            programs: programs,
        });
    } catch(error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    createNewProgram,
    fetchAllProgramsByUserId,
    fetchAllProgramsByOrgId,
    fetchAllPrograms,
    fetchProgramDetailById,
    updateProgramCloseStatusById,
}