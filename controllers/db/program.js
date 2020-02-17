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
}

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

        appRecord.forEach((app) => {
            if (app.get('sectionIndex') === '1') {
                ele["year"] = app.get('content')['1']['programs'] ? app.get('content')['1']['programs'][0]['startYear'] || '' : '';
            }
            if (app.get('sectionIndex') === '10') {
                ele["awardedAmount"] = app.get('content') ? app.get('content')['2'] : '0';
                ele["actualAmount"] = app.get('content') ? app.get('content')['1'] ? [0]['budget'] : '' : '0';
            }
        });
        ele["userId"] = programRecords[i].get("userId");
        ele["type"] = programRecords[i].get("type");
        ele["status"] = programRecords[i].get("status");
        ele["objectId"] = programRecords[i].id;
        ele["programType"] = programRecords[i].get("programType");
        ele["createdAt"] = programRecords[i].get("createdAt");
        ele["updatedAt"] = programRecords[i].get("updatedAt");

        programs.push(ele);
    }
    return programs;
};

const fetchAllPrograms = async(meta) => {
    let queryProgram = new Parse.Query("Program");
    if (meta.programType) {
        queryProgram.equalTo("programType", meta.programType);
    }
    if (meta.status) {
        queryProgram.equalTo("status", meta.status);
    }
    if (meta.year && meta.year.length === 4) {
        queryProgram.equalTo("year", meta.year);
    }
    queryProgram.limit(10000);
    const programRecords = await queryProgram.find({useMasterKey: true});
    let programs = [];

    for (let i in programRecords) {
        let ele = {};
        let queryOrg = new Parse.Query("Organization");
        queryOrg.limit(1);
        queryOrg.equalTo("objectId", programRecords[i].get("orgId"));
        let orgRecord = await queryOrg.first({useMasterKey: true});

        let queryApplication = new Parse.Query("Application");
        queryApplication.equalTo("programId", programRecords[i].id);
        let appRecord = await queryApplication.find({useMasterKey: true});
        appRecord.forEach((app) => {
            if (app.get('sectionIndex') === '1') {
                ele["year"] = app.get('content')['1']['programs'] ? app.get('content')['1']['programs'][0]['startYear'] || '' : '';
            }
            if (app.get('sectionIndex') === '10') {
                ele["awardedAmount"] = app.get('content') ? app.get('content')['2'] : '0';
                ele["actualAmount"] = app.get('content') ? app.get('content')['1'] ? [0]['budget'] : '' : '0';
            }
        });

        ele["userId"] = programRecords[i].get("userId");
        ele["type"] = programRecords[i].get("type");
        ele["status"] = programRecords[i].get("status");
        ele["objectId"] = programRecords[i].id;
        ele["programType"] = programRecords[i].get("programType");
        ele["org"] = orgRecord;
        ele["orgName"] = orgRecord ? orgRecord.get('name') : '';
        ele["createdAt"] = programRecords[i].get("createdAt");
        ele["updatedAt"] = programRecords[i].get("updatedAt");

        if ((meta.organizationName || '').trim()) {
            const orgName = orgRecord.get('name') || '';
            if (orgName.includes((meta.organizationName || '').trim())) {
                return programs.push(ele);
            }
        } else {
            programs.push(ele);
        }
    }
    return programs;
};

const updateProgramByIdToCloseStatus = async (meta) => {
    if (!meta.sessionToken)
        throw new Error("No sessionToken");

    let queryProgram = new Parse.Query(Parse.Program);

    let programRecord = await queryProgram.first({ useMasterKey: true });
    programRecord.equalTo("objectId", meta.programId);

    meta.closeReport && programRecord.set("closeReport", meta.closeReport);
    meta.closeReport && programRecord.set("status", 'close');

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
}