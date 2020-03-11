const moment = require('moment');
//Create new program
const createNewProgram = async (user, type) => {
    if (!type)
        throw new Error("No program type");
    let programRecord = await findProgramByUserIdAndProgramType(user.id, type);
    if (programRecord)
        throw new Error("You already applied a program with this type");
    let Program = Parse.Object.extend("Program"), program = new Program();
    program.set("userId", user.id);
    program.set("orgId", user.get("orgId"));
    program.set("programType", type);
    program.set("status", "applying");
    user.set("status", "applying");
    await user.save(null,{useMasterKey: true});
    return await program.save(null,{useMasterKey: true});
}

const fetchAllProgramsByUserId = async(userId) => {
    if (!userId)
        throw new Error("No user id");
    let queryProgram = new Parse.Query("Program");
    queryProgram.limit(10000);
    queryProgram.equalTo("userId", userId);
    return await queryProgram.find({useMasterKey: true});
};

const fetchProgramById = async(programId) => {
    if (!programId)
        throw new Error("No Program id");

    let queryProgram = new Parse.Query("Program");
    queryProgram.equalTo("objectId", programId);

    return await queryProgram.first({useMasterKey: true});
};

const closeFinalCheckProgramValidationById = async (programId) => {
    const programRecord = await fetchProgramById(programId);
    if (!programRecord)
        throw new Error('Provided data is not proper.');

    if (programRecord.get('status') === 'finalCheckSent')
        throw new Error('You can not perform this action as final check is send.');

    if (programRecord.get('status') === 'closed')
        throw new Error('You can not perform this action as program is closed.');
};

const fetchProgramDetailById = async(programId) => {
    if (!programId)
        throw new Error("No Program id");

    let queryProgram = new Parse.Query("Program");
    queryProgram.limit(10000);
    queryProgram.equalTo("objectId", programId);

    let queryApplication = new Parse.Query("Application");
    queryApplication.limit(10000);
    queryApplication.equalTo("programId", programId);

    let element = {};
    element['program'] = await queryProgram.first({useMasterKey: true});

    let queryCheck = new Parse.Query("Check");
    queryCheck.limit(3);
    queryCheck.equalTo("programId", programId);
    let checkRecord = await queryCheck.find({useMasterKey: true});
    element["checks"] = checkRecord;

    let queryAgreementPlacement = new Parse.Query("AgreementPlacement");

    queryAgreementPlacement.equalTo("programId", programId);
    let agreementPlacementRecord = await queryAgreementPlacement.find({useMasterKey: true});
    element["agreementPlacement"] = agreementPlacementRecord;

    let queryOrganization = new Parse.Query("Organization");

    queryOrganization.equalTo("objectId", element['program'].get('orgId'));
    let organizationRecord = await queryOrganization.first({useMasterKey: true});
    element["organization"] = organizationRecord;

    element['application'] = await queryApplication.find({useMasterKey: true});
    return element;
}

const fetchAllProgramsByOrgId = async(orgId) => {
    if (!orgId)
        throw new Error("No organization id");
    let queryProgram = new Parse.Query("Program");
    queryProgram.limit(10000);
    queryProgram.equalTo("orgId", orgId);

    const programRecords = await queryProgram.find({useMasterKey: true});

    let programs = [];
    for (let i in programRecords) {
        let ele = {};
        let queryApplication = new Parse.Query("Application");
        queryApplication.equalTo("programId", programRecords[i].id);
        let appRecord = await queryApplication.find({useMasterKey: true});

        for (const app of appRecord) {
            // if (app.get('sectionIndex') === '1') {
            //     ele["year"] = app.get('content')['1']['programs'] ? app.get('content')['1']['programs'][0]['startYear'] || '' : '';
            // }

            if (app.get('sectionIndex') === '10') {
                ele["awardedAmount"] = app.get('content') ? app.get('content')['2'] : '0';

                let queryCheck = new Parse.Query("Check");
                queryCheck.equalTo("orgId", orgId);
                queryCheck.equalTo("programId", programRecords[i].id);
                let checkRecord = await queryCheck.find({useMasterKey: true});
                checkRecord = checkRecord ? JSON.parse(JSON.stringify(checkRecord)) : [];
                ele["actualAmount"] = checkRecord.reduce((check1, check2) => (check1 || 0) + (Number(check2.amount) || 0), 0)
            }
        }
        ele["userId"] = programRecords[i].get("userId");
        ele["type"] = programRecords[i].get("type");
    // .replace( /([A-Z])/g, " $1" );
        ele["status"] = programRecords[i].get("status") ? programRecords[i].get("status").replace( /([A-Z])/g, " $1" ) : '';

        ele["objectId"] = programRecords[i].id;
        ele["programType"] = programRecords[i].get("programType");
        ele["createdAt"] = programRecords[i].get("createdAt");
        ele["updatedAt"] = programRecords[i].get("updatedAt");
        ele["year"] = programRecords[i].get("appliedDate") ? moment(programRecords[i].get("appliedDate")).format('YYYY') : '';
        programs.push(ele);
    }
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("orgId", orgId);
    const userRecords = await queryUser.first({useMasterKey: true});
    let queryOrganization = new Parse.Query("Organization");
    queryOrganization.equalTo("objectId", orgId);
    const organizationRecords = await queryOrganization.first({useMasterKey: true});
    return { programs, organizationData: organizationRecords, userData: userRecords };
};

