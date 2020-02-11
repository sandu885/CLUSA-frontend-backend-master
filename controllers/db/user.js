const ORG = require("../db/organization");
const TOOL = require('../tool/tool');
const jwt = require('jwt-simple');
const jwtSecret = 'fe1a1915a379f3be5394b64d14794932';
// find user by username
const findUserByUsername = async (username) => {
    let queryUser = new Parse.Query(Parse.User);
    queryUser.limit(10000);
    queryUser.equalTo("username", username);
    return await queryUser.first({useMasterKey: true});
}

// find user by user id
const findUserByUserId = async (userId) => {
    let queryUser = new Parse.Query(Parse.User);
    queryUser.limit(10000);
    queryUser.equalTo("objectId", userId);
    return await queryUser.first({useMasterKey: true});
}

// check the username is available or not
const checkUsernameAvail = async (username) => {
    if (!username)
        throw new Error("No username");
    let queryUser = new Parse.Query(Parse.User);
    queryUser.equalTo("username", username);
    let userRecord = await queryUser.first({useMasterKey: true});
    if (userRecord != undefined)
        throw new Error("Username not available");
}

// User signup 
const signup = async(meta, files) => {
    Parse.User.enableUnsafeCurrentUser();
    let user = new Parse.User();
    if (!meta.userType)
        throw new Error("No user type");
    user.set("userType", meta.userType);
    if (!meta.username)
        throw new Error("No username");
    await checkUsernameAvail(meta.username);
    user.set("username", meta.username);
    if (!meta.password)
        throw new Error("No password");
    user.set("password", meta.password);
    if (meta.userType == "1") {
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
        user.set("firstName", meta.firstName);
        if (!meta.lastName)
            throw new Error("No last name");
        user.set("lastName", meta.lastName);
        if (!meta.title)
            throw new Error("No contact title");
        user.set("title", meta.title);
        if (!meta.phone)
            throw new Error("No contact phone");
        user.set("phone", meta.phone);
        if (!meta.email)
            throw new Error("No contact email");
        user.set("emailAddress", meta.email);
        if (!meta.mission)
            throw new Error("No organization mission");
        user.set("mission", meta.mission);
        if (!meta.year)
            throw new Error("No found year");
        user.set("year", meta.year);
        if (!meta.members)
            throw new Error("No members");
        user.set("members", JSON.parse(meta.members));
        if (!meta.programInfo)
            throw new Error("No programs");
        user.set("programInfo", meta.programInfo);
        if (meta.linkedin != undefined) 
            user.set("linkedin", meta.linkedin);
        if (meta.web != undefined)
            user.set("web", meta.web);
        if (meta.otherInfo != undefined)
            user.set("note", meta.otherInfo);
        if (!meta.agree || meta.agree == false)
            throw new Error("Didn't agree with the policy");
        let org = await ORG.createNewOrg(meta.orgName, meta.orgRegion, meta.orgType, meta.orgTypeNote, files, meta.address1, meta.address2, meta.city, meta.state, meta.zipcode, meta.parentOrg);
        console.log("signup: successfully create a new organization");
        user.set("orgId", org.id);
        user.set("orgName", org.get('name'));
        user.set("status", "not applied");
        await user.signUp(null, {useMasterKey: true});
        await TOOL.sendEmail(meta.email, meta.username, meta.password, 'signup');
    } else  if (meta.userType == "0") {
        await user.signUp(null, {useMasterKey: true});
    } else {
        throw new Error("Wrong user type");
    }
    return "User signup success";
}

// User login
const login = async(username, password) => {
    if (!username)
        throw new Error("login: No User Name");
    if (!password)
        throw new Error("login: No Password");
    Parse.User.enableUnsafeCurrentUser();
    let queryUser = new Parse.Query(Parse.User);
    queryUser.equalTo("username", username);
    let userRecord = await queryUser.first({useMasterKey: true});
    if (!userRecord)
        throw new Error("login: Invalid usename");
    let querySession = new Parse.Query(Parse.Session);
    querySession.equalTo("user", userRecord);
    let sessionRecords = await querySession.find({useMasterKey: true});
    await Promise.all(sessionRecords.map(sessionRecord => sessionRecord.destroy({useMasterKey: true})));
    return await Parse.User.logIn(username, password);
}

