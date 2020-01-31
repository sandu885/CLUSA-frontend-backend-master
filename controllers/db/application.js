const SECTION = require("../db/section");
const PROGRAM = require("../db/program");
const USER = require("../db/user");
const TOOL = require('../tool/tool');

const findApplicationByProgramIdAndIndex = async(programId, sectionIndex) => {
    let queryApplication = new Parse.Query("Application");
    queryApplication.equalTo("programId", programId);
    queryApplication.equalTo("sectionIndex", sectionIndex);
    return await queryApplication.first({useMasterKey: true});
}

const findApplicationByUserIdAndIndex = async(userId, programType, sectionIndex) => {
    let queryApplication = new Parse.Query("Application");
    queryApplication.equalTo("userId", userId);
    queryApplication.equalTo("programType", programType);
    queryApplication.equalTo("sectionIndex", sectionIndex);
    return await queryApplication.first({useMasterKey: true});
}

const findApplicationByOrgIdAndIndex = async(orgId, programType, sectionIndex) => {
    let queryApplication = new Parse.Query("Application");
    queryApplication.equalTo("orgId", orgId);
    queryApplication.equalTo("programType", programType);
    queryApplication.equalTo("sectionIndex", sectionIndex);
    return await queryApplication.first({useMasterKey: true});
}

const findApplicationById = async(applicationId) => {
    let queryApplication = new Parse.Query("Application");
    queryApplication.equalTo("objectId", applicationId);
    return await queryApplication.first({useMasterKey: true});
}

// find all saved application sections 
const fetchAllApplicationsByOrgIdAndProgramType = async(orgId, programType) => {
    let queryApplication = new Parse.Query("Application");
    queryApplication.equalTo("orgId", orgId);
    queryApplication.equalTo("programType", programType);
    let applicationRecords = await queryApplication.find({useMasterKey: true}), applications = {};
    for (let i in applicationRecords) {
        let ele = {};
        ele["programType"] = applicationRecords[i].get("programType");
        ele["numOfSubsection"] = parseInt(applicationRecords[i].get("numOfSubsection"), 10);
        ele["content"] = applicationRecords[i].get("content");
        ele["status"] = applicationRecords[i].get("status");
        applications[applicationRecords[i].get("sectionIndex")] = ele;
    }
    return applications;
}

