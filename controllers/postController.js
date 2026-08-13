const Post = require('../models/Post');

// @desc    Get all active posts feed
// @route   GET /api/posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isActive: true })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create media post
// @route   POST /api/posts
const createPost = async (req, res) => {
  try {
    const { type, title, description, mediaUrl, thumbnailUrl } = req.body;

    if (!type || !title || !mediaUrl) {
      return res.status(400).json({ message: 'Type, title, and mediaUrl are required' });
    }

    const post = await Post.create({
      userId: req.user._id,
      type,
      title,
      description: description || '',
      mediaUrl,
      thumbnailUrl: thumbnailUrl || mediaUrl,
    });

    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.likes += 1;
    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.user.role !== 'admin' && post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  createPost,
  likePost,
  deletePost,
};
