const PROGRAMCOMMENT = require("../db/programComment");

const createNewComment = async (req, res) => {
  console.log("createNewComment: start", JSON.stringify(req.body), '\n');
  try {
    let comment = await PROGRAMCOMMENT.createNewCommentSaved(req.body);
    console.log("create new Comment success");
    res.status(200).json({
      message: "Comment successfully creates",
      commentId: comment.id,
    });
  } catch(error) {
    console.log("createNewCommentSaved: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const fetchAllCommentByOrgIdProgId = async (req, res) => {
  console.log("CommentByOrgIdProgId: start");
  try {
    let comments = await PROGRAMCOMMENT.fetchAllCommentByOrgIdProgId(req.body);
    console.log("Successfully fetch a comment by OrgId ProgId");
    res.status(200).json({
      message: 'Successfully fetch a comments details',
      comments: comments,
    });
  } catch(error) {
    console.log("fetchAllCommentByOrgIdProgId: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const updateCommentById = async (req, res) => {
  console.log("updateCommentById: start");
  try {
    let comment = await PROGRAMCOMMENT.updateCommentById(req.body);
    console.log("Successfully update comment");
    res.status(200).json({
      message: 'Successfully update comment',
      comment: comment,
    });
  } catch(error) {
    console.log("updateCommentById: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const deleteCommentById = async (req, res) => {
  console.log("deleteCommentById: start");
  try {
    let comment = await PROGRAMCOMMENT.deleteCommentById(req.body);
    console.log("Successfully delete comment");
    res.status(200).json({
      message: 'Delete comment',
      comment: comment,
    });
  } catch(error) {
    console.log("deleteCommentById: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

const updateCommentProgramStatus = async (req, res) => {
  console.log("updateCommentProgramStatus: start");
  try {
    let program = await PROGRAMCOMMENT.updateCommentProgramStatus(req.body);
    console.log("Successfully update program");
    res.status(200).json({
      message: 'Successfully update program',
      program,
    });
  } catch(error) {
    console.log("updateProgramStatus: " + error.message);
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  createNewComment,
  fetchAllCommentByOrgIdProgId,
  updateCommentById,
  deleteCommentById,
  updateCommentProgramStatus,
};
