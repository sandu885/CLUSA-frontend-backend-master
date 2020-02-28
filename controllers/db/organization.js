const PROGRAM = require("../db/program");
// create new Organization
const createNewOrg = async (name, region, type, note, files, address1, address2, city, state, zipcode, parentOrg) => {
    console.log("Organization type is " + type);
    if ((type === '1' || type === '2') && (!files || !files['certificate'] || files['certificate'].length == 0))
        throw new Error("No certificate");
    if (type === '2' && (!files || !files['mou'] || files['mou'].length == 0))
        throw new Error("No enough certificate files, You need to upload both files");
    if (type === '3' && !note)
        throw new Error("Missing specific information for organization type")
    let Organization = Parse.Object.extend("Organization"), org = new Organization();
    org.set("name", name);
    org.set("region", region);
    org.set("type", type);
    org.set("note", note);
    org.set("address1", address1);
    if (files && files['certificate'] && files['certificate'].length > 0)
        org.set("certificateFiles", files['certificate']);
    if (files && files['mou'] && files['mou'].length > 0)
        org.set("mou", files['mou']);
    if (address2 != undefined)
        org.set("address2", address2);
    org.set("city", city);
    org.set("state", state);
    org.set("zipcode", zipcode);
    if (parentOrg != undefined)
        org.set("parentOrg", parentOrg);
    return await org.save(null,{useMasterKey: true});
}

// Update organization information
const updateOrgById = async (orgId, name, region, type, note, files, address1, address2, city, state, zipcode, parentOrg) => {
    console.log("Organization type is " + type);
    let orgRecord = await findOrgById(orgId);
    if ((type === '1' || type === '2') && !orgRecord.get('certificateFiles') && (!files || !files['certificate']))
        throw new Error("No certificate");
    if (type === '2' && !orgRecord.get('mou') && (!files || !files['mou']))
        throw new Error("No enough certificate files, You need to upload both files");
    if (type === '3' && !note)
        throw new Error("Missing specific information for organization type");
    orgRecord.set("name", name);
    orgRecord.set("region", region);
    orgRecord.set("type", type);
    orgRecord.set("note", note);
    orgRecord.set("address1", address1);
    if (files && files['certificate'] && files['certificate'].length > 0)
        orgRecord.set("certificateFiles", files['certificate']);
    if (files && files['mou'] && files['mou'].length > 0)
        orgRecord.set("mou", files['mou']);
    if (address2 != undefined)
        orgRecord.set("address2", address2);
    orgRecord.set("city", city);
    orgRecord.set("state", state);
    orgRecord.set("zipcode", zipcode);
    if (parentOrg != undefined)
        orgRecord.set("parentOrg", parentOrg);
    return await orgRecord.save(null,{useMasterKey: true});
}

const findOrgById = async(orgId) => {
    let queryOrg = new Parse.Query("Organization");
    queryOrg.equalTo("objectId", orgId);
    return await queryOrg.first({useMasterKey: true});
}

const findOrgByName = async(orgName) => {
    let queryOrg = new Parse.Query("Organization");
    queryOrg.equalTo("name", orgName);
    return await queryOrg.first({useMasterKey: true});
}

// get all organizations stored in the database
const fetchAllOrgs = async(user) => {
    // if (user.get("userType") != "0")
    //     throw new Error("No permission to fetch all organizations");
    let queryOrg = new Parse.Query("Organization");
    queryOrg.limit(10000);
    let orgRecords = await queryOrg.find({useMasterKey: true});
    let queryProgram = new Parse.Query("Program");
    queryProgram.limit(10000);
    let programRecords = await queryProgram.find({useMasterKey: true});

    console.log("fetchAllOrgs: successfully get all organizations and programs");
    let programList = {};
    for (let i in programRecords) {
        programList[programRecords[i].get("orgId")] = programRecords[i].get("status");
    }
    console.log("fetchAllOrgs: successfully stored all program and organization pairs");
    let orgList = await Promise.all(orgRecords.map(async org => {
        let ele = {};
        ele["name"] = org.get("name");
        ele["region"] = org.get("region");
        ele["type"] = org.get("type");
        ele["note"] = org.get("note");
        ele["address1"] = org.get("address1");
        ele["address2"] = org.get("address2");
        ele["city"] = org.get("city");
        ele["state"] = org.get("state");
        ele["zipcode"] = org.get("zipcode");
        ele["objectId"] = org.id;
        if (!programList[org.id])
            ele["status"] = "not applied";
        else
            ele["status"] = programList[org.id];
        return ele;
    }));
    return orgList;
}

