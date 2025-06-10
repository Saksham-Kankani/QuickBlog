import fs from "fs";
import imagekit from "../config/imageKit.js";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import main from ".././config/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, category, description, isPublished } = JSON.parse(
      req.body.blog
    );

    const imageFile = req.file;

    if (!title || !description || !imageFile || !category) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    // Upload image to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer, //required
      fileName: imageFile.originalname, //required
      folder: "/blogs",
    });

    //optimise through imagekit url transformation

    const optimisedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        {
          quality: "auto", //Auto compression
          format: "webp", // Convert to modern format
          width: "1280", //Width resizing
        },
      ],
    });

    const image = optimisedImageUrl;

    await Blog.create({
      title,
      subTitle,
      category,
      description,
      image,
      isPublished,
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });

    res.json({ success: true, blogs });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    return res.json({ success: true, blog });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;

    await Blog.findByIdAndDelete(id);

    await Comment.deleteMany({ blog: id });
    return res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;

    const blog = await Blog.findById(id);

    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({
      blog,
      name,
      content,
    });
    res.json({
      success: true,
      message: "Comment added for review",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getComment = async (req, res) => {
  try {
    const { blogId } = req.body;

    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt + " Generate blog content for this topic in simple text format"
    );
    res.json({
      success: true,
      content,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
