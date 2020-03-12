const moment = require('moment');
const TOOL = require('../tool/tool');

const createNewCommentSaved = async (meta) => {
  console.log('\n\n\nJSON.stringify\n\n\n', meta);
  if (!meta.note)
    throw new Error('Please enter the comment.');

  let queryUser = new Parse.Query('User');
  queryUser.equalTo("objectId", meta.userId);
  let user = await queryUser.first({ useMasterKey: true });

  if (!user)
    throw new Error('User detail is not proper.');

  let Comment = Parse.Object.extend("Comment"), comment = new Comment();

  comment.set('programId', meta.programId);
  comment.set('orgId', meta.orgId);

  if (meta.note)
    comment.set('note', meta.note);

  comment.set('commentDate', moment().format());
  comment.set('userId', meta.userId);
  comment.set('username', user.get('username'));
  comment.set('type', meta.type);

  const commentSaved = await comment.save(null,{useMasterKey: true});
  console.log('\n\nComment Saved saved in the database commentSaved', commentSaved, '\n\n');
  return commentSaved;
};

const fetchAllCommentByOrgIdProgId = async (meta) => {
  if (!meta.orgId)
    throw new Error("No organization id");
  if (!meta.programId)
    throw new Error("No program id");

  let queryComment = new Parse.Query('Comment');
  queryComment.equalTo("orgId", meta.orgId);
  queryComment.equalTo("programId", meta.programId);
  const allComments = await queryComment.find({useMasterKey: true});
  const commentData = [];
  for (let i in allComments) {
    let ele = [];
    let queryProgram = new Parse.Query('Program');
    queryProgram.equalTo("objectId", meta.programId);
    const program = await queryProgram.first({useMasterKey: true});
    ele = { ...JSON.parse(JSON.stringify(allComments[i])), program };
    commentData.push(ele)
  }
  return commentData;
};

const updateCommentById = async (meta) => {
  let queryComment = new Parse.Query('Comment');
  queryComment.equalTo("objectId", meta.objectId);
  let comment = await queryComment.first({ useMasterKey: true });

  if (meta.note)
    comment.set('note', meta.note);

  comment.set('commentDate', moment().format());

  const commentSaved = await comment.save(null,{useMasterKey: true});
  console.log('\n\n Comment saved saved in the database comment saved', commentSaved, '\n\n');
  return commentSaved;
};

const deleteCommentById = async (meta) => {
  let queryComment = new Parse.Query('Comment');
  queryComment.equalTo("objectId", meta.objectId);
  let comment = await queryComment.first({ useMasterKey: true });

  const commentDeleted = await comment.destroy();
  console.log('\n\n Comment delete from the database program report', commentDeleted, '\n\n');
  return commentDeleted;
};

const updateCommentProgramStatus = async (meta) => {
  if (!meta.objectId)
    throw new Error('Please enter the program details.');

  let queryProgram = new Parse.Query('Program');
  queryProgram.equalTo("objectId", meta.objectId);
  let program = await queryProgram.first({ useMasterKey: true });

  if (!program)
    throw new Error('Provide proper program details');

  let queryUser = new Parse.Query('User');
  queryUser.equalTo("orgId", meta.orgId);
  let user = await queryUser.first({ useMasterKey: true });

  let email = '';
  if (user.get('email'))
    email = user.get('email');
  else
    email = user.get('emailAddress');

  const queryOrg = new Parse.Query('Organization');
  queryOrg.equalTo("objectId", meta.orgId);
  const orgRecord = await queryOrg.first({ useMasterKey: true });

  await TOOL.programStatusUpdate(email, user.get('username'), program.get('status'), meta.status);
  await TOOL.programStatusUpdate('', '', program.get('status'), meta.status, orgRecord.get('name'));
  program.set('status', meta.status);
  const programSave = await program.save(null,{useMasterKey: true});

  console.log('\n\n Program Status from the database program status', '\n\n');
  return programSave;
};

module.exports = {
  createNewCommentSaved,
  fetchAllCommentByOrgIdProgId,
  updateCommentById,
  deleteCommentById,
  updateCommentProgramStatus,
};
