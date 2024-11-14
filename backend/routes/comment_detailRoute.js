const express = require("express");
const router = express.Router();

const comment_detailController = require("../controllers/comment_detailController");

router.get("/comment_detail/:id", comment_detailController.getCommentDetailById);

module.exports = router;