const fetchAllPrograms = async(meta) => {
    let queryProgram = new Parse.Query("Program");
    if (meta.programType) {
        queryProgram.equalTo("programType", meta.programType);
    }
    if (meta.status) {
        queryProgram.equalTo("status", meta.status);
    }
    if (meta.year && meta.year.length >= 4) {
        queryProgram.equalTo("appliedYear", meta.year);
    }
    queryProgram.limit(10000);
    const programRecords = await queryProgram.find({useMasterKey: true});
    let programs = [];

    for (let i in programRecords) {
        let ele = {};
        let queryOrg = new Parse.Query("Organization");
        queryOrg.equalTo("objectId", programRecords[i].get("orgId"));
        if (meta.organizationName) {
            queryOrg.fullText('name', (meta.organizationName || '').trim());
        }
        let orgRecord = await queryOrg.first({useMasterKey: true});

        ele["year"] = programRecords[i].get("appliedDate") ? moment(programRecords[i].get("appliedDate")).format('YYYY') : '';
        ele["userId"] = programRecords[i].get("userId");
        ele["type"] = programRecords[i].get("type");
        ele["status"] = programRecords[i].get("status") ? programRecords[i].get("status").replace( /([A-Z])/g, " $1" ) : '';
        ele["objectId"] = programRecords[i].id;
        ele["programType"] = programRecords[i].get("programType");
        ele["org"] = orgRecord;
        ele["orgName"] = orgRecord ? orgRecord.get('name') : '';
        ele["createdAt"] = programRecords[i].get("createdAt");
        ele["updatedAt"] = programRecords[i].get("updatedAt");
        if (orgRecord) {
            let queryCheck = new Parse.Query("Check");
            queryCheck.limit(3);
            queryCheck.equalTo("orgId", orgRecord.id);
            queryCheck.equalTo("programId", programRecords[i].id);
            let checkRecord = await queryCheck.find({useMasterKey: true});

            let queryAgreementPlacement = new Parse.Query("AgreementPlacement");
            queryAgreementPlacement.equalTo("orgId", orgRecord.id);
            queryAgreementPlacement.equalTo("programId", programRecords[i].id);
            let agreementPlacementRecord = await queryAgreementPlacement.first({useMasterKey: true});

            const checkData = JSON.parse(JSON.stringify(checkRecord));

            ele["actualAmount"] = checkData.reduce((t1, t2) => (t1 || 0) + Number(t2.amount), 0) || null;
            ele["awardedAmount"] = agreementPlacementRecord ? agreementPlacementRecord.get('awardAmount') : '';
        }

        if ((meta.organizationName || '').trim()) {
            if (orgRecord) {
                programs.push(ele);
                // return
            }
        } else {
            programs.push(ele);
        }
    }
    return programs;
};

const updateProgramByIdToCloseStatus = async (meta) => {
    console.log('Closing report starting');
    if (!meta.sessionToken)
        throw new Error("No sessionToken");

    let queryProgram = new Parse.Query('Program');
    queryProgram.equalTo("objectId", meta.programId);
    let programRecord = await queryProgram.first({ useMasterKey: true });

    meta.closeNote && programRecord.set("closeNote", meta.closeNote);
    meta.closeNote && programRecord.set("status", 'closed');

    return programRecord.save(null, { useMasterKey: true });
};

const findProgramById = async(programId) => {
    let queryProgram = new Parse.Query("Program");
    queryProgram.limit(10000);
    queryProgram.equalTo("objectId", programId);
    return await queryProgram.first({useMasterKey: true});
}

const findProgramByUserIdAndProgramType = async(userId, programType) => {
    let queryProgram = new Parse.Query("Program");
    queryProgram.limit(10000);
    queryProgram.equalTo("userId", userId);
    queryProgram.equalTo("programType", programType);
    return await queryProgram.first({useMasterKey: true});
}

const findProgramByOrgIdAndProgramType = async(orgId, programType) => {
    let queryProgram = new Parse.Query("Program");
    queryProgram.limit(10000);
    queryProgram.equalTo("orgId", orgId);
    queryProgram.equalTo("programType", programType);
    return await queryProgram.first({useMasterKey: true});
}

module.exports = {
    createNewProgram,
    fetchAllProgramsByUserId,
    fetchAllProgramsByOrgId,
    fetchAllPrograms,
    findProgramById,
    findProgramByUserIdAndProgramType,
    findProgramByOrgIdAndProgramType,
    fetchProgramDetailById,
    updateProgramByIdToCloseStatus,
    fetchProgramById,
    closeFinalCheckProgramValidationById,
};