// save application content for this section
const saveApplicationContent = async(meta, files) => {
    if (!meta.programType)
        throw new Error('No program type');
    if (!meta.sectionIndex)
        throw new Error('No section index');
    if (!meta.sectionContent) 
        throw new Error('No application content');
    let user = await USER.logger(meta.sessionToken);
    let programRecord = await PROGRAM.findProgramByUserIdAndProgramType(user.id, meta.programType);
    if (!programRecord)
        throw new Error("No program with this program type");
    let sectionRecord = await SECTION.findSectionByIndexAndProgramType(meta.sectionIndex, meta.programType);
    if (!sectionRecord)
        throw new Error('Wrong section index');
    let application = await findApplicationByProgramIdAndIndex(programRecord.id, meta.sectionIndex);
    console.log('saveApplicationContent: Fetch application record');
    if (!application) {
        let Application = Parse.Object.extend('Application');
        application = new Application();
        application.set('programId', programRecord.id);
        application.set('userId', user.id);
        application.set('orgId', user.get('orgId'));
        application.set('sectionIndex', meta.sectionIndex);
        application.set('programType', meta.programType);
    } 
    application.set('numOfSubsection', sectionRecord.get("numOfSubsection"));
    application.set('sectionId', sectionRecord.id);
    let numOfSubsection = application.get('numOfSubsection'), content = {}, status = {}, sectionContent = JSON.parse(meta.sectionContent);
    let i;
    for (i = 1; i <= numOfSubsection; i++) {
        if (sectionRecord.get('hasFiles') && sectionRecord.get('questionType')[i - 1] == '6') {
            if (files && files.length > 0) {
                console.log('You upload new files for this section');
                status[i.toString()] = true;
                application.set('files', files);
            } else {
                status[i.toString()] = (!application.get('files') || application.get('files').length == 0) ? false : true;
            }
        } else {
            console.log(`saveApplicationContent: Part ${i} is ` + JSON.stringify(sectionContent[i.toString()]));
            if (sectionContent[i.toString()] == undefined || sectionContent[i.toString()] === "" || sectionContent[i.toString()] === false) {
                status[i.toString()] = false;
            } else {
                status[i.toString()] = true;
            }
            content[i.toString()] = sectionContent[i.toString()];
        }
    }
    if  (meta.sectionIndex == '1') {
        if (sectionContent["1"]) {
            if (!sectionContent["1"]["appliedBefore"]) {
                status["1"] = false;
            } else if (sectionContent["1"]["appliedBefore"] == "yes" && !sectionContent["1"]["programs"]) {
                status["1"] = false;
            } else if (sectionContent["1"]["appliedBefore"] == "yes" && sectionContent["1"]["programs"]) {
                for (let i in sectionContent["1"]["programs"]) {
                    if (!sectionContent["1"]["programs"][i]["granted"] || !sectionContent["1"]["programs"][i]["startYear"])
                        status["1"] = false;
                    else if (sectionContent["1"]["programs"][i]["granted"] == "yes" && !sectionContent["1"]["programs"][i]["completed"]) 
                        status["1"] = false;
                    else if (sectionContent["1"]["programs"][i]["completed"] == "yes" && !sectionContent["1"]["programs"][i]["endYear"])
                        status["1"] = false;
                }
            } else if (sectionContent["1"]["appliedBefore"] == "no" && !sectionContent["1"]["summary"]) {
                status["1"] = false;
            }
        } else status["1"] = false;
    }   else if (meta.sectionIndex == '5') {
        if (sectionContent["3"]) {
            for (let i in sectionContent["3"]) {
                if (!sectionContent["3"][i]["placementName"] || !sectionContent["3"][i]["placementNumber"] || !sectionContent["3"][i]["placementNumberLikely"])
                    status["3"] = false;
            }
        }
    }  
    console.log('saveApplicationContent: Current status is' + JSON.stringify(status));
    if (programRecord.get('status') === 'applied' && sectionRecord.get('required')) {
        for (i = 1; i <= numOfSubsection; i++) {
            if (!status[i.toString()]) {
                console.log('saveApplicationContent: You can not leave required field blank');
                return {
                    message: 'You can not leave required field blank',
                    content: application.get('content')
                }
            }
        }
    }
    application.set('content', content);
    application.set('status', status);
    await application.save(null,{useMasterKey: true});
    return {
        message: 'Successfully save section content',
        content: content
    };
}