// User forget password
const forgetPassword = async({ emailAddress, organizationName }) => {
    if (!emailAddress && !organizationName)
        throw new Error("Pass email address or organization name2");

    Parse.User.enableUnsafeCurrentUser();
    let queryUser = new Parse.Query(Parse.User);
    let queryOrganization = new Parse.Query("Organization");
    if (emailAddress) {
        queryUser.equalTo("emailAddress", emailAddress);
        let userRecord = await queryUser.first({useMasterKey: true});
        if (!userRecord)
            throw new Error("Invalid email");

        const payload = { email: userRecord.get("emailAddress"), username: userRecord.get("username") };
        const token = jwt.encode(payload, jwtSecret);
        await TOOL.forgetPassword(emailAddress, userRecord.get("username"), token);
    }
    if (organizationName) {
        queryOrganization.equalTo("name", organizationName);
        let orgRecord = await queryOrganization.first({useMasterKey: true});
        if (!orgRecord)
            throw new Error("Invalid organization name");

        queryUser.equalTo("orgId", orgRecord.id);
        let userRecord = await queryUser.first({useMasterKey: true});
        if (!userRecord)
            throw new Error("forget: Invalid organization name user not found");

        const payload = { email: userRecord.get("emailAddress"), username: userRecord.get("username") };
        const token = jwt.encode(payload, jwtSecret);

        await TOOL.forgetPassword(userRecord.get("emailAddress"), userRecord.get("username"), token);
    }

    return "Reset link send successfully"
}

// User forget password
const resetPassword = async({ newPassword, resetPasswordToken }) => {
    if (!newPassword)
        throw new Error("Pass email address or organization name2");

    const tokenPayload = jwt.decode(resetPasswordToken, jwtSecret);

    Parse.User.enableUnsafeCurrentUser();
    let queryUser = new Parse.Query(Parse.User);
    queryUser.equalTo("emailAddress", tokenPayload.email);
    queryUser.equalTo("username", tokenPayload.username);
    let userRecord = await queryUser.first({ useMasterKey: true });
    if (!userRecord)
        throw new Error("Reset password token is not valid.");

    userRecord.set("password", newPassword);
    await userRecord.save(null, { useMasterKey: true });

    return "Password updated successfully "
}

// User logout
const logout = async (sessionToken) => {
    if (!sessionToken)
      throw new Error("No sessionToken");
    let querySession = new Parse.Query(Parse.Session);
    querySession.equalTo("sessionToken", sessionToken);
    let sessionRecord = await querySession.first({useMasterKey: true});
    if (!sessionRecord)
      throw new Error("sessionToken expired");
    await sessionRecord.destroy({useMasterKey: true});
}

// User login with a sessionToken
const logger = async(sessionToken) => {
    if (!sessionToken)
      throw new Error("No sessionToken");
    let querySession = new Parse.Query(Parse.Session);
    querySession.equalTo("sessionToken", sessionToken);
    querySession.include("user");
    let sessionRecord = await querySession.first({useMasterKey: true});
    if (!sessionRecord)
      throw new Error("sessionToken expired");
    return sessionRecord.get('user');
}

// check if the userId and orgId is match or not
const findUserByUserIdAndOrgId = async(userId, orgId) => {
    if (!userId)
        throw new Error("No user id");
    if (!orgId)
        throw new Error("No organization id");
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", userId);
    queryUser.equalTo("orgId", orgId);
    return await queryUser.first({useMasterKey: true});
}

const findAllUsersByOrgId = async(orgId) => {
    let queryUser = new Parse.Query("User");
    queryUser.limit(10000);
    queryUser.equalTo("orgId", orgId);
    return await queryUser.find({useMasterKey: true});
}

