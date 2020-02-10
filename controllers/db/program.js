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

const fetchAllProgramsByOrgId = async(orgId) => {
    if (!orgId)
        throw new Error("No organization id");
    let queryProgram = new Parse.Query("Program");
    queryProgram.limit(10000);
    queryProgram.equalTo("orgId", orgId);
    return await queryProgram.find({useMasterKey: true});
}

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
        ele["userId"] = programRecords[i].get("userId");
        ele["type"] = programRecords[i].get("type");
        ele["status"] = programRecords[i].get("status");
        ele["objectId"] = programRecords[i].id;
        ele["programType"] = programRecords[i].get("programType");
        ele["awardAmount"] = 45;
        ele["amount"] = 45;
        ele["org"] = orgRecord;
        ele["orgName"] = orgRecord.get('name');

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
    };
    return programs;
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
    findProgramByOrgIdAndProgramType
}