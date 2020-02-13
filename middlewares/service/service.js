const express = require('express');
const multer  = require('multer');  
const fs = require('fs-extra');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      let orgName = req.body.orgName;
      console.log("orgName is " + orgName);
      let fieldname = file.fieldname;
      let path = `./uploads/${orgName}/${fieldname}`;
      fs.mkdirsSync(path);
      callback(null, path);
    },
    filename(req, file, callback) {
      callback(null, file.originalname);
    },
});
  
const upload = multer({ storage });

const userController = require("../../controllers/service/user");
const orgController = require("../../controllers/service/organization");
const programController = require("../../controllers/service/program");
const sectionController = require("../../controllers/service/section");
const applicationController = require("../../controllers/service/application");

// User Table Public
router.post('/signup', upload.fields([{ name: 'certificate', maxCount: 1 }, { name: 'mou', maxCount: 1 }]), userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/forgetPassword', userController.forgetPassword);
router.post('/resetPassword', userController.resetPassword);
router.post('/checkSessionToken', userController.checkSessionToken);

// update org info
router.post('/updateOrgInfo', upload.fields([{ name: 'certificate', maxCount: 1 }, { name: 'mou', maxCount: 1 }]), orgController.updateOrgInfo);

// save application
router.post('/saveApplicationContent', upload.array('budget'), applicationController.saveApplicationContent);
router.use(userController.logger);

// User Table
router.post('/fetchAllUsers', userController.fetchAllUsers);
router.post('/findUserById', userController.findUserById);
router.post('/updateUserById', userController.updateUserById);
router.post('/createUserByAdmin', userController.createUserByAdmin);
router.post('/deleteUserById', userController.deleteUserById);

// Organization Table
router.post('/findOrgById', orgController.findOrgById);
router.post('/findOrgByName', orgController.findOrgByName);
router.post('/fetchAllOrgs', orgController.fetchAllOrgs);
router.post('/getOrgInfoById', orgController.getOrgInfoById);
router.post('/getCertificateFile', orgController.getCertificateFile);

// Program Table
router.post('/createNewProgram', programController.createNewProgram);
router.post('/fetchAllProgramsByUserId', programController.fetchAllProgramsByUserId);
router.post('/fetchAllProgramsByOrgId', programController.fetchAllProgramsByOrgId);
router.post('/fetchProgramDetailById', programController.fetchProgramDetailById);
router.post('/fetchAllPrograms', programController.fetchAllPrograms);
router.post('/updateProgramCloseStatusById', programController.updateProgramCloseStatusById);

// Section Table
router.post('/createNewSection', sectionController.createNewSection);

// Application Table
router.post('/submitApplication', applicationController.submitApplication);
router.post('/getApplicationContentBySectionIndex', applicationController.getApplicationContentBySectionIndex);
router.post('/getWholeApplication', applicationController.getWholeApplication);
router.post('/getApplicationFileBySectionIndex', applicationController.getApplicationFileBySectionIndex);
module.exports = router;