// get all Users stored in the database
const fetchAllUsers = async(user) => {
    if (user.get("userType") != "0")
        throw new Error("No permission to fetch all Users");
    let queryUser = new Parse.Query("User");
    queryUser.doesNotExist('isDeleted');

    const deletedQuery = new Parse.Query("User");
    deletedQuery.equalTo('isDeleted', false);

    const query = Parse.Query.or(queryUser, deletedQuery);
    // query.descending("createdAt");
    query.limit(10000);

    let orgRecords = await query.find({useMasterKey: true});
    console.log("fetchAllUsers: successfully stored all Users data");
    let userList = await Promise.all(orgRecords.map(async u => {
        let ele = {};
        ele["username"] = u.get("username");
        ele["firstName"] = u.get("firstName");
        ele["lastName"] = u.get("lastName");
        ele["title"] = u.get("title");
        ele["phone"] = u.get("phone");
        if (u.get("emailAddress"))
            ele["email"] = u.get("emailAddress");
        else
            ele["email"] = u.get("email");
        ele["year"] = u.get("year");
        ele["programInfo"] = u.get("programInfo");
        ele["note"] = u.get("note");
        ele["orgId"] = u.get("orgId");
        ele["orgName"] = u.get("orgName");
        ele["status"] = u.get("status");
        ele["objectId"] = u.id;
        return ele;
    }));
    return userList;
}

const findUserById = async ({ sessionToken, userId }) => {
    if (!sessionToken)
        throw new Error("No sessionToken");
    let queryUser = new Parse.Query("User");
    queryUser.equalTo("objectId", userId);
    return await queryUser.first({useMasterKey: true});
}

const updateUserById = async (meta) => {
    if (!meta.sessionToken)
        throw new Error("No sessionToken");
    let queryUser = new Parse.Query(Parse.User);

    let userRecord = await queryUser.first({ useMasterKey: true });
    queryUser.equalTo("objectId", meta.userId);
    meta.username && userRecord.set("username", meta.username);
    meta.firstName && userRecord.set("firstName", meta.firstName);
    meta.lastName && userRecord.set("lastName", meta.lastName);
    meta.email && userRecord.set("email", meta.email);
    meta.userType && userRecord.set("userType", meta.userType);
    meta.password && userRecord.set("userType", meta.password);

    return userRecord.save(null,{ useMasterKey: true });
}

const deleteUserById = async (meta) => {
    if (!meta.sessionToken)
        throw new Error("No sessionToken");
    console.log('Entered in the delete the user');
    let queryUser = new Parse.Query(Parse.User);

    queryUser.equalTo("objectId", meta.userId);
    let userRecord = await queryUser.first({ useMasterKey: true });

    userRecord.set("isDeleted", true);
    return userRecord.save(null,{ useMasterKey: true });
}

const createUserByAdmin = async (meta) => {
    if (!meta.sessionToken)
        throw new Error("No sessionToken");
    let User = Parse.Object.extend("User"), user = new User();
    meta.username && user.set("username", meta.username);
    meta.firstName && user.set("firstName", meta.firstName);
    meta.lastName && user.set("lastName", meta.lastName);
    meta.emailAddress && user.set("emailAddress", meta.email);
    meta.userType && user.set("userType", meta.userType);
    meta.password ? user.set("userType", meta.password) : user.set("password", 'test');

    const payload = { email: meta.emailAddress, username: meta.username };
    const token = jwt.encode(payload, jwtSecret);
    await TOOL.sendUserAddEmail(meta.emailAddress, meta.username, token);

    return user.save(null,{ useMasterKey: true });
}

module.exports = {
    findUserByUsername,
    findUserByUserId,
    checkUsernameAvail,
    signup,
    login,
    logout,
    logger,
    findUserByUserIdAndOrgId,
    forgetPassword,
    resetPassword,
    findAllUsersByOrgId,
    fetchAllUsers,
    findUserById,
    updateUserById,
    createUserByAdmin,
    deleteUserById,
}