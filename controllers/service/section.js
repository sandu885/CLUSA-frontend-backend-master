const SECTION = require("../db/section");

const createNewSection = async (req, res) => {
    try {
        await SECTION.createNewSection(req.body.programType, req.body.sectionIndex, req.body.numOfSubsection, req.body.questionType, req.body.numOfChoice, req.body.required, req.body.hasFiles);
        console.log("Successfully creates a new section");
        res.status(200).json({
            message: "Successfully creates a new section",
        });
    } catch(error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message
        });
    }
}

module.exports = {
    createNewSection,
}