// Submit application, will check the application is completed or not
const submitApplication = async(user, programType) => {
    if (!programType)
        throw new Error("No program type");
    let sectionRecord = await SECTION.fetchAllSectionsByProgramType(programType);
    let applicationRecord = await fetchAllApplicationsByOrgIdAndProgramType(user.get('orgId'), programType);
    console.log("submitApplication: successfully fetch all saved information");
    let len = (Object.keys(sectionRecord)).length, response = {}, i;
    console.log('submitApplication: application has ' + len + ' sections');
    response["message"] = "You have successfully submitted your application";
    response["incompleteSections"] = {};
    // check all sections
    for (i = 1; i <= len; i++) {
        if (!applicationRecord[i.toString()]) {
            if (sectionRecord[i.toString()]['required'] === true) {
                response["message"] = "Application is not completed";
                response["incompleteSections"][i.toString()] = {};
                response["incompleteSections"][i.toString()]["status"] = "Not saved";
            }
            continue;
        } 
        if (sectionRecord[i.toString()]['required'] == false)
            continue;
        console.log("submitApplication: Section " + i + " is required");
        let numOfSubsection = sectionRecord[i.toString()]["numOfSubsection"], j;
        console.log("submitApplication: Section " + i + " has " + numOfSubsection + " subsections");
        for (j = 1; j <= numOfSubsection; j++) {
            if (!applicationRecord[i.toString()]["status"][j.toString()]) {
                response["message"] = "Application is not completed";
                response["incompleteSections"][i.toString()] = {};
                response["incompleteSections"][i.toString()]["status"] = "Parts of the section are not completed";
                response["incompleteSections"][i.toString()]["details"] = applicationRecord[i.toString()]["status"];
            }
        }
    } 
    if (response["message"] == "You have successfully submitted your application") {
        console.log("submitApplication: The application is completed");
        let programRecord = await PROGRAM.findProgramByUserIdAndProgramType(user.id, programType);
        programRecord.set("status", "applied");
        await programRecord.save(null,{useMasterKey: true});
        user.set("status", 'applied');
        await user.save(null,{useMasterKey: true});
        if (!applicationRecord['13'])
            throw new Error('This application is not certificated');
        await TOOL.sendEmail(applicationRecord['13']['content']['4'], user.get('username'), user.get('password'), 'submit');
    }
    return response;
}

// Get application content for this specific section
const getApplicationContentBySectionIndex = async(user, programType, sectionIndex) => {
    if (!sectionIndex)
        throw new Error("No section index");
    if (!programType)
        throw new Error("No program type");
    let applicationRecord = await findApplicationByUserIdAndIndex(user.id, programType, sectionIndex);
    let sectionRecord = await SECTION.findSectionByIndexAndProgramType(sectionIndex, programType);
    console.log("getApplicationContentBySectionIndex: Fetch application content by section index");
    if (!applicationRecord) {
        return {
            message: "No saved application for this section"
        }
    } 
    if (sectionRecord.get('hasFiles') === true) {
        console.log("getApplicationContentBySectionIndex: Section " + sectionIndex + " has files");
        let message = applicationRecord.get('files') == undefined || applicationRecord.get('files').length == 0 ? 'No budget file' : 'You already uploaded the file';
        console.log("getApplicationContentBySectionIndex: " + message);
        return {
            message: message,
            content: applicationRecord.get("content"),
        }
    } 
    return {
        message: "Successfully get application content",
        content: applicationRecord.get("content"),
    }
}

// Get saved all sections of application
const getWholeApplication = async(user, programType, orgId) => {
    if (!programType)
        throw new Error("No program type");
    if (user.get('userType') == '0') {
        if (!orgId)
            throw new Error("No organization id");
    } else if (user.get('userType') == '1') {
        orgId = user.get('orgId');
    } 
    let applicationRecords = await fetchAllApplicationsByOrgIdAndProgramType(orgId, programType);
    console.log("getWholeApplication: Successfully get all application contents");
    return applicationRecords;
}

// Get file uploaded for this section
const getApplicationFileBySectionIndex = async (user, programType, sectionIndex, orgId) => {
    if (!programType)
        throw new Error("No program type");
    if (!sectionIndex)
        throw new Error("No section index");
    if (user.get('userType') == '0') {
        if (!orgId)
            throw new Error("No organization id");
    } else if (user.get('userType') == '1') {
        orgId = user.get('orgId');
    }
    let applicationRecord = await findApplicationByOrgIdAndIndex(orgId, programType, sectionIndex);
    if (!applicationRecord)
        throw new Error("No saved application for this section");
    if (!applicationRecord.get('files') || applicationRecord.get('files').length == 0) {
        return 'No application file';
    } else {
        return applicationRecord.get('files')[0]['path'];
    }
}

module.exports = {
    saveApplicationContent,
    findApplicationByProgramIdAndIndex,
    findApplicationById,
    submitApplication,
    getApplicationContentBySectionIndex,
    getWholeApplication,
    getApplicationFileBySectionIndex
}