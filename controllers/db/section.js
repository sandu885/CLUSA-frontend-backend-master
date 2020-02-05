const createNewSection = async(programType, sectionIndex, numOfSubsection, questionType, numOfChoice, required, hasFiles) => {
    if (!programType)
        throw new Error("No program type");
    if (!sectionIndex)
        throw new Error("No section index");
    if (!numOfSubsection)
        throw new Error("No number of subsections");
    if (!questionType)
        throw new Error("No question type");
    if (!numOfChoice)
        throw new Error("No number of choices");
    if (questionType.length != numOfSubsection || numOfChoice.length != numOfSubsection)
        throw new Error("Section information does not match total number of subsections");
    if (required == undefined)
        throw new Error("Doesn't declare required section or not");
    if (hasFiles == undefined)
        throw new Error("Doesn't declare the section has files or not");
    let section = await findSectionByIndexAndProgramType(sectionIndex, programType);
    if (!section) {
        let Section = Parse.Object.extend("Section");
        section = new Section();
        section.set("programType", programType);
        section.set("sectionIndex", sectionIndex);
    }
    section.set("numOfSubsection", numOfSubsection);
    section.set("questionType", questionType);
    section.set("numOfChoice", numOfChoice);
    section.set("required", required);
    section.set("hasFiles", hasFiles);
    return await section.save(null,{useMasterKey: true});
}

const findSectionByIndexAndProgramType = async(sectionIndex, programType) => {
    let querySection = new Parse.Query("Section");
    querySection.limit(10000);
    querySection.equalTo("sectionIndex", sectionIndex);
    querySection.equalTo("programType", programType);
    return await querySection.first({useMasterKey: true});
}

const fetchAllSectionsByProgramType = async(programType) => {
    let querySection = new Parse.Query("Section");
    querySection.limit(10000);
    querySection.equalTo("programType", programType);
    let sectionRecords = await querySection.find({useMasterKey: true}), sections = {};
    for (let i in sectionRecords) {
        let ele = {};
        ele["programType"] = sectionRecords[i].get("programType");
        ele["numOfSubsection"] = parseInt(sectionRecords[i].get("numOfSubsection"), 10);
        ele["questionType"] = sectionRecords[i].get("questionType");
        ele["numOfChoice"] = sectionRecords[i].get("numOfChoice");
        ele["required"] = sectionRecords[i].get("required");
        ele["hasFiles"] = sectionRecords[i].get("hasFiles");
        sections[sectionRecords[i].get("sectionIndex")] = ele;
    }
    return sections;
}

module.exports = {
    createNewSection,
    findSectionByIndexAndProgramType,
    fetchAllSectionsByProgramType
}