// Get both general organization information and user account information
const getOrgInfoById = async(user, orgId) => {
    if (user.get("userType") == '0') {
        if (!orgId)
            throw new Error("No organization id");
    } else if (user.get("userType") == '1') {
        orgId = user.get("orgId");
    }
    if (!orgId)
        throw new Error("wrong user type");
    let org = await findOrgById(orgId);
    console.log("getOrgInfoById: successfully get organization information");
    if (!org)
        throw new Error("Wrong organization id");
    let queryUser = new Parse.Query("User");
    queryUser.limit(10000);
    queryUser.equalTo("orgId", orgId);
    let userRecord = await queryUser.first({useMasterKey: true});
    console.log("getOrgInfoById: successfully get user information");
    if (!userRecord)
        throw new Error("No user found for this organization id");
    return {
        organization: {
            name: org.get("name"),
            region: org.get("region"),
            type: org.get("type"),
            note: org.get("note"),
            certificate: org.get('certificateFiles'),
            mou: org.get('mou'),
            address1: org.get("address1"),
            address2: org.get("address2"),
            city: org.get("city"),
            state: org.get("state"),
            zipcode: org.get("zipcode"),
            parentOrg: org.get('parentOrg')
        },
        user: {
            firstName: userRecord.get("firstName"),
            lastName: userRecord.get("lastName"),
            title: userRecord.get("title"),
            phone: userRecord.get("phone"),
            email: userRecord.get("emailAddress") ? userRecord.get("emailAddress") : userRecord.get("email"),
            mission: userRecord.get("mission"),
            year: userRecord.get("year"),
            members: userRecord.get("members"),
            programInfo: userRecord.get("programInfo"),
            linkedin: userRecord.get("linkedin"),
            web: userRecord.get("web"),
            otherInfo: userRecord.get("note"),
            status: userRecord.get('status'),
        }
    }
}

