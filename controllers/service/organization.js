const ORG = require('../db/organization');

const findOrgById = async (req, res) => {
    try {
        let org = await ORG.findOrgById(req.body.orgId);
        console.log("findOrgById : Successfully fetch organization information");
        if (!org) {
            throw new Error("Wrong organization id");
        }
        res.status(200).json({
            message: 'Successfully fetch organization information',
            organization: org,
        });
    } catch(error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message
      });
    }
}

const findOrgByName = async (req, res) => {
    try {
        let org = await ORG.findOrgByName(req.body.orgName);
        console.log("findOrgByName : Successfully fetch organization information");
        if (!org) {
            throw new Error("Wrong organization name");
        }
        res.status(200).json({
            message: 'Successfully fetch organization information',
            organization: org,
        });
    } catch(error) {
        console.log(error.message);
        res.status(400).json({
            message: error.message
      });
    }
}

const fetchAllOrgs = async(req, res) => {
    console.log("fetchAllOrgs: start");
    try {
        let org = await ORG.fetchAllOrgs(req.body.user);
        console.log("Successfully fetch all organizations");
        res.status(200).json({
            message: 'Successfully fetch all organizations',
            organizations: org,
        });
    } catch(error) {
        console.log("fetchAllOrgs: " + error.message);
        res.status(400).json({
            message: error.message
      });
    }
}

const getOrgInfoById = async(req, res) => {
    console.log("getOrgInfoById: start");
    try {
        let info = await ORG.getOrgInfoById(req.body.user, req.body.orgId);
        console.log("Successfully get organization information");
        res.status(200).json({
            message: 'Successfully get organization information',
            info: info,
        });
    } catch(error) {
        console.log('getOrgInfoById: ' + error.message);
        res.status(400).json({
            message: error.message
      });
    }
}

const suspendOrgById = async(req, res) => {
    console.log("getOrgInfoById: start");
    try {
        let info = await ORG.suspendOrgById(req.body);
        console.log("Successfully suspended organization");
        res.status(200).json({
            message: 'Successfully suspended organization',
            data: info,
        });
    } catch(error) {
        console.log('suspendOrgById: ' + error.message);
        res.status(400).json({
            message: error.message
        });
    }
};

const updateOrgInfo = async(req, res) => {
    console.log("updateOrgInfo: start");
    try {
        let info = await ORG.updateOrgInfo(req.body, req.files);
        console.log("Successfully update organization information");
        res.status(200).json({
            message: 'Successfully update organization information',
            info: info,
        });
    } catch(error) {
        console.log('updateOrgInfo: ' + error.message);
        res.status(400).json({
            message: error.message
      });
    }
}

const getCertificateFile = async(req, res) => {
    console.log("getCertificateFile: start");
    try {
        let path = await ORG.getCertificateFile(req.body.user, req.body.fileType, req.body.orgId);
        console.log("Successfully get certificate file");
        if (path == 'No certificate file') {
            res.status(200).json({
                message: path,
            });
        } else {
            let pathList = path.split('/'), filename = pathList[pathList.length - 1]; 
            console.log("file name is " + filename);
            res.download(path, filename);
        }
    } catch(error) {
        console.log('getCertificateFile: ' + error.message);
        res.status(400).json({
            message: error.message
      });
    }
}
 
module.exports = {
    findOrgById,
    findOrgByName,
    fetchAllOrgs,
    getOrgInfoById,
    updateOrgInfo,
    getCertificateFile,
    suspendOrgById,
}