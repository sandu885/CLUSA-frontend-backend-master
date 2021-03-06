const express = require('express');
const multer = require('multer');
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

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = `./uploads/checks`;
    if (req.body.path) {
      path = `./uploads/${req.body.path}`;
    }
    fs.mkdirsSync(path);
    cb(null, path)
  },
  filename: function (req, file, cb) {
    if (file.originalname) {
      const fileNameArray = file.originalname.split('.');
      fileNameArray.splice(fileNameArray.length - 1, 1);
      const extension = /[^.]+$/.exec(file.originalname)[0];
      cb(null, fileNameArray.join('.') + '-' + Date.now() + '.' + extension)
    } else {
      cb(null, file.originalname)
    }
  }
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = `./uploads/agreement`;
    if (req.body.path) {
      path = `./uploads/${req.body.path}`;
    }

    fs.mkdirsSync(path);
    cb(null, path)
  },
  filename: function (req, file, cb) {
    if (file.originalname) {
      const fileNameArray = file.originalname.split('.');
      fileNameArray.splice(fileNameArray.length - 1, 1);
      const extension = /[^.]+$/.exec(file.originalname)[0];
      cb(null, fileNameArray.join('.') + '-' + Date.now() + '.' + extension)
    } else {
      cb(null, file.originalname)
    }
  }
});

const upload = multer({ storage });
const upload1 = multer({ storage: storage1 });
const upload2 = multer({ storage: storage2 });

const userController = require("../../controllers/service/user");
const orgController = require("../../controllers/service/organization");
const programController = require("../../controllers/service/program");
const checkController = require("../../controllers/service/check");
const finalReport = require("../../controllers/service/finalReport");
const agreementPlacementController = require("../../controllers/service/agreementPlacement");
const sectionController = require("../../controllers/service/section");
const programComment = require("../../controllers/service/programComment");
const applicationController = require("../../controllers/service/application");
const programReportController = require("../../controllers/service/programReport");

// User Table Public 
router.post('/signup', upload.fields([{ name: 'certificate', maxCount: 1 }, { name: 'fiscalAgentCertificate', maxCount: 1 }, { name: 'mou', maxCount: 1 }]), userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/forgetPassword', userController.forgetPassword);
router.post('/resetPassword', userController.resetPassword);
router.post('/resetPasswordById', userController.resetPasswordById);
router.post('/checkSessionToken', userController.checkSessionToken);
router.post('/createNewCheck', upload1.single('checkFile'), checkController.createNewCheck);
router.post('/updateCheckById', upload1.single('checkFile'), checkController.updateCheckById);

// Recreate login Send Email
router.post('/createRecreateLogin', userController.createRecreateLogin);

// update org info
router.post('/updateOrgInfo', upload.fields([{ name: 'certificate', maxCount: 1 }, { name: 'fiscalAgentCertificate', maxCount: 1 },  { name: 'mou', maxCount: 1 }]), orgController.updateOrgInfo);

// save application
router.post('/saveApplicationContent', upload.array('budget'), applicationController.saveApplicationContent);

// save application Agreement Placement
router.post('/createNewAgreementPlacement', upload2.fields([{ name: 'signedAgreement', maxCount: 1 }, { name: 'filledPlacement', maxCount: 1 }, { name: 'finalFilledPlacement', maxCount: 1 }, { name: 'agreementTemplate', maxCount: 1 }, { name: 'placementTemplate', maxCount: 1 }]), agreementPlacementController.createNewAgreementPlacement);
router.post('/updateAgreementPlacementById', upload2.fields([{ name: 'signedAgreement', maxCount: 1 }, { name: 'filledPlacement', maxCount: 1 }, { name: 'finalFilledPlacement', maxCount: 1 }, { name: 'agreementTemplate', maxCount: 1 }, { name: 'placementTemplate', maxCount: 1 }]), agreementPlacementController.updateAgreementPlacementById);
// finalReport
router.post('/createNewFinalReport', upload2.single('finalreportfile'), finalReport.createNewFinalReport);
router.post('/updateFinalReportById', upload2.single('finalreportfile'), finalReport.updateFinalReportById);
// programReport
router.post('/createNewProgramReport', upload2.single('file'), programReportController.createNewProgramReport);
router.post('/updateProgramReportById', upload2.single('file'), programReportController.updateProgramReportById);

router.post('/deleteUserById', userController.deleteUserById);
router.use(userController.logger);

// User Table
router.post('/fetchAllUsers', userController.fetchAllUsers);
router.post('/findUserById', userController.findUserById);
router.post('/updateUserById', userController.updateUserById);
router.post('/createUserByAdmin', userController.createUserByAdmin);


// Organization Table
router.post('/findOrgById', orgController.findOrgById);
router.post('/findOrgByName', orgController.findOrgByName);
router.post('/fetchAllOrgs', orgController.fetchAllOrgs);
router.post('/getOrgInfoById', orgController.getOrgInfoById);
router.post('/getCertificateFile', orgController.getCertificateFile);
router.post('/suspendOrgById', orgController.suspendOrgById);

// Program Table
router.post('/createNewProgram', programController.createNewProgram);
router.post('/fetchAllProgramsByUserId', programController.fetchAllProgramsByUserId);
router.post('/fetchAllProgramsByOrgId', programController.fetchAllProgramsByOrgId);
router.post('/fetchProgramById', programController.fetchProgramById);
router.post('/fetchProgramDetailById', programController.fetchProgramDetailById);
router.post('/fetchAllPrograms', programController.fetchAllPrograms);
router.post('/updateProgramCloseStatusById', programController.updateProgramCloseStatusById);

// Placement and agreement
router.post('/fetchAllAgreementPlacements', agreementPlacementController.fetchAllAgreementPlacements);
router.post('/fetchAllAgreementPlacementsByOrgIdProgId', agreementPlacementController.fetchAllAgreementPlacementsByOrgIdProgId);

// Check Table
router.post('/fetchAllChecks', checkController.fetchAllChecks);
router.post('/fetchAllChecksByOrgIdProgId', checkController.fetchAllChecksByOrgIdProgId);

// Section Table
router.post('/createNewSection', sectionController.createNewSection);

// Final Report Table
router.post('/fetchAllFinalReports', finalReport.fetchAllFinalReports);
router.post('/fetchAllFinalReportByOrgIdProgId', finalReport.fetchAllFinalReportByOrgIdProgId);

// Comment Table
router.post('/createNewComment', programComment.createNewComment);
router.post('/updateCommentById', programComment.updateCommentById);
router.post('/deleteCommentById', programComment.deleteCommentById);
router.post('/updateCommentProgramStatus', programComment.updateCommentProgramStatus);
router.post('/fetchAllCommentByOrgIdProgId', programComment.fetchAllCommentByOrgIdProgId);

// Program Report Table
router.post('/fetchAllProgramReports', programReportController.fetchAllProgramReports);
router.post('/fetchAllProgramReportByOrgIdProgId', programReportController.fetchAllProgramReportByOrgIdProgId);
router.post('/deleteProgramReportById', programReportController.deleteProgramReportById);

// Application Table
router.post('/submitApplication', applicationController.submitApplication);
router.post('/getApplicationContentBySectionIndex', applicationController.getApplicationContentBySectionIndex);
router.post('/getWholeApplication', applicationController.getWholeApplication);
router.post('/getApplicationFileBySectionIndex', applicationController.getApplicationFileBySectionIndex);
module.exports = router;