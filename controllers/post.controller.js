const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const Post = require("../models/post.model");

/*
 * @desc  create post
 * @route POST /api/post
 * @access Private
 */
const createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { imagePost, caption } = req.body;
  const { _id, username, avatar } = req.user;

  const post = new Post({
    imagePost,
    caption,
    user: _id,
    name: username,
    avatar,
  });

  await post.save();
  req.user.postsCreated.push(post._id);
  await req.user.save();

  res.status(201).json(post);
});

/*
 * @desc  get all post
 * @route GET /api/post
 * @access Private
 */
const getAllPost = asyncHandler(async (req, res) => {
  const { following } = req.user;
  const listUserGetPost = [...following, req.user._id];

  const posts = await Post.find({ user: { $in: listUserGetPost } }).sort({
    createdAt: "desc",
  });

  res.status(200).json(posts);
});

/*
 * @desc  get all post user created by userId
 * @route POST /api/post/:userId
 * @access Private
 */
const getAllPostByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const posts = await Post.find({ user: userId }).sort({ createdAt: "desc" });
  res.status(200).json(posts);
});

module.exports = { createPost, getAllPost, getAllPostByUserId };
