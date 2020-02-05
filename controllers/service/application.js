const APPLICATION = require('../db/application');

const saveApplicationContent = async (req, res) => {
    console.log("saveApplicationContent: start");
    try {
        let result = await APPLICATION.saveApplicationContent(req.body, req.files);
        console.log("Successfully save section content");
        res.status(200).json(result);
    } catch(error) {
        console.log('saveApplicationContent: ' + error.message);
        res.status(400).json({
            message: error.message
      });
    }
}

const submitApplication = async(req, res) => {
    console.log("submitApplication: start");
    try {
        let result = await APPLICATION.submitApplication(req.body.user, req.body.programType);
        console.log("Submit application");
        res.status(200).json(result);
    } catch(error) {
        console.log('submitApplication: ' + error.message);
        res.status(400).json({
            message: error.message
      });
    }
}

const getApplicationContentBySectionIndex = async(req, res) => {
    console.log("getApplicationContentBySectionIndex: start");
    try {
        let result = await APPLICATION.getApplicationContentBySectionIndex(req.body.user, req.body.programType, req.body.sectionIndex);
        console.log("Successfully get section content");
        res.status(200).json(result);
    } catch(error) {
        console.log('getApplicationContentBySectionIndex: ' + error.message);
        res.status(400).json({
            message: error.message
      });
    }
}

const getWholeApplication = async(req, res) => {
    console.log("getWholeApplication: start");
    try {
        let application = await APPLICATION.getWholeApplication(req.body.user, req.body.programType, req.body.orgId);
        console.log("Successfully get whole application");
        res.status(200).json({
            message:  "Successfully get whole application",
            application: application
        });
    } catch(error) {
        console.log('getWholeApplication: ' + error.message);
        res.status(400).json({
            message: error.message
      });
    }
}

const getApplicationFileBySectionIndex = async(req, res) => {
    console.log("getApplicationFileBySectionIndex: start");
    try {
        let path = await APPLICATION.getApplicationFileBySectionIndex(req.body.user, req.body.programType, req.body.sectionIndex, req.body.orgId);
        console.log("Successfully get application file");
        if (path == 'No application file') {
            res.status(200).json({
                message: path,
            });
        } else {
            let pathList = path.split('/'), filename = pathList[pathList.length - 1]; 
            res.download(path, filename);
        }
    } catch(error) {
        console.log('getApplicationFileBySectionIndex: ' + error.message);
        res.status(400).json({
            message: error.message
      });
    }
}

module.exports = {
    saveApplicationContent,
    submitApplication,
    getApplicationContentBySectionIndex,
    getWholeApplication,
    getApplicationFileBySectionIndex
}