// update both general organization information and user account information
const updateOrgInfo = async(meta, files) => {
    if (!meta.sessionToken)
        throw new Error("No sessionToken");
    let querySession = new Parse.Query(Parse.Session);
    querySession.equalTo("sessionToken", meta.sessionToken);
    querySession.include("user");
    let sessionRecord = await querySession.first({useMasterKey: true});
    console.log("updateOrgInfo: successfully get session information");
    if (!sessionRecord)
        throw new Error("sessionToken expired");
    let user = await sessionRecord.get('user'), orgId;
    if (user.get('userType') == '0') {
        if (!meta.orgId)
            throw new Error("No organization id");
        orgId = meta.orgId;
    } else if (user.get('userType') == '1') {
        orgId = user.get('orgId');
    }
    if (!orgId)
        throw new Error("Wrong user type");
    let queryUser = new Parse.Query(Parse.User);
    queryUser.limit(10000);
    queryUser.equalTo("orgId", orgId);
    let userRecord = await queryUser.first({useMasterKey: true});
    console.log("updateOrgInfo: successfully get user information");
    if (!meta.orgName)
        throw new Error("No organization name");
    if (!meta.orgRegion)
        throw new Error("No organization region");
    if (!meta.orgType)
        throw new Error("No organization type");
    if (meta.orgType != 1 && meta.orgType != 2 && meta.orgType != 3)
        throw new Error("Wrong organization type");
    if (!meta.address1)
        throw new Error("No organization address");
    if (!meta.city)
        throw new Error("No organization city");
    if (!meta.state)
        throw new Error("No organization state");
    if (!meta.zipcode)
        throw new Error("No organization zip code");
    if (!meta.firstName)
        throw new Error("No first name");
    userRecord.set("firstName", meta.firstName);
    if (!meta.lastName)
        throw new Error("No last name");
    userRecord.set("lastName", meta.lastName);
    if (!meta.title)
        throw new Error("No contact title");
    userRecord.set("title", meta.title);
    if (!meta.phone)
        throw new Error("No contact phone");
    userRecord.set("phone", meta.phone);
    // console.log('\n\nmeta.password', meta.password, '\n\n\n');
    // if (!meta.password)
    //     throw new Error("No password");
    // userRecord.set("password", JSON.parse(meta.password));
    if (!meta.email)
        throw new Error("No contact email");
    userRecord.set("emailAddress", meta.email);
    if (!meta.mission)
        throw new Error("No organization mission");
    userRecord.set("mission", meta.mission);
    if (!meta.year)
        throw new Error("No found year");
    userRecord.set("year", meta.year);
    if (!meta.members)
        throw new Error("No members");
    userRecord.set("members", JSON.parse(meta.members));
    if (!meta.programInfo)
        throw new Error("No programs");
    userRecord.set("programInfo", meta.programInfo);
    if (meta.linkedin != undefined)
        userRecord.set("linkedin", meta.linkedin);
    if (meta.web != undefined)
        userRecord.set("web", meta.web);
    if (meta.otherInfo != undefined)
        userRecord.set("note", meta.otherInfo);
    let org = await updateOrgById(orgId, meta.orgName, meta.orgRegion, meta.orgType, meta.orgTypeNote, files, meta.address1, meta.address2, meta.city, meta.state, meta.zipcode, meta.parentOrg);
    userRecord.set("orgName", org.get('name'));
    await userRecord.save(null,{useMasterKey: true});
    console.log('updateOrgInfo: successfully update user information');
    return {
        organization: {
            name: org.get("name"),
            region: org.get("region"),
            type: org.get("type"),
            note: org.get("note"),
            certificate: org.get('certificateFiles'),
            mou: org.get('mou'),
            address1: org.get("address1"),
            address2: org.get("address2"),
            city: org.get("city"),
            state: org.get("state"),
            zipcode: org.get("zipcode"),
            parentOrg: org.get('parentOrg')
        },
        user: {
            firstName: userRecord.get("firstName"),
            lastName: userRecord.get("lastName"),
            title: userRecord.get("title"),
            phone: userRecord.get("phone"),
            email: userRecord.get("emailAddress"),
            mission: userRecord.get("mission"),
            year: userRecord.get("year"),
            members: userRecord.get("members"),
            programInfo: userRecord.get("programInfo"),
            linkedin: userRecord.get("linkedin"),
            web: userRecord.get("web"),
            otherInfo: userRecord.get("note"),
            status: userRecord.get('status'),
        }
    }
}

// Get the Certificate file user uploaded
const getCertificateFile = async(user, fileType, orgId) => {
    if (!fileType)
        throw new Error("No file type");
    console.log('File type is ' + fileType);
    if (user.get('userType') == '0') {
        if (!orgId)
            throw new Error("No organization id");
    } else if (user.get('userType') == '1') {
        orgId = user.get('orgId');
    }
    let orgRecord = await findOrgById(orgId);
    if (!orgRecord)
        throw new Error('Wrong organization id');
    if (!orgRecord.get(fileType) || orgRecord.get(fileType).length == 0) {
        return 'No certificate file';
    } else {
        return orgRecord.get(fileType)[0]['path'];
    }
}

module.exports = {
    createNewOrg,
    updateOrgById,
    findOrgById,
    findOrgByName,
    fetchAllOrgs,
    getOrgInfoById,
    updateOrgInfo,
    getCertificateFile,
}
